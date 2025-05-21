import React, { useState, useEffect } from "react";
import StoreSearchBar from "../../../components/store/common/StoreSearchBar";

import KpiStatsCon from "./KpiStatsCon";
import HourlySalesChartCon from "./HourlySalesChartCon";
import ProductSalesChartCon from "./ProductSalesChartCon";
import CategorySalesDonutCon from "./CategorySalesDonutCon";
import OrderTopProductsCon from "./OrderTopProductsCon";
import { useNavigate } from "react-router-dom";
import {PageTitle} from "../../../features/store/styles/common/PageLayout";

function StatisticsDashboardCon() {
    const navigate = useNavigate();
    // 기본값: 어제 날짜

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

            <PageTitle>통계 관리</PageTitle>
            <div style={{ display: "flex", justifyContent: "flex-end", marginRight: "1rem" }}>
            <StoreSearchBar
                filterOptions={[
                    { key: "date", label: "날짜(단일)", type: "date" },
                    { key: "dateRange", label: "기간(범위)", type: "date-range" },
                ]}
                onSearch={handleSearch}
            />
            </div>


            {/*  통계 시각화 */}
            <KpiStatsCon filters={filters} />
            <div
                className="card"
                onClick={() => navigate("/store/stats/time", { state: filters })}
                style={{ cursor: "pointer" }}
            >
                <HourlySalesChartCon filters={filters} mode="full" height={300} />
            </div>
            <div style={{
                display: "flex",
                gap: "3rem",
                alignItems: "flex-start",
                flexWrap: "wrap",
                minHeight: "400px",
            }}>
                <div style={{marginTop:"3rem", display: "flex", gap: "2rem", alignItems: "flex-start" }}>
                    <div 
                        style={{ flex: 1, minWidth: "480px", height: "340px" }}
                        onClick={() => navigate("/store/stats/category", { state: filters })}
                    >
                        <CategorySalesDonutCon filters={filters} mode="summary" />
                    </div>
                    <div 
                        style={{ flex: 1, minWidth: "480px", height: "340px" }}
                        onClick={() => navigate("/store/stats/product", { state: filters })}
                    >
                        <ProductSalesChartCon filters={filters} mode="summary" />
                    </div>
                </div>

            </div>
            <div
                className="card"
                onClick={() => navigate("/store/stats/order", { state: filters })}
                style={{ cursor: "pointer" }}
            >
                <OrderTopProductsCon filters={filters} mode="mini" height={180} />
            </div>

        </>
    );
}

export default StatisticsDashboardCon;