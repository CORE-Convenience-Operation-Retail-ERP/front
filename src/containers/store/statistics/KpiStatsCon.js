import React, { useEffect, useState, useMemo } from "react";
import KpiStatsCom from "../../../components/store/statistics/KpiStatsCom";
import { fetchKpiStats } from "../../../service/store/StatisticsService";
import StatRow from "../home/StatRow";

function KpiStatsCon({ filters, variant = "main" }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // filters 객체를 문자열로 메모이제이션하여 의존성 배열 안정화
  const stableFilters = useMemo(() => {
    if (!filters?.storeId || !filters.startDate || !filters.endDate) return null;
    return JSON.stringify(filters);
  }, [filters?.storeId, filters?.startDate, filters?.endDate]);

  useEffect(() => {
    const load = async () => {
      if (!stableFilters) return;

      try {
        setLoading(true);
        const parsedFilters = JSON.parse(stableFilters);
        const res = await fetchKpiStats(parsedFilters);
        setData(res);
      } catch (err) {
        console.error("❌ KPI 통계 불러오기 실패", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [stableFilters]);

  if (loading) return <div>로딩 중...</div>;

  // 카드 데이터 포맷
  const stats = [
    { label: "총 매출", value: `${data?.totalSales?.toLocaleString() || 0}원` },
    { label: "발주 금액", value: `${data?.totalOrders?.toLocaleString() || 0}원` },
    { label: "오늘 판매 수량", value: `${data?.todaySalesQuantity?.toLocaleString() || 0}개` },
    { label: "입고 수량", value: `${data?.stockInCount?.toLocaleString() || 0}개` }
  ];

  // 분기: variant가 main이면 StatRow, 아니면 KpiStatsCom
  if (variant === "main") {
    return <StatRow stats={stats} />;
} else {
    return <KpiStatsCom data={data} loading={false} />;
}
}

export default KpiStatsCon;
