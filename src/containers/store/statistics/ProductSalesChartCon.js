import React, { useEffect, useState } from "react";
import ProductSalesChartCom from "../../../components/store/statistics/ProductSalesChartCom";
import { fetchProductSales } from "../../../service/store/StatisticsService";

function ProductSalesChartCon({ filters }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);

                const res = await fetchProductSales({
                    storeId: filters.storeId,
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                    categoryIds: filters.categoryIds // 선택적 필터도 전달
                });

                console.log("📦 상품별 매출 응답:", res);
                if (Array.isArray(res)) {
                    setData(res);
                } else {
                    console.warn("❗예상과 다른 응답 형식:", res);
                    setData([]);
                }

            } catch (e) {
                console.error("❌ 상품별 매출 조회 실패", e);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [filters]);

    return <ProductSalesChartCom data={data} loading={loading} />;
}

export default ProductSalesChartCon;