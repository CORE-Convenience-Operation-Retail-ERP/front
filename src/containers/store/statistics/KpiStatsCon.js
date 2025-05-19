import React, { useEffect, useState } from "react";
import KpiStatsCom from "../../../components/store/statistics/KpiStatsCom";
import { fetchKpiStats } from "../../../service/store/StatisticsService";

function KpiStatsCon({ filters }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);

                const useMock = true;
                if (useMock) {
                    const mock = {
                        totalSales: 1234560,
                        totalOrders: 840000,
                        todaySalesQuantity: 348,
                        stockInCount: 182
                    };
                    setData(mock);
                    return;
                }

                // 실제 API 연동 시 아래 사용
                // const res = await fetchKpiStats({
                //   storeId: filters.storeId,
                //   startDate: filters.startDate,
                //   endDate: filters.endDate,
                // });
                // setData(res);
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
