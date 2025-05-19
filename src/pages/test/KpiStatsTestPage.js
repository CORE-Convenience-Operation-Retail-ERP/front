import React from "react";
import KpiStatsCon from "../../containers/store/statistics/KpiStatsCon";

const mockFilters = {
    storeId: 1,
    startDate: "2025-05-01",
    endDate: "2025-05-01",
};

function KpiStatsTestPage() {
    return (
        <div style={{ padding: "2rem" }}>
            <h2>📊 KPI 통계 카드 테스트</h2>
            <KpiStatsCon filters={mockFilters} />
        </div>
    );
}

export default KpiStatsTestPage;
