import React, { useEffect, useState } from "react";
import OrderTopProductsCom from "../../../components/store/statistics/OrderTopProductsCom";
import { fetchTopOrderProducts } from "../../../service/store/StatisticsService";

function OrderTopProductsCon({ filters }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);

                const useMock = true;
                if (useMock) {
                    const mock = [
                        { productName: "삼각김밥 참치", orderCount: 123 },
                        { productName: "콜라 500ml", orderCount: 95 },
                        { productName: "초코파이", orderCount: 82 },
                        { productName: "컵라면", orderCount: 76 },
                        { productName: "박카스", orderCount: 64 },
                        { productName: "스낵면", orderCount: 58 },
                        { productName: "초코우유", orderCount: 49 },
                        { productName: "비타500", orderCount: 37 },
                        { productName: "빅바 바나나", orderCount: 29 },
                        { productName: "마가렛트", orderCount: 22 }
                    ];
                    setData(mock);
                    return;
                }

                // 실제 API 연동 시 사용
                // const res = await fetchTopOrderProducts({
                //   storeId: filters.storeId,
                //   startDate: filters.startDate,
                //   endDate: filters.endDate,
                // });
                // setData(res);
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
