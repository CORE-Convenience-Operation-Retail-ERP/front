import React, { useEffect, useState } from "react";
import StockFlowLogCom from "../../../components/store/stock/StockFlowLogCom";
import StoreSearchBar from "../../../components/store/common/StoreSearchBar";
import { searchStockFlows } from "../../../service/store/StockFlowService";
import Pagination from "../../../components/store/common/Pagination";

function StockFlowLogCon() {
  const [logs, setLogs] = useState([]);
  const [pageInfo, setPageInfo] = useState({ currentPage: 0, totalPages: 0 });
  const [filters, setFilters] = useState({
    productId: null,
    productName: null,
    flowType: null,
    startDate: null,
    endDate: null,
    page: 0,
    size: 10
  });

  const loadLogs = async () => {
    try {
      const result = await searchStockFlows(filters);
      setLogs(result.content || []);
      setPageInfo({
        currentPage: result.number,
        totalPages: result.totalPages
      });
    } catch (err) {
      console.error("입출고 로그 조회 실패", err);
      alert("로그를 불러오는 데 실패했습니다.");
    }
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSearch = (newConditions) => {
    setFilters((prev) => ({
      ...prev,
      ...newConditions,
      page: 0 // 검색 시 페이지 초기화
    }));
  };

  useEffect(() => {
    loadLogs();
  }, [filters]);

  const filterOptions = [
    { key: "productName", label: "상품 이름", type: "text" },
    {
      key: "flowType",
      label: "유형",
      type: "select",
      options: [
        { value: "", label: "전체" },
        { value: 0, label: "입고" },
        { value: 1, label: "출고" },
        { value: 2, label: "판매" },
        { value: 3, label: "폐기" },
        { value: 4, label: "조정" },
        { value: 5, label: "반품" },
        { value: 6, label: "이동출고" },
        { value: 7, label: "이동입고" }
      ]
    },
    { key: "dateRange", label: "날짜", type: "date-range" }
  ];

  return (
    <>
      <StoreSearchBar filterOptions={filterOptions} onSearch={handleSearch} />
      <StockFlowLogCom logs={logs} />
      <Pagination
        currentPage={pageInfo.currentPage}
        totalPages={pageInfo.totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}

export default StockFlowLogCon;