import React, { useEffect, useState } from 'react';
import StockListCom from '../../../components/store/stock/StockListCom';
import { fetchParentCategories, fetchChildCategories } from '../../../service/store/CategoryService';
import { fetchStoreStockList } from '../../../service/store/StockService';

function StockListCon() {
  const [stockList, setStockList] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const [searchParams, setSearchParams] = useState({
    parentCategoryId: null,
    categoryId: null,
    productName: '',
    barcode: '',
    page: 0,
    size: 10,
  });

  // 최초 로드: 대분류, 전체 목록 불러오기
  useEffect(() => {
    const initLoad = async () => {
      try {
        const parentData = await fetchParentCategories();
        setParentCategories(Array.isArray(parentData) ? parentData : []);
      } catch (err) {
        console.error('대분류 로드 실패:', err);
      }
      loadStockList(searchParams);
    };
    initLoad();
  }, []);

  // 검색 조건 변경 시 자동 목록 조회
  useEffect(() => {
    loadStockList(searchParams);
  }, [searchParams]);

  // 공통 재고 목록 조회 함수
  const loadStockList = async (params) => {
    try {
      const response = await fetchStoreStockList(params);
      setStockList(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error('재고 목록 조회 실패:', error);
    }
  };

  // 검색 조건 업데이트 + 즉시 데이터 새로고침
  const updateSearchParams = (updates) => {
    const newParams = { ...searchParams, ...updates, page: 0 };

    if (updates.parentCategoryId !== undefined) {
      newParams.categoryId = null;
      if (updates.parentCategoryId) {
        fetchChildCategories(updates.parentCategoryId)
            .then(data => setChildCategories(Array.isArray(data) ? data : []))
            .catch(err => console.error('중분류 로드 실패:', err));
      } else {
        setChildCategories([]);
      }
    }

    setSearchParams(newParams);
  };

  useEffect(() => {
    loadStockList(searchParams); // searchParams가 바뀔 때만 호출
  }, [searchParams]);

  const handlePageChange = (newPage) => {
    const newParams = { ...searchParams, page: newPage };
    setSearchParams(newParams);
    loadStockList(newParams);
  };

  const filterOptions = [
    { key: 'productName', label: '상품명', type: 'text', placeholder: '상품명을 입력하세요' },
    { key: 'barcode', label: '바코드', type: 'text', placeholder: '바코드를 입력하세요' },
    {
      key: 'parentCategoryId',
      label: '대분류',
      type: 'select',
      options: parentCategories.map(cat => ({ value: cat.id, label: cat.name }))
    },
    {
      key: 'categoryId',
      label: '중분류',
      type: 'select',
      options: childCategories.map(cat => ({ value: cat.id, label: cat.name }))
    },
  ];

  return (
      <StockListCom
          stockList={stockList}
          searchParams={searchParams}
          onSearchChange={updateSearchParams}
          currentPage={searchParams.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          filterOptions={filterOptions}
      />
  );
}

export default StockListCon;