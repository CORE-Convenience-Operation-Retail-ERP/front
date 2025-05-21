import React, { useEffect, useState } from "react";
import ProductSalesChartCom from "../../../components/store/statistics/ProductSalesChartCom";
import { fetchProductSales } from "../../../service/store/StatisticsService";
import ProductSalesTableCom from "../../../components/store/statistics/ProductSalesTableCom";

function ProductSalesChartCon({ filters, mode = "summary" }) {
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
                    categoryIds: filters.categoryIds
                });

                if (Array.isArray(res)) {
                    setData(res);
                } else {
                    setData([]);
                }

            } catch (e) {
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [filters]);

    return (
        <>
            <ProductSalesChartCom data={data} loading={loading} mode={mode} />
            {mode === "detail" && (
                <ProductSalesTableCom data={data} loading={loading} />
            )}
        </>
    );
}

export default ProductSalesChartCon;