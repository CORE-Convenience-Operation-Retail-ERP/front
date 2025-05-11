import React, { useEffect, useState } from 'react';
import StockListCom from '../../../components/store/stock/StockListCom';
import { fetchStoreStockList } from '../../../service/store/StockService';
import { fetchParentCategories, fetchChildCategories } from '../../../service/store/CategoryService';

function StockListCon() {
  // 재고 데이터
  const [stockList, setStockList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 카테고리 옵션
  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [grandChildCategories, setGrandChildCategories] = useState([]);

  // 필터/검색 파라미터
  const [searchParams, setSearchParams] = useState({
    productName: '',
    barcode: '',
    categoryId: null,
    page: 0,
    size: 10,
  });
  const [filters, setFilters] = useState({ parentCategoryId: '', categoryId: '', subCategoryId: '' });

  // 대분류 로드
  useEffect(() => {
    fetchParentCategories().then(data => setParentCategories(data || [])).catch(console.error);
  }, []);

  // 재고 조회
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setStockList([]);
      try {
        const res = await fetchStoreStockList(searchParams);
        setStockList(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [searchParams]);

  const handleSearch = params => {
    setFilters({ parentCategoryId: '', subCategoryId: '' });
    setSearchParams(prev => ({
      ...prev,
      productName: '',
      barcode: '',
      ...params,
      categoryId: null,
      page: 0
    }));
  };

  // 대분류 선택 핸들러: 텍스트 검색 초기화
  const handleParentChange = id => {
    setFilters({ parentCategoryId: id, categoryId: '', subCategoryId: '' });
    setChildCategories([]);
    setGrandChildCategories([]);
    setSearchParams(prev => ({
      ...prev,
      productName: '',
      barcode: '',
      categoryId: id || null,
      page: 0
    }));
    if (id) fetchChildCategories(id).then(data => setChildCategories(data || [])).catch(console.error);
  };

  // 중분류 선택 핸들러
  const handleChildChange = id => {
    setFilters(f => ({ ...f, categoryId: id, subCategoryId: '' }));
    setGrandChildCategories([]);
    setSearchParams(prev => ({
      ...prev,
      productName: '',
      barcode: '',
      categoryId: id || null,
      page: 0
    }));
    if (id) fetchChildCategories(id).then(data => setGrandChildCategories(data || [])).catch(console.error);
  };

  // 소분류 선택 핸들러
  const handleSubChildChange = id => {
    setFilters(f => ({ ...f, subCategoryId: id }));
    setSearchParams(prev => ({
      ...prev,
      productName: '',
      barcode: '',
      categoryId: id || null,
      page: 0
    }));
  };

  // 페이지 변경
  const handlePageChange = newPage => {
    setSearchParams(prev => ({ ...prev, page: newPage }));
  };

  return (
    <StockListCom
      stockList={stockList}
      isLoading={isLoading}
      currentPage={searchParams.page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      onSearch={handleSearch}
      parentCategories={parentCategories}
      childCategories={childCategories}
      grandChildCategories={grandChildCategories}
      filters={filters}
      onParentChange={handleParentChange}
      onChildChange={handleChildChange}
      onSubChildChange={handleSubChildChange}
    />
  );
}

export default StockListCon;