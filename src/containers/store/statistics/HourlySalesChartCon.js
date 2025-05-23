import React, { useEffect, useState } from "react";
import HourlySalesChartCom from "../../../components/store/statistics/HourlySalesChartCom";
import { fetchHourlySales } from "../../../service/store/StatisticsService";
import LoadingLottie from '../../../components/common/LoadingLottie.tsx';

function HourlySalesChartCon({ filters, mode = "detail", height = 300  }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!filters?.storeId || !filters?.startDate || !filters?.endDate) return;

        const load = async () => {
            try {
                setLoading(true);

                const res = await fetchHourlySales({
                    storeId: filters.storeId,
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                });
                setData(res);

                console.log("📦 응답 데이터:", res); 

            } catch (e) {
                console.error("시간대별 매출 에러:", e);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [filters]);

    if (loading) return <LoadingLottie />;

    return (
        <HourlySalesChartCom
            data={data}
            loading={loading}
            mode={mode}
            height={height}
        />
    );
}

export default HourlySalesChartCon;