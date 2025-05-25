import React, { useEffect, useState, useCallback } from 'react';
import StockInHistoryCom from '../../../components/store/order/StockInHistoryCom';
import {
  fetchStockInHistory,
  filterStockInHistory
} from '../../../service/store/StockFlowService';

export default function StockInHistoryCon() {
  const [historyList, setHistoryList] = useState([]);
  const [filters, setFilters] = useState({});
  const [pageInfo, setPageInfo] = useState({ page: 0, size: 10, totalPages: 0 });
  const [searchBarKey, setSearchBarKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = useCallback(async (page = 0) => {
    setIsLoading(true);
    try {
      const params = { page, size: pageInfo.size, ...filters };
      const response = Object.keys(filters).length
        ? await filterStockInHistory(params)
        : await fetchStockInHistory(params);

      const { content, number, size: resSize, totalPages } = response.data;
      setHistoryList(content);
      setPageInfo({ page: number, size: resSize, totalPages });
    } catch (error) {
      console.error('입고 이력 조회 실패', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, pageInfo.size]);

  useEffect(() => {
    loadData(0); 
  }, [filters, loadData]);

const handleSearch = (rawFilters = {}) => {
  const filters = {};

  if (rawFilters.startDate) {
    filters.from = new Date(rawFilters.startDate).toISOString();
    
  }

  if (rawFilters.endDate) {
    const end = new Date(rawFilters.endDate);
    end.setHours(23, 59, 59, 999); // 하루의 끝 포함
    filters.to = `${end.getFullYear()}-${(end.getMonth() + 1).toString().padStart(2, '0')}-${end.getDate().toString().padStart(2, '0')}T23:59:59`;
  }

  ['productName', 'barcode'].forEach((key) => {
    const value = rawFilters[key]?.trim();
    if (value) filters[key] = value;
  });

  if (rawFilters.partTimerName?.trim()) {
  filters.partTimerName = rawFilters.partTimerName.trim();
}


  setFilters(filters);
  setPageInfo(prev => ({ ...prev, page: 0 }));
  setSearchBarKey(prev => prev + 1);
};



  const handlePageChange = (newPage) => {
    loadData(newPage);
  };

  return (
    <StockInHistoryCom
      data={historyList}
      pageInfo={pageInfo}
      onSearch={handleSearch}
      onPageChange={handlePageChange}
      searchBarKey={searchBarKey}
      isLoading={isLoading}
    />
  );
}
