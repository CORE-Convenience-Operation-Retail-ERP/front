import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import BranchFormCom from '../../components/headquarters/BranchFormCom';

const BranchFormCon = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const isEdit = Boolean(storeId);

  console.log('BranchFormCon 렌더링:', { storeId, isEdit });

  const [formData, setFormData] = useState({
    storeName: '',
    storeAddr: '',
    storeTel: '',
    storeStatus: 1
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 수정 모드일 경우 기존 데이터 로드
  useEffect(() => {
    console.log('useEffect 실행:', { isEdit, storeId });
    if (isEdit) {
      fetchBranchData();
    }
  }, [storeId]);

  const fetchBranchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      console.log('지점 데이터 요청:', { storeId, token });
      
      const response = await axios.get(`/api/headquarters/branches/${storeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('지점 데이터 응답:', response.data);
      setFormData(response.data);
    } catch (err) {
      console.error('지점 정보 조회 실패:', err);
      setError('지점 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('폼 제출:', formData);
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      if (isEdit) {
        console.log('지점 수정 요청:', {
          url: `/api/headquarters/branches/${storeId}`,
          method: 'PUT',
          data: formData
        });
        await axios.put(`/api/headquarters/branches/${storeId}`, formData, { headers });
      } else {
        console.log('지점 추가 요청:', {
          url: '/api/headquarters/branches',
          method: 'POST',
          data: formData
        });
        await axios.post('/api/headquarters/branches', formData, { headers });
      }

      console.log('저장 성공');
      navigate('/headquarters/branches/list');
    } catch (err) {
      console.error('저장 실패:', err);
      setError(isEdit ? '지점 정보 수정에 실패했습니다.' : '지점 추가에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('취소 버튼 클릭');
    navigate('/headquarters/branches/list');
  };

  return (
    <BranchFormCom
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      isEdit={isEdit}
      loading={loading}
      error={error}
      onCancel={handleCancel}
    />
  );
};

export default BranchFormCon; 