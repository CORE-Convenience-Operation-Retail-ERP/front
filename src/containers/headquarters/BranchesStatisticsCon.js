import { useEffect, useState } from "react";
import BranchesStatisticsCom from "../../components/headquarters/BranchesStatisticsCom";
import { fetchBranchSettlements } from "../../service/headquarters/branchStatisticsService";

const BranchStatisticsCon = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    storeId: "",
    type: "ALL",
    startDate: "",
    endDate: ""
  });

  const handleSearch = async () => {
    const today = new Date().toISOString().split("T")[0];
    const sevenDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    // 유효한 값으로 보정
    const storeId = filters.storeId || "1"; // ← 테스트 시 기본 storeId는 1번 (입력 없을 경우만)
    const startDate = filters.startDate || sevenDaysAgo;
    const endDate = filters.endDate || today;

    const safeFilters = {
      ...filters,
      storeId,
      startDate,
      endDate,
    };

    try {
      const result = await fetchBranchSettlements(safeFilters);
      setData(result);
    } catch (err) {
      console.error("정산 조회 실패:", err);
      alert("정산 조회 실패");
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <BranchesStatisticsCom
      filters={filters}
      setFilters={setFilters}
      onSearch={handleSearch}
      data={data}
    />
  );
};

export default BranchStatisticsCon;
