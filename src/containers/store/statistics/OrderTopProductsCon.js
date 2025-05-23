import React, { useEffect, useState } from "react";
import OrderTopProductsCom from "../../../components/store/statistics/OrderTopProductsCom";
import { fetchOrderTopProducts } from "../../../service/store/StatisticsService";
import OrderTopProductsTableCom from "../../../components/store/statistics/OrderTopProductsTableCom";
import LoadingLottie from '../../../components/common/LoadingLottie.tsx';

function OrderTopProductsCon({ filters, mode = "summary", showTable = false  }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (!filters?.storeId || !filters.startDate || !filters.endDate) return;

            try {
                setLoading(true);
                const res = await fetchOrderTopProducts({
                    storeId: filters.storeId,
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                });

                setData(res);
            } catch (e) {
                console.error("상위 발주 상품 조회 실패", e);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [filters, mode]);

    if (loading) return <LoadingLottie />;

    return (
        <>
            <OrderTopProductsCom data={data} loading={loading} mode={mode} />
            {showTable && mode === "detail" && (
                <OrderTopProductsTableCom data={data} loading={loading} />
            )}
        </>
    );
}

export default OrderTopProductsCon;