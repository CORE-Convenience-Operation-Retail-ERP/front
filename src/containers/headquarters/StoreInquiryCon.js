import React, { useState, useEffect } from 'react';
import StoreInquiryCom from '../../components/headquarters/StoreInquiryCom';
import axiosInstance from '../../service/axiosInstance';

const StoreInquiryCon = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showRankings, setShowRankings] = useState(false);
  const [storeRankings, setStoreRankings] = useState([]);
  
  // 모든 지점 문의 조회 (페이징 처리)
  const fetchInquiries = async (pageNum = 0, type = null, status = null) => {
    setLoading(true);
    try {
      // axios 인스턴스 사용 (인터셉터가 토큰을 자동으로 추가)
      const params = { page: pageNum, size: 10 };
      if (type) params.type = type;
      if (status) params.status = status;
      
      const response = await axiosInstance.get('/api/store-inquiries/paged', { params });
      
      setInquiries(response.data.content);
      setTotalPages(response.data.totalPages);
      setPage(response.data.number);
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
  
  // 지점 랭킹 조회
  const fetchStoreRankings = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/store-inquiries/ranking');
      setStoreRankings(response.data);
    } catch (error) {
      console.error('지점 랭킹 데이터를 불러오는데 실패했습니다:', error);
      alert('지점 랭킹 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 페이지 변경 처리
  const handlePageChange = (event, newPage) => {
    fetchInquiries(newPage);
  };
  
  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchInquiries();
    fetchStoreRankings();
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
      
  
      // 랭킹 정보 새로고침
      fetchStoreRankings();
    } catch (error) {
      console.error('문의 상태 변경에 실패했습니다:', error);
      alert('문의 상태 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 문의 유형별 필터링
  const handleTypeFilter = async (type) => {
    fetchInquiries(0, type, null);
  };
  
  // 문의 상태별 필터링
  const handleStatusFilter = async (status) => {
    fetchInquiries(0, null, status);
  };
  
  // 랭킹/문의 목록 토글
  const handleToggleRankings = () => {
    setShowRankings(prev => !prev);
    
    // 랭킹 보기를 선택한 경우 랭킹 데이터 새로고침
    if (!showRankings) {
      fetchStoreRankings();
    }
  };
  
  // 문의 평가 저장
  const handleLevelChange = async (inquiryId, level) => {
    setLoading(true);
    try {
      // 평가 등급 저장 및 자동으로 완료 상태로 변경
      await axiosInstance.patch(`/api/store-inquiries/${inquiryId}/level`, { level });
      await axiosInstance.patch(`/api/store-inquiries/${inquiryId}/status`, { status: 1 });
      
      // 평가가 변경된 문의 목록 새로고침
      await fetchInquiries(page);
      
      // 랭킹 정보 새로고침
      await fetchStoreRankings();
      
      // 평가 변경 성공 메시지 (한 번만 표시)
      alert("평가가 완료되었습니다.");
    } catch (error) {
      console.error('문의 평가 변경에 실패했습니다:', error);
      alert('문의 평가 변경에 실패했습니다.');
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
      onPageChange={handlePageChange}
      page={page}
      totalPages={totalPages}
      storeRankings={storeRankings}
      showRankings={showRankings}
      onToggleRankings={handleToggleRankings}
      onLevelChange={handleLevelChange}
    />
  );
};

export default StoreInquiryCon; 