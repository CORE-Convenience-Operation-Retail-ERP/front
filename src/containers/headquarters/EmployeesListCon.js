import React, { useState, useEffect } from 'react';
import EmployeesListCom from '../../components/headquarters/EmployeesListCom';
import axios from '../../service/axiosInstance';

const EmployeesListCon = () => {
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
        const response = await axios.get('/api/employees');
        
        // 본사 데이터만 필터링 (empId 15 이하인 데이터만)
        const filteredData = response.data.filter(emp => emp.empId <= 15);
        
        // 백엔드에서 이미 가공된 데이터를 저장
        setEmployees(filteredData);
        
        // 초기 필터링된 데이터 설정
        setFilteredEmployees(filteredData);
        setTotalCount(filteredData.length);
        setLoading(false);
      } catch (err) {
        console.error('사원 데이터 로딩 실패:', err);
        setError('사원 데이터를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

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
  
  // 검색어와 필터 변경시 데이터 필터링
  useEffect(() => {
    if (!employees.length) return;
    
    // 1. 검색어로 필터링
    let filtered = employees;
    
    if (search.searchTerm) {
      const term = search.searchTerm.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.empName?.toLowerCase().includes(term) || // 이름 검색
        emp.empId?.toString().includes(term) ||     // 사번 검색 
        emp.deptName?.toLowerCase().includes(term)  // 부서 검색
      );
    }
    
    // 2. 상태로 필터링
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(emp => filters.status.includes(emp.empStatus));
    }
    
    // 3. 정렬
    if (filters.sort) {
      filtered = [...filtered].sort((a, b) => {
        // 정렬 필드에 따라 비교 방식 변경
        let compareResult;
        switch (filters.sort) {
          case 'empId': 
            compareResult = a.empId - b.empId;
            break;
          case 'hireDate':
            // 날짜 형식이 "YYYY년 MM월 DD일"이므로 문자열 비교
            compareResult = a.hireDate.localeCompare(b.hireDate);
            break;
          default:
            // 문자열 필드는 기본 비교
            compareResult = (a[filters.sort] || '').localeCompare(b[filters.sort] || '');
        }
        
        // 오름차순/내림차순에 따라 결과 조정
        return filters.order === 'asc' ? compareResult : -compareResult;
      });
    }
    
    setFilteredEmployees(filtered);
    setTotalCount(filtered.length);
    setPage(1); // 필터링 결과가 변경되면 첫 페이지로 이동
  }, [search, filters, employees]);

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
      const response = await axios.get(`/api/employees/${empId}`);
      
      console.log('상세 정보 데이터:', response.data); // 디버깅용
      
      // 백엔드에서 이미 가공된 데이터를 그대로 사용
      setSelectedEmployee(response.data);
      setModalOpen(true);
    } catch (err) {
      console.error('사원 상세 정보 로딩 실패:', err);
      setError('사원 상세 정보를 불러오는데 실패했습니다.');
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
    />
  );
};

export default EmployeesListCon;
