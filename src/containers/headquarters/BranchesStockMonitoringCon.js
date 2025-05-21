import React, { useState, useEffect } from 'react';
import BranchesStockMonitoringCom from '../../components/headquarters/BranchesStockMonitoringCom';
import axios from 'axios';
import { loadingManager } from '../../components/common/LoadingManager';

const BranchesStockMonitoringCon = () => {
  // API 연동을 위한 상태값들
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
      loadingManager.show();
      setError(null);
      await Promise.all([
        loadBranches(),
        loadCategories(),
        loadStockSummary(),
        loadCategoryStats(),
        loadBranchComparison(),
        loadStockList()
      ]);
      loadingManager.hide();
    } catch (err) {
      console.error('Error loading data:', err);
      loadingManager.hide();
      if (err.response && err.response.status === 403) {
        setError('접근 권한이 없습니다. 지점별 재고 모니터링 기능을 사용하려면 적절한 권한이 필요합니다.');
      } else {
        setError(`데이터를 불러오는 중 오류가 발생했습니다: ${err.message}`);
      }
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
      
      // 서버 응답에 따른 구체적인 에러 메시지 설정
      let errorMsg = '재고 목록을 불러오는 중 오류가 발생했습니다.';
      
      if (err.response) {
        // 서버에서 응답이 왔지만 오류인 경우
        if (err.response.status === 500) {
          errorMsg = `서버 내부 오류가 발생했습니다 (500): ${err.response.data || '알 수 없는 오류'}`;
          console.error('서버 응답 데이터:', err.response.data);
        } else if (err.response.status === 403) {
          errorMsg = '재고 목록을 불러올 권한이 없습니다 (403)';
        } else if (err.response.status === 404) {
          errorMsg = '재고 목록 API 엔드포인트를 찾을 수 없습니다 (404)';
        } else {
          errorMsg = `재고 목록을 불러오는 중 오류가 발생했습니다: ${err.response.status} - ${err.response.data || err.message}`;
        }
      } else if (err.request) {
        // 요청은 보냈지만 응답이 없는 경우
        errorMsg = '서버에서 응답이 없습니다. 네트워크 연결을 확인해주세요.';
      }
      
      setError(errorMsg);
      throw err;
    }
  };
  
  // 필터 변경 처리
  const handleFilterChange = async (newFilters) => {
    const updatedFilters = { 
      ...filters, 
      ...newFilters, 
      page: 'page' in newFilters ? newFilters.page : 0 
    };
    if ('productName' in newFilters && newFilters.productName) {
      updatedFilters.barcode = null;
    }
    if ('barcode' in newFilters && newFilters.barcode) {
      updatedFilters.productName = null;
    }
    setFilters(updatedFilters);
    try {
      loadingManager.show();
      setError(null);
      if ('storeId' in newFilters) {
        await Promise.all([
          loadStockSummary(updatedFilters.storeId),
          loadCategoryStats(updatedFilters.storeId),
          loadStockList(updatedFilters)
        ]);
      } else if ('page' in newFilters || 'productName' in newFilters || 'categoryId' in newFilters || 'barcode' in newFilters) {
        await loadStockList(updatedFilters);
      }
      loadingManager.hide();
    } catch (err) {
      console.error('필터 변경 중 오류 발생:', err);
      loadingManager.hide();
    }
  };
  
  useEffect(() => {
    loadAllData();
    // eslint-disable-next-line
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
  
  // storeId가 바뀌면 데이터 로드 (storeId가 null이어도 전체 데이터 로드)
  useEffect(() => {
    // storeId가 null이어도 전체 데이터 로드
    handleFilterChange({ storeId: filters.storeId });
    // eslint-disable-next-line
  }, [filters.storeId]);
  
  return (
    <>
      {error && <div style={{ color: 'red', padding: '10px', margin: '10px 0' }}>{error}</div>}
      <BranchesStockMonitoringCom 
        branches={branches}
        categories={categories}
        stockSummary={stockSummary}
        categoryStats={categoryStats}
        branchComparison={branchComparison}
        stockList={stockList}
        filters={filters}
        onFilterChange={handleFilterChange}
        isLoading={false}
      />
    </>
  );
};

export default BranchesStockMonitoringCon; 