import React, { useState, useEffect } from 'react';
import BranchesStockMonitoringCom from '../../components/headquarters/BranchesStockMonitoringCom';
import axios from 'axios';

const BranchesStockMonitoringCon = () => {
  // API 연동을 위한 상태값들
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 데이터 상태값들
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stockSummary, setStockSummary] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [branchComparison, setBranchComparison] = useState([]);
  const [stockList, setStockList] = useState({
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0
  });
  
  // 필터 상태값
  const [filters, setFilters] = useState({
    storeId: null,
    productName: '',
    barcode: null,
    categoryId: null,
    page: 0,
    size: 10
  });

  // API 기본 설정
  const api = axios.create({
    baseURL: '/api',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : null
    }
  });
  
  // 데이터 로딩 함수
  const loadAllData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 순차적으로 필수 데이터부터 로딩하여 UI가 단계적으로 업데이트되도록 함
      // 먼저 필수적인 참조 데이터 로드
      await loadBranches();
      await loadCategories();
      
      // 다음으로 차트에 필요한 데이터 로드
      await loadStockSummary();
      await loadCategoryStats();
      await loadBranchComparison();
      
      // 마지막으로 목록 데이터 로드
      await loadStockList();
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading data:', err);
      
      // 권한 오류 특별 처리
      if (err.response && err.response.status === 403) {
        setError('접근 권한이 없습니다. 지점별 재고 모니터링 기능을 사용하려면 적절한 권한이 필요합니다.');
      } else {
        setError(`데이터를 불러오는 중 오류가 발생했습니다: ${err.message}`);
      }
      
      setIsLoading(false);
    }
  };
  
  // 지점 목록 로드
  const loadBranches = async () => {
    try {
      const response = await api.get('/headquarters/branches/stock/branches');
      setBranches(response.data);
    } catch (err) {
      console.error('Error loading branches:', err);
      if (err.response && err.response.status === 403) {
        console.log('권한 부족: 지점 목록을 불러올 수 있는 권한이 없습니다.');
      }
      throw err;
    }
  };
  
  // 카테고리 목록 로드
  const loadCategories = async () => {
    try {
      const response = await api.get('/headquarters/branches/stock/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error loading categories:', err);
      if (err.response && err.response.status === 403) {
        console.log('권한 부족: 카테고리 목록을 불러올 수 있는 권한이 없습니다.');
      }
      throw err;
    }
  };
  
  // 재고 현황 요약 로드
  const loadStockSummary = async (storeIdParam) => {
    try {
      const cleanParams = {};
      const targetStoreId = storeIdParam !== undefined ? storeIdParam : filters.storeId;
      
      if (targetStoreId) cleanParams.storeId = targetStoreId;
      
      const response = await api.get('/headquarters/branches/stock/summary', { params: cleanParams });
      setStockSummary(response.data);
    } catch (err) {
      console.error('Error loading stock summary:', err);
      if (err.response && err.response.status === 403) {
        console.log('권한 부족: 재고 현황 요약을 불러올 수 있는 권한이 없습니다.');
      }
      throw err;
    }
  };
  
  // 카테고리별 재고 통계 로드
  const loadCategoryStats = async (storeIdParam) => {
    try {
      const cleanParams = {};
      const targetStoreId = storeIdParam !== undefined ? storeIdParam : filters.storeId;
      
      if (targetStoreId) cleanParams.storeId = targetStoreId;
      
      const response = await api.get('/headquarters/branches/stock/category-stats', { params: cleanParams });
      setCategoryStats(response.data);
    } catch (err) {
      console.error('Error loading category stats:', err);
      if (err.response && err.response.status === 403) {
        console.log('권한 부족: 카테고리별 재고 통계를 불러올 수 있는 권한이 없습니다.');
      }
      throw err;
    }
  };
  
  // 지점별 재고 비교 로드
  const loadBranchComparison = async () => {
    try {
      const response = await api.get('/headquarters/branches/stock/branch-comparison');
      setBranchComparison(response.data);
    } catch (err) {
      console.error('Error loading branch comparison:', err);
      if (err.response && err.response.status === 403) {
        console.log('권한 부족: 지점별 재고 비교를 불러올 수 있는 권한이 없습니다.');
      }
      throw err;
    }
  };
  
  // 재고 목록 로드
  const loadStockList = async (filtersParam) => {
    try {
      // 사용할 필터 결정
      const targetFilters = filtersParam || filters;
      
      // 파라미터 정리: undefined, null, ''는 서버에 파라미터로 전송하지 않음
      const cleanParams = {};
      
      if (targetFilters.storeId) cleanParams.storeId = targetFilters.storeId;
      if (targetFilters.productName && targetFilters.productName.trim() !== '') cleanParams.productName = targetFilters.productName;
      if (targetFilters.barcode) cleanParams.barcode = targetFilters.barcode;
      if (targetFilters.categoryId) cleanParams.categoryId = targetFilters.categoryId;
      
      // 페이지네이션 파라미터는 항상 포함
      cleanParams.page = targetFilters.page || 0;
      cleanParams.size = targetFilters.size || 10;
      
      const response = await api.get('/headquarters/branches/stock/list', { params: cleanParams });
      setStockList(response.data);
    } catch (err) {
      console.error('Error loading stock list:', err);
      if (err.response && err.response.status === 403) {
        console.log('권한 부족: 재고 목록을 불러올 수 있는 권한이 없습니다.');
      }
      throw err;
    }
  };
  
  // 필터 변경 처리
  const handleFilterChange = async (newFilters) => {
    // 필터를 먼저 업데이트하고
    const updatedFilters = { 
      ...filters, 
      ...newFilters, 
      page: 'page' in newFilters ? newFilters.page : 0 
    };
    
    // 바코드와 상품명 검색은 배타적으로 동작
    if ('productName' in newFilters && newFilters.productName) {
      updatedFilters.barcode = null;
    }
    
    if ('barcode' in newFilters && newFilters.barcode) {
      updatedFilters.productName = null;
    }
    
    setFilters(updatedFilters);
    
    try {
      setIsLoading(true);
      
      // 지점 선택이 변경된 경우 즉시 관련 데이터를 모두 업데이트
      if ('storeId' in newFilters) {
        // 순차적으로 데이터를 로드하여 UI 업데이트 지연 방지
        await loadStockSummary(updatedFilters.storeId);
        await loadCategoryStats(updatedFilters.storeId);
        await loadStockList(updatedFilters);
      } else if ('page' in newFilters || 'productName' in newFilters || 'categoryId' in newFilters || 'barcode' in newFilters) {
        // 검색 관련 필터가 변경된 경우, 해당 데이터만 업데이트
        await loadStockList(updatedFilters);
      }
      
      setIsLoading(false);
    } catch (err) {
      setError('데이터 필터링 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // 컴포넌트 마운트 시 데이터 로딩
    loadAllData();
    
    // 검색 자동완성을 위한 상품 데이터 미리 로드 (페이지 사이즈를 크게 설정)
    loadInitialProductsForAutocomplete();
    
    // 실시간 데이터 업데이트를 위한 폴링 (5분마다)
    const pollingInterval = setInterval(() => {
      loadAllData();
    }, 300000); // 5분마다 업데이트
    
    return () => {
      clearInterval(pollingInterval);
    };
  }, []);
  
  // 자동완성을 위한 상품 데이터 미리 로드
  const loadInitialProductsForAutocomplete = async () => {
    try {
      // 자동완성을 위해 많은 상품을 미리 로드 (최대 100개)
      const cleanParams = {
        page: 0,
        size: 100 // 자동완성을 위해 더 많은 상품 로드
      };
      
      const response = await api.get('/headquarters/branches/stock/list', { params: cleanParams });
      // 현재 데이터와 병합
      if (response.data && response.data.content) {
        setStockList(prevState => ({
          ...prevState,
          content: [...prevState.content, ...response.data.content.filter(newItem => 
            !prevState.content.some(existingItem => existingItem.barcode === newItem.barcode)
          )]
        }));
      }
    } catch (err) {
      console.error('Error loading initial products for autocomplete:', err);
    }
  };
  
  return (
    <>
      {error && <div style={{ color: 'red', padding: '10px', margin: '10px 0' }}>{error}</div>}
      {isLoading && !branches.length ? (
        <div>데이터를 불러오는 중...</div>
      ) : (
        <BranchesStockMonitoringCom 
          branches={branches}
          categories={categories}
          stockSummary={stockSummary}
          categoryStats={categoryStats}
          branchComparison={branchComparison}
          stockList={stockList}
          filters={filters}
          onFilterChange={handleFilterChange}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default BranchesStockMonitoringCon; 