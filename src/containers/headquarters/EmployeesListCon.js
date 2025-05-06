import React, { useState, useEffect } from 'react';
import EmployeesListCom from '../../components/headquarters/EmployeesListCom';
import axios from '../../service/axiosInstance';
import { useNavigate } from 'react-router-dom';

const EmployeesListCon = () => {
  // 라우터 네비게이션
  const navigate = useNavigate();
  
  // 상태 관리
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [search, setSearch] = useState({ searchTerm: '' });
  const [filters, setFilters] = useState({ 
    sort: 'empId', 
    order: 'asc',
    status: [] // 상태 필터 (재직, 휴직, 퇴사)
  });
  // 사원 유형 필터 (본사/점주)
  const [employeeType, setEmployeeType] = useState('본사');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 페이징 상태
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const rowsPerPage = 10;

  // 사원 데이터 가져오기
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        // 본사 직원과 점주를 구분하여 동일한 API 엔드포인트 호출
        const response = await axios.get('/api/employees', {
          params: { 
            empType: employeeType === '본사' ? 'HQ' : 'STORE'
          }
        });
        console.log(`${employeeType} 데이터:`, response.data);
        
        // 점주 데이터의 경우, rowNum 필드 추가 (1부터 시작하는 일련번호)
        let processedData = response.data;
        if (employeeType === '점주') {
          processedData = response.data.map((item, index) => ({
            ...item,
            rowNum: index + 1
          }));
        }
        
        // 받아온 데이터 저장
        setEmployees(processedData);
        setLoading(false);
      } catch (err) {
        console.error(`${employeeType} 데이터 로딩 실패:`, err);
        setError(`${employeeType} 데이터를 불러오는데 실패했습니다.`);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [employeeType]); // employeeType이 변경될 때마다 데이터를 다시 가져옴

  // 부서 데이터 가져오기
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('/api/departments');
        setDepartments(response.data);
      } catch (err) {
        console.error('부서 데이터 로딩 실패:', err);
        setError('부서 데이터를 불러오는데 실패했습니다.');
      }
    };

    fetchDepartments();
  }, []);
  
  // 사원 유형 변경 핸들러
  const handleEmployeeTypeChange = (type) => {
    setEmployeeType(type);
    setPage(1); // 타입이 변경되면 첫 페이지로 이동
    // 타입이 변경되면 새 API 호출이 useEffect에서 자동으로 실행됨
  };
  
  // 검색어와 필터 변경시 데이터 필터링
  useEffect(() => {
    if (!employees.length) return;
    
    let filtered = [...employees];
    
    // 1. 검색어로 필터링
    if (search.searchTerm) {
      const term = search.searchTerm.toLowerCase();
      filtered = filtered.filter((emp, index) => 
        emp.empName?.toLowerCase().includes(term) || // 이름 검색
        (employeeType === '본사' ? 
          emp.empId?.toString().includes(term) :    // 본사: 사번으로 검색 
          (index + 1).toString().includes(term)) || // 점주: 표시되는 점주번호로 검색
        (employeeType === '본사' ? 
          emp.deptName?.toLowerCase().includes(term) :  // 본사: 부서 검색
          emp.storeName?.toLowerCase().includes(term))  // 점주: 매장명 검색
      );
    }
    
    // 2. 상태로 필터링
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(emp => filters.status.includes(emp.empStatus));
    }
    
    // 3. 정렬
    if (filters.sort) {
      filtered = [...filtered].sort((a, b) => {
        let compareResult;
        
        // 점주 목록에서 empId 정렬은 rowNum 필드로 정렬
        if (employeeType === '점주' && filters.sort === 'empId') {
          compareResult = a.rowNum - b.rowNum;
        } else {
          switch (filters.sort) {
            case 'empId':
              compareResult = a.empId - b.empId;
              break;
            case 'hireDate':
              compareResult = a.hireDate.localeCompare(b.hireDate);
              break;
            default:
              compareResult = (a[filters.sort] || '').localeCompare(b[filters.sort] || '');
          }
        }
        
        // 오름차순/내림차순에 따라 결과 조정
        return filters.order === 'asc' ? compareResult : -compareResult;
      });
    }
    
    setFilteredEmployees(filtered);
    setTotalCount(filtered.length);
    setPage(1); // 필터링 결과가 변경되면 첫 페이지로 이동
  }, [search, filters, employees, employeeType]);

  // 검색어 핸들러
  const handleSearch = (searchTerm) => {
    setSearch({ searchTerm });
  };
  
  // 상태 필터 토글 핸들러
  const toggleStatusFilter = (status) => {
    setFilters(prev => {
      const currentStatuses = [...prev.status];
      const index = currentStatuses.indexOf(status);
      
      if (index >= 0) {
        currentStatuses.splice(index, 1); // 이미 있으면 제거
      } else {
        currentStatuses.push(status); // 없으면 추가
      }
      
      return { ...prev, status: currentStatuses };
    });
  };
  
  // 정렬 변경 핸들러
  const handleSortChange = (field) => {
    setFilters(prev => ({
      ...prev,
      sort: field,
      order: prev.sort === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  // 현재 페이지 데이터
  const pagedEmployees = filteredEmployees.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // 상세보기
  const handleDetail = async (empId) => {
    try {
      // 직원 상세 조회 API 호출
      const response = await axios.get(`/api/employees/${empId}`);
      console.log('상세 정보 데이터:', response.data);
      console.log('주소 필드 확인:', response.data.empAddr);
      
      // 점주의 경우 표시용 rowNum 복사
      if (employeeType === '점주') {
        // 현재 필터링된 데이터에서 해당 점주 찾기
        const foundItem = filteredEmployees.find(emp => emp.empId === empId);
        if (foundItem) {
          // 찾은 항목의 rowNum 값 사용
          response.data.rowNum = foundItem.rowNum;
        }
      }
      
      // 백엔드에서 받은 데이터 사용
      setSelectedEmployee(response.data);
      setModalOpen(true);
    } catch (err) {
      console.error(`${employeeType} 상세 정보 로딩 실패:`, err);
      setError(`${employeeType} 상세 정보를 불러오는데 실패했습니다.`);
    }
  };

  return (
    <EmployeesListCom
      departments={departments}
      employees={pagedEmployees}
      search={search.searchTerm}
      onSearch={handleSearch}
      filters={filters}
      toggleStatusFilter={toggleStatusFilter}
      onSortChange={handleSortChange}
      onDetail={handleDetail}
      modalOpen={modalOpen}
      selectedEmployee={selectedEmployee}
      onCloseModal={() => setModalOpen(false)}
      page={page}
      setPage={setPage}
      totalCount={totalCount}
      rowsPerPage={rowsPerPage}
      loading={loading}
      error={error}
      employeeType={employeeType}
      onEmployeeTypeChange={handleEmployeeTypeChange}
    />
  );
};

export default EmployeesListCon;
