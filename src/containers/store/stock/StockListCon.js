import React, { useEffect, useState } from 'react';
import StockListCom from '../../../components/store/stock/StockListCom';
import { fetchStoreStockList } from '../../../service/store/StockService';
import { fetchParentCategories, fetchChildCategories } from '../../../service/store/CategoryService';

function StockListCon() {
  const [stockList, setStockList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [grandChildCategories, setGrandChildCategories] = useState([]);
  
  const [searchParams, setSearchParams] = useState({
    productName: '',
    barcode: '',
    categoryId: null,
    page: 0,
    size: 10,
  });

  const [filters, setFilters] = useState({
    parentCategoryId: '',
    categoryId: '',
    subCategoryId: '',
  });

  useEffect(() => {
    fetchParentCategories().then(data => setParentCategories(data || []));
  }, []);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await fetchStoreStockList(searchParams);
        setStockList(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [searchParams]);

// 대분류 선택 핸들러: 중분류 호출 누락 확인
const handleParentChange = id => {
  setFilters({ parentCategoryId: id, categoryId: '', subCategoryId: '' });
  setChildCategories([]); 
  setGrandChildCategories([]);

  if (id) {
    fetchChildCategories(id)
      .then(data => setChildCategories(data || []))  
      .catch(console.error);
  }

  setSearchParams(prev => ({
    ...prev,
    productName: '',
    barcode: '',
    categoryId: id || null,
    page: 0,
  }));
};


  const handleChildChange = (id) => {
    setFilters(f => ({ ...f, categoryId: id, subCategoryId: '' }));
    setGrandChildCategories([]);
    if (id) fetchChildCategories(id).then(data => setGrandChildCategories(data || []));
    updateCategoryFilter(id);
  };

  const handleSubChildChange = (id) => {
    setFilters(f => ({ ...f, subCategoryId: id }));
    updateCategoryFilter(id);
  };

  const updateCategoryFilter = (categoryId) => {
    const finalCategoryId = categoryId || filters.subCategoryId || filters.categoryId || filters.parentCategoryId || null;
    setSearchParams(prev => ({ ...prev, categoryId: finalCategoryId, page: 0 }));
  };

  const handleSearch = (params) => {
    setSearchParams(prev => ({
      ...prev,
      productName: params.productName || '',
      barcode: params.barcode || '',
      page: 0,
    }));
  };

  const handlePageChange = (newPage) => {
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