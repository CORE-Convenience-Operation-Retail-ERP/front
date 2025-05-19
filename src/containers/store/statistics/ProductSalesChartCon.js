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
                });
                setData(res);
            } catch (e) {
                console.error("상품별 매출 조회 실패", e);
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
