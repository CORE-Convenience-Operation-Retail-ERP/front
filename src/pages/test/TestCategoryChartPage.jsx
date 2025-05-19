import React, { useState } from "react";
import CategorySalesDonutCon from "../../containers/store/statistics/CategorySalesDonutCon";

function TestCategoryChartPage() {
    const [filters, setFilters] = useState({
        storeId: 1,
        categoryId: 1, // 음료 같은 상위 카테고리 ID
        startDate: "2025-05-01",
        endDate: "2025-05-20",
    });

    return (
        <div style={{ padding: "2rem" }}>
            <h2>📊 카테고리별 매출 통계 테스트</h2>
            <CategorySalesDonutCon filters={filters} />
        </div>
    );
}

export default TestCategoryChartPage;
