import React, { useEffect, useState } from 'react';
import StockListCom from '../../../components/store/stock/StockListCom';
import { fetchStoreStockList } from '../../../service/store/StockService';

function StockListCon() {
  const [stockList, setStockList] = useState([]);
  const [searchParams, setSearchParams] = useState({
    categoryId: null,
    productName: '',
    barcode: '',
    page: 0,
    size: 10,
  });
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadStockList();
  }, [searchParams]);

  const loadStockList = async () => {
    try {
      const response = await fetchStoreStockList(searchParams);
      setStockList(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('재고 목록 조회 실패:', error);
    }
  };

  const handleSearchChange = (name, value) => {
    setSearchParams(prev => ({
      ...prev,
      [name]: value,
      page: 0,
    }));
  };

  const onPageChange = (newPage) => {
    setSearchParams(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  return (
    <StockListCom
      stockList={stockList}
      searchParams={searchParams}
      onSearchChange={handleSearchChange}
      currentPage={searchParams.page}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}

export default StockListCon;
