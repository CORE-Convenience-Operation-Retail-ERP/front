import React, { useState, useEffect } from 'react';
import EmployeeManagementCom from '../../components/headquarters/EmployeeManagementCom';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployeeManagementCon = () => {
  const { empId } = useParams(); // URL에서 사원 ID 가져오기
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 부서 정보 가져오기
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('/api/departments');
        setDepartments(response.data);
      } catch (err) {
        console.error('부서 정보를 가져오는 중 오류 발생:', err);
        // 임시 부서 데이터
        setDepartments([
          { deptCode: 'HQ_BR', deptName: '인사팀' },
          { deptCode: 'HQ_HRM', deptName: '경영지원팀' },
          { deptCode: 'HQ_DEV', deptName: '개발팀' },
          { deptCode: 'HQ_FIN', deptName: '재무팀' }
        ]);
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
          const response = await axios.get(`/api/employees/${empId}`);
          setEmployee(response.data);
          setError(null);
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

  // 사원 정보 저장 처리
  const handleSave = async (formData) => {
    setLoading(true);
    try {
      if (empId) {
        // 기존 사원 정보 수정
        await axios.put(`/api/employees/${empId}`, formData);
      } else {
        // 새 사원 정보 추가
        await axios.post('/api/employees', formData);
      }
      
      // 저장 성공 후 사원 목록 페이지로 이동
      navigate('/headquarters/employees');
    } catch (err) {
      console.error('사원 정보 저장 중 오류 발생:', err);
      setError('사원 정보를 저장하는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmployeeManagementCom 
      employee={employee}
      departments={departments}
      onSave={handleSave}
      loading={loading}
      error={error}
    />
  );
};

export default EmployeeManagementCon; 