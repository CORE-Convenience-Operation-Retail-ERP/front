import React, { useState, useEffect } from 'react';
import StoreInquiryCom from '../../components/headquarters/StoreInquiryCom';
import axiosInstance from '../../service/axiosInstance';

const StoreInquiryCon = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 모든 지점 문의 조회
  const fetchInquiries = async () => {
    setLoading(true);
    try {
      // axios 인스턴스 사용 (인터셉터가 토큰을 자동으로 추가)
      const response = await axiosInstance.get('/api/store-inquiries');
      setInquiries(response.data);
    } catch (error) {
      console.error('지점 문의 데이터를 불러오는데 실패했습니다:', error);
      
      // 디버깅용 로그 추가
      console.log('localStorage token:', localStorage.getItem('token'));
      console.log('localStorage role:', localStorage.getItem('role'));
      
      if (error.response) {
        console.log('Error status:', error.response.status);
        console.log('Error data:', error.response.data);
        console.log('Error headers:', error.response.headers);
      }
      
      alert('지점 문의 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchInquiries();
  }, []);
  
  // 문의 상태 변경 처리
  const handleStatusChange = async (inquiryId, status) => {
    setLoading(true);
    try {
      const response = await axiosInstance.patch(`/api/store-inquiries/${inquiryId}/status`, { status });
      
      // 상태가 변경된 문의 업데이트
      setInquiries(prev => 
        prev.map(inquiry => 
          inquiry.inquiryId === inquiryId ? response.data : inquiry
        )
      );
      
      // 상태 변경 성공 메시지
      const statusText = status === 1 ? '완료' : status === 2 ? '대기' : '취소/반려';
      alert(`문의 상태가 ${statusText}(으)로 변경되었습니다.`);
    } catch (error) {
      console.error('문의 상태 변경에 실패했습니다:', error);
      alert('문의 상태 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 문의 유형별 필터링
  const handleTypeFilter = async (type) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/store-inquiries', {
        params: { type }
      });
      setInquiries(response.data);
    } catch (error) {
      console.error('필터링된 데이터를 불러오는데 실패했습니다:', error);
      alert('필터링된 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 문의 상태별 필터링
  const handleStatusFilter = async (status) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/store-inquiries', {
        params: { status }
      });
      setInquiries(response.data);
    } catch (error) {
      console.error('필터링된 데이터를 불러오는데 실패했습니다:', error);
      alert('필터링된 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <StoreInquiryCom 
      inquiries={inquiries} 
      loading={loading} 
      onStatusChange={handleStatusChange}
      onTypeFilter={handleTypeFilter}
      onStatusFilter={handleStatusFilter}
    />
  );
};

export default StoreInquiryCon; 