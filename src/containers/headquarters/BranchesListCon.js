import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../service/axiosInstance';
import BranchesListCom from '../../components/headquarters/BranchesListCom';

const BranchesListCon = () => {
  const navigate = useNavigate();
  
  // 상태 관리
  const [branches, setBranches] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: [],
    sort: 'storeId',
    order: 'asc'
  });
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 모달 관련 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  
  // 권한 관련 상태
  const [hasEditPermission, setHasEditPermission] = useState(false);
  
  // 권한 체크
  useEffect(() => {
    const checkPermission = () => {
      // 두 가지 가능한 키로 권한을 확인
      const role = localStorage.getItem('role') || localStorage.getItem('userRole');
      console.log('현재 사용자 권한:', role);
      
      // JWT 토큰에서 권한 정보 추출 시도
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const parts = token.split('.');
          if (parts.length === 3) {
            const base64Url = parts[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            const decoded = JSON.parse(jsonPayload);
            console.log('토큰에서 추출한 정보:', decoded);
            
            // 토큰에서 role 정보 사용 (localStorage에 없을 경우)
            if (!role && decoded.role) {
              console.log('토큰에서 권한 정보 사용:', decoded.role);
              setHasEditPermission(['ROLE_MASTER', 'ROLE_HQ_BR', 'ROLE_HQ_BR_M'].includes(decoded.role));
              return;
            }
          }
        }
      } catch (e) {
        console.error('토큰 디코딩 실패:', e);
      }
      
      // localStorage의 권한 정보 사용
      setHasEditPermission(['ROLE_MASTER', 'ROLE_HQ_BR', 'ROLE_HQ_BR_M'].includes(role));
    };
    
    checkPermission();
  }, []);
  
  // 지점 목록 조회
  const fetchBranches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      console.log('API 요청 시작:', {
        url: '/api/headquarters/branches',
        params: {
          page: page - 1,
          size: rowsPerPage,
          search,
          status: filters.status.join(','),
          sort: filters.sort,
          order: filters.order
        }
      });
      
      const response = await axios.get('/api/headquarters/branches', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          page: page - 1,
          size: rowsPerPage,
          search,
          status: filters.status.join(','),
          sort: filters.sort,
          order: filters.order
        }
      });
      
      console.log('API 응답:', response.data);
      
      // 응답 데이터가 배열인 경우 직접 사용
      let content = Array.isArray(response.data) ? response.data : [];
      
      // 상태 필터링 추가 (employees 방식 참고)
      if (filters.status && filters.status.length > 0) {
        content = content.filter(branch => filters.status.includes(branch.storeStatus));
      }
      
      // 검색어가 있는 경우 클라이언트 측에서 필터링
      if (search) {
        const searchLower = search.toLowerCase();
        content = content.filter(branch => 
          branch.storeName.toLowerCase().includes(searchLower) ||
          branch.storeAddr.toLowerCase().includes(searchLower) ||
          branch.storeTel.includes(search)
        );
      }
      
      // 정렬 적용
      content.sort((a, b) => {
        const aValue = a[filters.sort];
        const bValue = b[filters.sort];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return filters.order === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        return filters.order === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      });
      
      const total = content.length;
      
      console.log('처리된 데이터:', { content, total });
      
      setBranches(content);
      setTotalCount(total);
    } catch (err) {
      console.error('API 에러 상세:', err.response || err);
      setError('지점 목록을 불러오는데 실패했습니다.');
      console.error('지점 목록 조회 실패:', err);
      setBranches([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, filters]);
  
  // 초기 데이터 로드 및 필터/검색어 변경 시 데이터 갱신
  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);
  
  // 검색어 변경 핸들러
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };
  
  // 상태 필터 토글 핸들러
  const toggleStatusFilter = (status) => {
    setFilters(prev => {
      let newStatus;
      if (prev.status.includes(status)) {
        // 이미 선택된 상태면 해제
        newStatus = prev.status.filter(s => s !== status);
      } else {
        // 선택 추가
        newStatus = [...prev.status, status];
      }
      // 아무것도 선택 안 하면 전체로 복귀(빈 배열 유지, 전체 보여줌)
      return { ...prev, status: newStatus };
    });
    setPage(1);
  };
  
  // 정렬 변경 핸들러
  const handleSortChange = (column) => {
    setFilters(prev => ({
      ...prev,
      sort: column,
      order: prev.sort === column && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // 지점 상세 정보 조회
  const handleDetail = async (storeId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/headquarters/branches/${storeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSelectedBranch(response.data);
      setModalOpen(true);
    } catch (err) {
      setError('지점 상세 정보를 불러오는데 실패했습니다.');
      console.error('지점 상세 정보 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBranch(null);
  };
  
  // 지점 추가 페이지로 이동
  const handleAddBranch = () => {
    console.log('지점 추가 버튼 클릭');
    navigate('/headquarters/branches/add');
  };
  
  // 지점 수정 페이지로 이동
  const handleNavigateToBranchEdit = (storeId) => {
    console.log('지점 수정 버튼 클릭:', storeId);
    navigate(`/headquarters/branches/edit/${storeId}`);
  };
  
  return (
    <BranchesListCom
      branches={branches}
      search={search}
      onSearch={handleSearch}
      filters={filters}
      toggleStatusFilter={toggleStatusFilter}
      onSortChange={handleSortChange}
      onDetail={handleDetail}
      modalOpen={modalOpen}
      selectedBranch={selectedBranch}
      onCloseModal={handleCloseModal}
      page={page}
      setPage={setPage}
      totalCount={totalCount}
      rowsPerPage={rowsPerPage}
      loading={loading}
      error={error}
      onAddBranch={handleAddBranch}
      onNavigateToBranchEdit={handleNavigateToBranchEdit}
      hasEditPermission={hasEditPermission}
    />
  );
};

export default BranchesListCon; 