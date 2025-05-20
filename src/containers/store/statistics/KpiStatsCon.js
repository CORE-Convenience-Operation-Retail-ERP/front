import React, { useEffect, useState } from "react";
import KpiStatsCom from "../../../components/store/statistics/KpiStatsCom";
import { fetchKpiStats } from "../../../service/store/StatisticsService";

function KpiStatsCon({ filters }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {

            if (!filters?.storeId || !filters.startDate || !filters.endDate) return;

            try {
                setLoading(true);

                const res = await fetchKpiStats({
                    storeId: filters.storeId,
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                });
                setData(res);
            } catch (err) {
                console.error("KPI 통계 불러오기 실패", err);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [filters]);

    return (
        <KpiStatsCom data={data} loading={loading} />
    );
}

export default KpiStatsCon;