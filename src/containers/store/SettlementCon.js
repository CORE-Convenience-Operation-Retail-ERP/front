import React, { useEffect, useState } from "react";
import { fetchSettlementList } from "../../service/store/settlementService";
import SettlementTable from "../../components/store/settlement/SettlementTable";
import Pagination from "../../components/store/common/Pagination";
import LoadingLottie from '../../components/common/LoadingLottie.tsx';
import { PageTitle, PageWrapper } from "../../features/store/styles/common/PageLayout.js";
import SettlementFilterCom from "../../components/store/settlement/SettlementFilter.js";


const ITEMS_PER_PAGE = 10;

const SettlementCon = () => {
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState([null, null]);
  const [allSettlements, setAllSettlements] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const buildPayload = () => {
    const storeId = Number(localStorage.getItem("storeId"));
    const payload = { storeId };

    if (typeFilter !== "ALL") {
      payload.type = typeFilter;
      let [start, end] = dateRange;

      if (typeFilter === "MONTHLY") {
        const [year, month] = start.split("-");
        start = `${year}-${month}-01`;
        const lastDay = new Date(+year, +month, 0).getDate();
        end = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;
      } else if (typeFilter === "YEARLY") {
        const year = start.split("-")[0];
        start = `${year}-01-01`;
        end = `${year}-12-31`;
      }
      payload.startDate = start;
      payload.endDate = end;
    }

    return payload;
  };

  const handleSearch = async () => {
    if (typeFilter !== "ALL" && (!dateRange[0] || !dateRange[1])) {
      alert("기간을 선택해주세요.");
      return;
    }

    const payload = buildPayload();
    try {
      setLoading(true);
      const result = await fetchSettlementList(payload);
      result.sort((a, b) => new Date(a.settlementDate) - new Date(b.settlementDate));
      setAllSettlements(result);
      setCurrentPage(1);
    } catch (error) {
      console.error("정산 이력 조회 실패:", error);
      alert("정산 데이터를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentData = allSettlements.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(allSettlements.length / ITEMS_PER_PAGE);

  if (loading) return <LoadingLottie />;

  return (
    <PageWrapper>
      <PageTitle>| 정산 이력 조회</PageTitle>
      <SettlementFilterCom
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onSearch={handleSearch}
      />

      <SettlementTable data={currentData} />
      <Pagination
        currentPage={currentPage - 1}
        totalPages={totalPages}
        onPageChange={(p) => setCurrentPage(p + 1)}
      />
    </PageWrapper>
  );
};

export default SettlementCon;
