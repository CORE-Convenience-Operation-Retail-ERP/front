import React, { useEffect, useState } from "react";
import HourlySalesChartCom from "../../../components/store/statistics/HourlySalesChartCom";
import { fetchHourlySales } from "../../../service/store/StatisticsService";

function HourlySalesChartCon({ filters }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);

                //  테스트 데이터 (모드)
                const useMock = true;
                if (useMock) {
                    const mock = [
                        { hour: "06:00", salesAmount: 12000 },
                        { hour: "07:00", salesAmount: 20000 },
                        { hour: "08:00", salesAmount: 35000 },
                        { hour: "09:00", salesAmount: 41000 },
                        { hour: "10:00", salesAmount: 52000 },
                        { hour: "11:00", salesAmount: 43000 },
                        { hour: "12:00", salesAmount: 58000 },
                        { hour: "13:00", salesAmount: 60000 },
                        { hour: "14:00", salesAmount: 57000 },
                        { hour: "15:00", salesAmount: 62000 },
                        { hour: "16:00", salesAmount: 48000 },
                        { hour: "17:00", salesAmount: 53000 },
                        { hour: "18:00", salesAmount: 70000 },
                        { hour: "19:00", salesAmount: 75000 },
                        { hour: "20:00", salesAmount: 67000 },
                        { hour: "21:00", salesAmount: 63000 },
                        { hour: "22:00", salesAmount: 40000 },
                        { hour: "23:00", salesAmount: 27000 },
                        { hour: "24:00", salesAmount: 18000 },
                    ];
                    setData(mock);
                    return;
                }

                //  실제 API 호출용
                // const res = await fetchHourlySales({
                //   storeId: filters.storeId,
                //   startDate: filters.startDate,
                //   endDate: filters.endDate,
                // });
                // setData(res);

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