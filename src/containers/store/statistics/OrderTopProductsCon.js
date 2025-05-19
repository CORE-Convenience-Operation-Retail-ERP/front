import React, { useEffect, useState } from "react";
import OrderTopProductsCom from "../../../components/store/statistics/OrderTopProductsCom";
import { fetchOrderTopProducts } from "../../../service/store/StatisticsService";

function OrderTopProductsCon({ filters }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
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
    }, [filters]);

    return (
        <OrderTopProductsCom data={data} loading={loading} />
    );
}

export default OrderTopProductsCon;
