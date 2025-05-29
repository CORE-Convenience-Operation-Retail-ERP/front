import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../service/axiosInstance';
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

  // 상세 주소를 별도로 관리
  const [detailAddress, setDetailAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // 주소 데이터 관리
  const [addressData, setAddressData] = useState({
    mainAddress: '',
    detailAddress: '',
    zipCode: ''
  });

  // 수정 모드일 경우 기존 데이터 로드
  useEffect(() => {
    console.log('useEffect 실행:', { isEdit, storeId });
    if (isEdit) {
      fetchBranchData();
    }
  }, [storeId]);

  // 주소와 상세 주소 분리 함수
  const splitAddress = (fullAddress) => {
    if (!fullAddress) return { mainAddress: '', detailAddress: '' };
    
    // 기본 주소와 상세 주소를 분리하는 로직
    // 단순히 처음 나오는 번지수 이후의 문자열을 상세 주소로 간주
    const addressParts = fullAddress.split(/(?<=\d(번지|호|동|로|길))\s+/);
    
    if (addressParts.length > 1) {
      return {
        mainAddress: addressParts[0],
        detailAddress: addressParts.slice(1).join(' ')
      };
    }
    
    return { mainAddress: fullAddress, detailAddress: '' };
  };

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
      const branchData = response.data;
      
      // 주소가 있는 경우, 주소와 상세 주소 분리
      if (branchData.storeAddr) {
        const { mainAddress, detailAddress } = splitAddress(branchData.storeAddr);
        setAddressData({
          mainAddress,
          detailAddress,
          zipCode: ''
        });
        setDetailAddress(detailAddress);
        
        // 주소만 설정 (상세 주소는 별도 상태로 관리)
        branchData.storeAddr = mainAddress;
      }
      
      setFormData(branchData);
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

  // 상세 주소 변경 처리 함수
  const handleDetailAddressChange = (newDetailAddress) => {
    setDetailAddress(newDetailAddress);
    setAddressData(prev => ({
      ...prev,
      detailAddress: newDetailAddress
    }));
  };

  // 주소 검색 결과 처리 함수
  const handleAddressSelect = (addressData) => {
    // 주소 데이터에서 필요한 정보 추출
    const mainAddress = addressData.address;
    const detail = addressData.detailAddress || detailAddress;
    const zipCode = addressData.zipCode || '';
    
    // 상세 주소 상태 업데이트
    setDetailAddress(detail);
    
    // 주소 데이터 저장
    setAddressData({
      mainAddress,
      detailAddress: detail,
      zipCode
    });
    
    // 폼 데이터 업데이트 (주소만)
    setFormData(prev => ({
      ...prev,
      storeAddr: mainAddress
    }));
    
    console.log('주소 선택됨:', { mainAddress, detail, zipCode });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('폼 제출:', formData);
    setLoading(true);
    setError(null);

    try {
      // 주소와 상세 주소 결합
      const fullAddress = addressData.detailAddress 
        ? `${addressData.mainAddress} ${addressData.detailAddress}`
        : addressData.mainAddress;
      
      // 서버에 전송할 데이터 준비
      const dataToSubmit = {
        ...formData,
        storeAddr: fullAddress // 전체 주소로 업데이트
      };
      
      console.log('제출 데이터:', dataToSubmit);
      
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      if (isEdit) {
        console.log('지점 수정 요청:', {
          url: `/api/headquarters/branches/${storeId}`,
          method: 'PUT',
          data: dataToSubmit
        });
        await axios.put(`/api/headquarters/branches/${storeId}`, dataToSubmit, { headers });
      } else {
        console.log('지점 추가 요청:', {
          url: '/api/headquarters/branches',
          method: 'POST',
          data: dataToSubmit
        });
        await axios.post('/api/headquarters/branches', dataToSubmit, { headers });
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
      onAddressSelect={handleAddressSelect}
      detailAddress={detailAddress}
      onDetailAddressChange={handleDetailAddressChange}
    />
  );
};

export default BranchFormCon; 