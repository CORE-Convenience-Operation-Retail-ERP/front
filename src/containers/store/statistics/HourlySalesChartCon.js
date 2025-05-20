import React, { useEffect, useState } from "react";
import HourlySalesChartCom from "../../../components/store/statistics/HourlySalesChartCom";
import { fetchHourlySales } from "../../../service/store/StatisticsService";

function HourlySalesChartCon({ filters }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {

            if (!filters?.storeId || !filters.startDate || !filters.endDate) return;


            try {
                setLoading(true);

                const res = await fetchHourlySales({
                    storeId: filters.storeId,
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                });
                setData(res);

            } catch (e) {
                console.error("시간대별 매출 에러:", e);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [filters]);

    return (
        <HourlySalesChartCom
            data={data}
            loading={loading}
        />
    );
}

export default HourlySalesChartCon;