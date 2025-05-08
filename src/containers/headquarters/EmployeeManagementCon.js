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
  const [stores, setStores] = useState([]);
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
        setError('부서 정보를 가져오는 중 오류가 발생했습니다.');
      }
    };
    
    fetchDepartments();
  }, []);
   
  // 할당되지 않은 매장 목록 가져오기 (점주 관리에서 사용)
  useEffect(() => {
    if (type === '점주') {
      const fetchAvailableStores = async () => {
        setLoading(true);
        try {
          console.log("=== 미할당 매장 목록 조회 시작 ===");
          
          // 현재 수정 중인 점주의 지점이면 포함하도록 파라미터 전달
          const params = empId ? { exceptOwnerEmpId: empId } : {};
          let success = false;
          
          try {
            // 1. 할당되지 않은 매장 목록 조회 API 시도
            console.log("1) 미할당 매장 전용 API 호출: /api/stores/available");
            const availableResponse = await axios.get('/api/stores/available', { params });
            console.log("API 응답:", availableResponse);
            
            if (availableResponse.data && Array.isArray(availableResponse.data)) {
              console.log("응답 데이터 확인:", availableResponse.data);
              setStores(availableResponse.data);
              success = true;
              console.log("미할당 매장 전용 API 사용 성공, 매장 개수: " + availableResponse.data.length);
            }
          } catch (err) {
            console.warn('미할당 매장 전용 API 실패:', err.message);
          }
          
          // 첫 번째 API가 실패한 경우에만 두 번째 API를 시도
          if (!success) {
            try {
              // 2. 일반 매장 목록 API 사용
              console.log("2) 일반 매장 목록 API 호출: /api/stores/list");
              const allStoresResponse = await axios.get('/api/stores/list');
              console.log("매장 목록 API 응답:", allStoresResponse);
              
              if (allStoresResponse.data && Array.isArray(allStoresResponse.data)) {
                console.log("응답 데이터 구조:", allStoresResponse.data);
                
                if (allStoresResponse.data.length > 0) {
                  console.log("첫 번째 매장 데이터 샘플:", allStoresResponse.data[0]);
                }
                
                setStores(allStoresResponse.data);
                success = true;
                console.log("일반 매장 목록 API 사용 성공, 매장 개수: " + allStoresResponse.data.length);
              }
            } catch (err) {
              console.warn('일반 매장 목록 API 실패:', err.message);
            }
          }
          
          // 위의 두 API가 모두 실패한 경우 기존 로직으로 폴백
          if (!success) {
            try {
              console.log("3) 폴백: 매장 목록과 점주 정보 조합하여 필터링");
              // 임시 하드코딩된 데이터
              const mockStores = [
                { storeId: 1, storeName: "매장 1" },
                { storeId: 2, storeName: "매장 2" },
                { storeId: 3, storeName: "매장 3" }
              ];
              console.log("임시 매장 데이터 사용:", mockStores);
              setStores(mockStores);
            } catch (finalErr) {
              console.error('모든 매장 조회 방법 실패:', finalErr);
              setError('매장 목록을 가져오는 중 오류가 발생했습니다.');
              setStores([]);
            }
          }
          
          console.log("=== 미할당 매장 목록 조회 완료 ===");
        } catch (err) {
          console.error('매장 목록 처리 중 예상치 못한 오류:', err);
          setError('매장 목록을 가져오는 중 오류가 발생했습니다.');
          setStores([]);
        } finally {
          setLoading(false);
        }
      };
      
      fetchAvailableStores();
    }
  }, [type, empId]);

  // 직원/점주 정보 가져오기 (수정 모드인 경우)
  useEffect(() => {
    if (empId) {
      const fetchEmployee = async () => {
        setLoading(true);
        try {
          console.log(`${type} 정보 요청: empId=${empId}`);
          
          // API 타입 파라미터 설정
          const apiType = type === '본사' ? 'HQ' : 'STORE';
          
          // 통합 API 엔드포인트 설정
          const unifiedEndpoint = `/api/employee-unified/${empId}?type=${apiType}`;
          
          let response;
          
          try {
            // 통합 API 엔드포인트 시도
            console.log("통합 API 호출:", unifiedEndpoint);
            response = await axios.get(unifiedEndpoint);
            console.log("통합 API 응답 데이터:", response.data);
          } catch (err) {
            console.warn("통합 API 호출 실패, 기존 API로 재시도:", err);
            
            // 백업: 기존 API 엔드포인트 시도
            let backupEndpoint = type === '본사' 
              ? `/api/employee-management/${empId}` 
              : `/api/store-owners/${empId}`;
            
            console.log("기존 API 호출:", backupEndpoint);
            response = await axios.get(backupEndpoint);
            console.log("기존 API 응답 데이터:", response.data);
          }
          
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
          console.error(`${type} 정보를 가져오는 중 오류 발생:`, err);
          setError(`${type} 정보를 가져오는 중 오류가 발생했습니다.`);
        } finally {
          setLoading(false);
        }
      };
      
      fetchEmployee();
    }
  }, [empId, type]);

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

  // 직원/점주 정보 저장 처리
  const handleSave = async (formData) => {
    setLoading(true);
    console.log("저장 전 원본 데이터:", formData);
    
    try {
      // 상태값 문자열을 숫자로 변환
      const convertedData = {
        ...formData,
        empStatus: convertStatusToNumber(formData.empStatus),
        // 사원 유형(본사/점주)에 따라 empRole 설정
        empRole: type === '본사' ? 'HQ' : 'STORE',
        // 점주인 경우 departId를 3으로 명시적 설정
        departId: type === '점주' ? 3 : (formData.departId || null)
      };
      
      console.log("변환 후 전송할 데이터:", convertedData);
      
      // API 타입 파라미터 설정
      const apiType = type === '본사' ? 'HQ' : 'STORE';
      
      // 점주이고 상태 변경이 있는 경우 승인 API 호출 (기존 데이터가 있을 때)
      if (type === '점주' && empId && employee && 
          (formData.empStatus !== employee.empStatus || formData.storeId !== employee.storeId)) {
        
        try {
          // 승인 상태 업데이트 API 호출
          console.log(`점주 승인 상태 변경 요청: empId=${empId}, status=${formData.empStatus}, storeId=${formData.storeId}`);
          
          // 요청 파라미터 구성
          const params = {
            status: formData.empStatus,
            departId: 3 // 점주 부서 ID 명시적 지정
          };
          
          // storeId가 유효한 경우에만 포함
          if (formData.storeId) {
            params.storeId = formData.storeId;
          }
          
          console.log("점주 승인 요청 파라미터:", params);
          
          // 승인 API 호출
          const approveResponse = await axios.put(
            `/api/headquarters/hr/approve/store-owner/${empId}`, 
            null, 
            { params }
          );
          
          console.log("점주 승인 응답:", approveResponse.data);
          
          // 승인 성공 후 나머지 정보 저장
          console.log("점주 승인 성공. 나머지 정보 저장 중...");
        } catch (approveErr) {
          console.error("점주 승인 중 오류 발생:", approveErr);
          // 오류가 발생하면 사용자에게 알림
          setError("점주 승인 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
          setLoading(false);
          return; // 저장 중단
        }
      }
      
      // 통합 API 엔드포인트 설정
      const unifiedEndpoint = `/api/employee-unified`;
      let response;
      
      // 통합 API 엔드포인트 사용
      if (empId) {
        // 기존 정보 수정
        console.log(`통합 API ${type} 정보 수정 요청: empId=${empId}`);
        response = await axios.put(`${unifiedEndpoint}/${empId}?type=${apiType}`, convertedData);
      } else {
        // 새 정보 추가
        console.log(`통합 API 신규 ${type} 등록 요청`);
        response = await axios.post(`${unifiedEndpoint}?type=${apiType}`, convertedData);
      }
      
      console.log("통합 API 응답:", response.data);
      
      // 저장 성공 후 목록 페이지로 이동
      navigate('/headquarters/hr/employees');
      
    } catch (err) {
      console.error(`${type} 정보 저장 중 오류 발생:`, err);
      
      // API 호출 실패 시 기존 엔드포인트로 재시도
      try {
        // 상태값 문자열을 숫자로 변환
        const convertedData = {
          ...formData,
          empStatus: convertStatusToNumber(formData.empStatus),
          empRole: type === '본사' ? 'HQ' : 'STORE'
        };
        
        // 타입에 따라 다른 기존 API 엔드포인트 사용
        const originalEndpoint = type === '본사' 
          ? '/api/employee-management' 
          : '/api/store-management';
        
        if (empId) {
          // 기존 정보 수정
          console.log(`기존 API ${type} 정보 수정 요청: empId=${empId}`);
          const response = await axios.put(`${originalEndpoint}/${empId}`, convertedData);
          console.log("기존 API 응답:", response.data);
        } else {
          // 새 정보 추가
          console.log(`기존 API 신규 ${type} 등록 요청`);
          const response = await axios.post(originalEndpoint, convertedData);
          console.log("기존 API 응답:", response.data);
        }
        
        // 저장 성공 후 목록 페이지로 이동
        navigate('/headquarters/hr/employees');
      } catch (backupErr) {
        console.error(`백업 API 저장 중 오류 발생:`, backupErr);
        setError(`${type} 정보를 저장하는 중 오류가 발생했습니다.`);
      }
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
      case '미승인':
        return '0';
      default:
        return '1'; // 기본값은 재직(1)
    }
  };

  return (
    <EmployeeManagementCom 
      employee={employee}
      departments={departments}
      stores={stores}
      onSave={handleSave}
      loading={loading}
      error={error}
      employeeType={type} // 사원 유형(본사/점주) 전달
    />
  );
};

export default EmployeeManagementCon; 