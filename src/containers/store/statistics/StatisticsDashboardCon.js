import React, { useState, useEffect } from "react";
import StoreSearchBar from "../../../components/store/common/StoreSearchBar";

import KpiStatsCon from "./KpiStatsCon";
import HourlySalesChartCon from "./HourlySalesChartCon";
import ProductSalesChartCon from "./ProductSalesChartCon";
import CategorySalesDonutCon from "./CategorySalesDonutCon";
import OrderTopProductsCon from "./OrderTopProductsCon";
import { useNavigate } from "react-router-dom";
import {PageTitle, PageWrapper} from "../../../features/store/styles/common/PageLayout";

function StatisticsDashboardCon() {
    const navigate = useNavigate();
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const defaultStartDate = oneMonthAgo.toISOString().slice(0, 10);
    const defaultEndDate = today.toISOString().slice(0, 10);
    const storeId = Number(localStorage.getItem("storeId") || 1);

    const [filters, setFilters] = useState({
        storeId,
        startDate: defaultStartDate,
        endDate: defaultEndDate,
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
        } else if (newFilter.startDate && newFilter.endDate) {
            setFilters((prev) => ({
                ...prev,
                startDate: newFilter.startDate,
                endDate: newFilter.endDate,
            }));
        }
    };

    return (
        <PageWrapper>

            <PageTitle>| 통계 관리</PageTitle>
            <div style={{ display: "flex", justifyContent: "flex-end", marginRight: "1rem" }}>
            <StoreSearchBar
                filterOptions={[
                    { key: "date", label: "날짜(단일)", type: "date" },
                    { key: "dateRange", label: "기간(범위)", type: "date-range" },
                ]}
                onSearch={handleSearch}
            />
            </div>


            {/* KPI 통계 */}
            <KpiStatsCon filters={filters} variant="statistics" />

            {/* 시간별 매출 차트 */}
            <div
                className="card"
                onClick={() => navigate("/store/stats/time", { state: filters })}
                style={{ cursor: "pointer", maxWidth: "1500px", margin: "0 auto" }}
            >
                <HourlySalesChartCon filters={filters} mode="full" height={300} />
            </div>

            {/* 카테고리 & 상품 차트 */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "1200px",
                    margin: "0 auto",
                    display: "flex",
                    gap: "20rem",
                    alignItems: "flex-start",
                    flexWrap: "nowrap",
                    minHeight: "400px",
                }}
            >
                <div
                    style={{
                        flex: 1,
                        minWidth: "350px",
                        height: "340px",
                        cursor: "pointer",
                        marginTop: "3rem",
                    }}
                    onClick={(e) => {
                        const isInsideSelect = e.target.tagName === "SELECT" || e.target.closest("select");
                        if (!isInsideSelect) {
                            navigate("/store/stats/category", { state: filters });
                        }
                    }}
                >
                    <CategorySalesDonutCon filters={filters} mode="summary" />
                </div>
                <div
                    style={{
                        flex: 2,
                        minWidth: "600px",
                        height: "340px",
                        cursor: "pointer",
                        marginTop: "-1em",
                    }}
                    onClick={() => navigate("/store/stats/product", { state: filters })}
                >
                    <ProductSalesChartCon filters={filters} mode="summary" />
                </div>
            </div>

            {/* 발주 상위 */}
            <div
              className="card"
              onClick={(e) => {
                const isInsideButton = e.target.tagName === "BUTTON" || e.target.closest("button");
                if (!isInsideButton) {
                  navigate("/store/stats/order", { state: filters });
                }
              }}
              style={{ cursor: "pointer", maxWidth: "1500px", margin: "0 auto" }}
            >
              <OrderTopProductsCon filters={filters} mode="mini" height={180} />
            </div>
        </PageWrapper>
    );
}

export default StatisticsDashboardCon;