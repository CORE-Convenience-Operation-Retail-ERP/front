import React, { useState, useEffect } from 'react';
import EmployeeManagementCom from '../../components/headquarters/EmployeeManagementCom';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from '../../service/axiosInstance';

const EmployeeManagementCon = () => {
  const { empId } = useParams(); // URL에서 사원 ID 가져오기
  const navigate = useNavigate();
  const location = useLocation();
  
  // URL에서 쿼리 파라미터 파싱
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type') || '본사'; // 기본값은 '본사'
  
  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 부서 정보 가져오기
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        console.log("부서 정보 요청 중...");
        const response = await axios.get('/api/departments');
        console.log("부서 정보 응답:", response.data);
        
        // 필요한 부서만 필터링하고 이름 변경
        const filteredDepartments = response.data
          .filter(dept => {
            // 유효한 부서 코드만 포함 (역할 코드는 제외)
            const validDeptCodes = ['HQ_HRM', 'HQ_HRM_M', 'HQ_BR', 'HQ_BR_M', 'HQ_PRO', 'HQ_PRO_M'];
            return validDeptCodes.includes(dept.deptCode);
          })
          .map(dept => {
            // EmployeeListService와 일치하는 부서명 매핑
            let displayName = dept.deptName;
            
            switch (dept.deptCode) {
              case 'HQ_HRM':
              case 'HQ_HRM_M':
                displayName = '인사팀';
                break;
              case 'HQ_BR':
              case 'HQ_BR_M':
                displayName = '지점관리팀';
                break;
              case 'HQ_PRO':
              case 'HQ_PRO_M':
                displayName = '상품관리팀';
                break;
              default:
                displayName = dept.deptName;
            }
            
            return {
              ...dept,
              deptName: displayName
            };
          });
        
        console.log("변환된 부서 정보:", filteredDepartments);
        setDepartments(filteredDepartments);
      } catch (err) {
        console.error('부서 정보를 가져오는 중 오류 발생:', err);
        // 임시 부서 데이터 - EmployeeListService의 변환 로직과 일치하게 수정
        const fallbackDepartments = [
          { deptCode: 'HQ_HRM', deptName: '인사팀' },
          { deptCode: 'HQ_BR', deptName: '지점관리팀' },
          { deptCode: 'HQ_PRO', deptName: '상품관리팀' }
        ];
        console.log("임시 부서 데이터 사용:", fallbackDepartments);
        setDepartments(fallbackDepartments);
      }
    };
    
    fetchDepartments();
  }, []);

  // 사원 정보 가져오기 (수정 모드인 경우)
  useEffect(() => {
    if (empId) {
      const fetchEmployee = async () => {
        setLoading(true);
        try {
          console.log(`사원 정보 요청: empId=${empId}`);
          // 2. 수정: 두 개의 API 엔드포인트를 시도하는 방식으로 변경
          // 새로 만든 엔드포인트 먼저 시도, 실패 시 기존 엔드포인트 사용
          try {
            // 2-1. 새 API 엔드포인트 시도 (/api/employee-management/{empId})
            const response = await axios.get(`/api/employee-management/${empId}`);
            // 3. 디버깅: 응답 데이터 확인
            console.log("새 API 응답 데이터:", response.data);
            
            // 날짜 형식 추가 처리
            const formattedData = {
              ...response.data,
              // ISO 형식으로 날짜 변환 (yyyy-MM-dd)
              hireDate: response.data.hireDate ? 
                (typeof response.data.hireDate === 'string' ? response.data.hireDate : response.data.hireDate.substring(0, 10)) 
                : '',
              // 부서 코드가 부서명으로 저장되어 있는 경우 부서 코드로 변환
              deptCode: mapDepartmentNameToCode(response.data.deptCode || response.data.deptName || '')
              // 참고: empStatus는 그대로 전달 (EmployeeManagementCom에서 변환)
            };
            
            console.log("변환된 사원 데이터:", formattedData);
            setEmployee(formattedData);
            setError(null);
          } catch (err) {
            // 2-2. 404 오류 시 기존 API 엔드포인트 시도 (/api/employees/{empId})
            if (err.response && err.response.status === 404) {
              console.log("새 API 실패, 기존 API로 재시도 중...");
              const fallbackResponse = await axios.get(`/api/employees/${empId}`);
              // 3. 디버깅: 응답 데이터 확인
              console.log("기존 API 응답 데이터:", fallbackResponse.data);
              
              // 날짜 형식 추가 처리
              const formattedData = {
                ...fallbackResponse.data,
                // 날짜가 "YYYY년 MM월 DD일" 형식일 경우 변환
                hireDate: fallbackResponse.data.hireDate ? 
                  (fallbackResponse.data.hireDate.includes('년') ? 
                    formatKoreanDateToISO(fallbackResponse.data.hireDate) : 
                    fallbackResponse.data.hireDate) 
                  : '',
                // 부서 코드가 부서명으로 저장되어 있는 경우 부서 코드로 변환
                deptCode: mapDepartmentNameToCode(fallbackResponse.data.deptCode || fallbackResponse.data.deptName || '')
                // 참고: empStatus는 그대로 전달 (EmployeeManagementCom에서 변환)
              };
              
              console.log("변환된 사원 데이터:", formattedData);
              setEmployee(formattedData);
              setError(null);
            } else {
              throw err;
            }
          }
        } catch (err) {
          console.error('사원 정보를 가져오는 중 오류 발생:', err);
          setError('사원 정보를 가져오는 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchEmployee();
    }
  }, [empId]);

  // 한국어 날짜 형식("YYYY년 MM월 DD일")을 ISO 형식("YYYY-MM-DD")으로 변환
  const formatKoreanDateToISO = (koreanDate) => {
    try {
      // "YYYY년 MM월 DD일" -> "YYYY-MM-DD"
      const parts = koreanDate.split(/년 |월 |일/);
      if (parts.length >= 3) {
        const year = parts[0].trim();
        const month = parts[1].trim().padStart(2, '0');
        const day = parts[2].trim().padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      return koreanDate;
    } catch (e) {
      console.error('날짜 형식 변환 오류:', e);
      return koreanDate;
    }
  };

  // 부서명을 부서 코드로 매핑하는 함수
  const mapDepartmentNameToCode = (deptName) => {
    // 부서명이 이미 코드인 경우 그대로 반환
    if (deptName.startsWith('HQ_')) {
      return deptName;
    }
    
    // 부서명을 코드로 변환
    switch (deptName) {
      case '인사팀':
        return 'HQ_HRM';
      case '지점관리팀':
        return 'HQ_BR';
      case '상품관리팀':
        return 'HQ_PRO';
      default:
        // 매핑되지 않는 경우 원래 값 반환
        return deptName;
    }
  };

  // 사원 정보 저장 처리
  const handleSave = async (formData) => {
    setLoading(true);
    console.log("저장 전 원본 데이터:", formData);
    
    // 상태값 문자열을 숫자로 변환
    const convertedData = {
      ...formData,
      empStatus: convertStatusToNumber(formData.empStatus),
      // 사원 유형(본사/점주)에 따라 empRole 설정
      empRole: type
    };
    
    console.log("변환 후 전송할 데이터:", convertedData);
    
    try {
      // 4. 수정된 엔드포인트 사용
      if (empId) {
        // 기존 사원 정보 수정
        console.log(`사원 정보 수정 요청: empId=${empId}`);
        const response = await axios.put(`/api/employee-management/${empId}`, convertedData);
        console.log("수정 응답:", response.data);
      } else {
        // 새 사원 정보 추가
        console.log("신규 사원 등록 요청");
        const response = await axios.post('/api/employee-management', convertedData);
        console.log("등록 응답:", response.data);
      }
      
      // 저장 성공 후 사원 목록 페이지로 이동
      navigate('/headquarters/hr/employees');
    } catch (err) {
      console.error('사원 정보 저장 중 오류 발생:', err);
      setError('사원 정보를 저장하는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 상태값 문자열을 숫자로 변환하는 함수
  const convertStatusToNumber = (statusText) => {
    switch (statusText) {
      case '재직':
        return '1';
      case '휴직':
        return '2';
      case '퇴사':
        return '3';
      default:
        return '1'; // 기본값은 재직(1)
    }
  };

  return (
    <EmployeeManagementCom 
      employee={employee}
      departments={departments}
      onSave={handleSave}
      loading={loading}
      error={error}
      employeeType={type} // 사원 유형(본사/점주) 전달
    />
  );
};

export default EmployeeManagementCon; 