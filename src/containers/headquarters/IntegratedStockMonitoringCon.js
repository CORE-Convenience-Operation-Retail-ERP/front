import React, { useState, useEffect } from 'react';
import IntegratedStockMonitoringCom from '../../components/headquarters/IntegratedStockMonitoringCom';
import axios from 'axios';

const IntegratedStockMonitoringCon = () => {
  // 상태 관리
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stockSummary, setStockSummary] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [branchComparison, setBranchComparison] = useState([]);
  const [stockList, setStockList] = useState({ content: [], totalPages: 0, number: 0 });
  const [headquarters, setHeadquarters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 필터 상태
  const [filters, setFilters] = useState({
    storeId: null,
    categoryId: null,
    productName: null,
    barcode: null,
    page: 0,
    size: 10,
    viewMode: 'integrated'
  });

  // 인증 헤더 가져오기
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // 데이터 로딩
  useEffect(() => {
    // 초기 데이터 로딩
    fetchBranches();
    fetchCategories();
    fetchSummaryData();
    fetchStockList();
    // 본사 재고 데이터 초기에 바로 로드
    fetchHeadquartersStock();
  }, []);
  
  // 필터 변경 시 데이터 리로딩
  useEffect(() => {
    fetchSummaryData();
    fetchStockList();
    
    // 모든 뷰 모드에서 항상 본사 재고 데이터 로드
    fetchHeadquartersStock();
  }, [filters]);

  // API 호출 함수들
  const fetchBranches = async () => {
    try {
      const response = await axios.get('/api/integrated-stock/branches', {
        headers: getAuthHeader()
      });
      setBranches(response.data);
    } catch (error) {
      console.error('지점 목록 로딩 실패:', error);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/integrated-stock/categories', {
        headers: getAuthHeader()
      });
      setCategories(response.data);
    } catch (error) {
      console.error('카테고리 목록 로딩 실패:', error);
    }
  };
  
  const fetchSummaryData = async () => {
    setIsLoading(true);
    try {
      // 재고 요약 정보 가져오기
      const summaryResponse = await axios.get('/api/integrated-stock/summary', {
        params: { 
          viewMode: filters.viewMode,
          storeId: filters.storeId 
        },
        headers: getAuthHeader()
      });
      setStockSummary(summaryResponse.data);
      
      // 카테고리 통계 가져오기
      const categoryResponse = await axios.get('/api/integrated-stock/category-stats', {
        params: { 
          viewMode: filters.viewMode,
          storeId: filters.storeId 
        },
        headers: getAuthHeader()
      });
      setCategoryStats(categoryResponse.data);
      
      // 지점별 비교 데이터 가져오기
      const comparisonResponse = await axios.get('/api/integrated-stock/branch-comparison', {
        headers: getAuthHeader()
      });
      setBranchComparison(comparisonResponse.data);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchStockList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/integrated-stock/list', {
        params: {
          viewMode: filters.viewMode,
          storeId: filters.storeId,
          productName: filters.productName,
          barcode: filters.barcode,
          categoryId: filters.categoryId,
          page: filters.page,
          size: filters.size
        },
        headers: getAuthHeader()
      });
      setStockList(response.data);
    } catch (error) {
      console.error('재고 목록 로딩 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchHeadquartersStock = async () => {
    try {
      const response = await axios.get('/api/integrated-stock/headquarters', {
        params: {
          categoryId: filters.categoryId,
          productName: filters.productName,
          barcode: filters.barcode
        },
        headers: getAuthHeader()
      });
      setHeadquarters(response.data);
    } catch (error) {
      console.error('본사 재고 로딩 실패:', error);
    }
  };
  
  // 필터 변경 핸들러
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: newFilters.page !== undefined ? newFilters.page : 0 }));
  };

  return (
    <IntegratedStockMonitoringCom
      headquarters={headquarters}
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
  );
};

export default IntegratedStockMonitoringCon; 