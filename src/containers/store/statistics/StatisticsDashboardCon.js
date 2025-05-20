import React, { useState, useEffect } from "react";
import StoreSearchBar from "../../../components/store/common/StoreSearchBar";

import KpiStatsCon from "./KpiStatsCon";
import HourlySalesChartCon from "./HourlySalesChartCon";
import ProductSalesChartCon from "./ProductSalesChartCon";
import CategorySalesDonutCon from "./CategorySalesDonutCon";
import OrderTopProductsCon from "./OrderTopProductsCon";

function StatisticsDashboardCon() {

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const defaultDate = yesterday.toISOString().slice(0, 10);
    const storeId = Number(localStorage.getItem("storeId") || 1);


    const [filters, setFilters] = useState({
        storeId,
        startDate: defaultDate,
        endDate: defaultDate,
        productName: "",
        categoryIds: [],
    });

    const handleSearch = (newFilter) => {
        if (newFilter.date) {
            setFilters((prev) => ({
                ...prev,
                startDate: newFilter.date,
                endDate: newFilter.date,
            }));
        }

        // 날짜 범위 필터가 들어온 경우
        else if (newFilter.startDate && newFilter.endDate) {
            setFilters((prev) => ({
                ...prev,
                startDate: newFilter.startDate,
                endDate: newFilter.endDate,
            }));
        }

    };

    return (
        <>
            <StoreSearchBar
                filterOptions={[
                    { key: "date", label: "날짜(단일)", type: "date" },
                    { key: "dateRange", label: "기간(범위)", type: "date-range" },
                ]}
                onSearch={handleSearch}
            />

            {/*  통계 시각화 */}
            <KpiStatsCon filters={filters} />
            <HourlySalesChartCon filters={filters} />
            <div style={{
                display: "flex",
                gap: "3rem",
                alignItems: "flex-start",
                flexWrap: "wrap",
                minHeight: "400px",
            }}>
                <div style={{marginTop:"3rem", display: "flex", gap: "2rem", alignItems: "flex-start" }}>
                    <div style={{ flex: 1, minWidth: "480px", height: "340px" }}>
                        <CategorySalesDonutCon filters={filters} mode="summary" />
                    </div>
                    <div style={{ flex: 1, minWidth: "480px", height: "340px" }}>
                        <ProductSalesChartCon filters={filters} mode="summary" />
                    </div>
                </div>

            </div>

            <OrderTopProductsCon filters={filters} />
        </>
    );
}

export default StatisticsDashboardCon;
