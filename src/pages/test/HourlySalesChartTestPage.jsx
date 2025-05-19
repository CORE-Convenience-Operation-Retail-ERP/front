import React from "react";
import HourlySalesChartCon from "../../containers/store/statistics/HourlySalesChartCon";

// ✅ 기본 필터 세트 (필요 시 실제 storeId 등으로 교체)
const mockFilters = {
    storeId: 1,
    startDate: "2025-05-01",
    endDate: "2025-05-01",
};

function HourlySalesChartTestPage() {
    return (
        <div style={{ padding: "2rem" }}>
            <h2>🕒 시간대별 매출 차트 테스트</h2>
            <HourlySalesChartCon filters={mockFilters} />
        </div>
    );
}

export default HourlySalesChartTestPage;
