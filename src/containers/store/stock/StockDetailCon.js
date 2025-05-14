import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StockDetailCom from '../../../components/store/stock/StockDetailCom';

// 🔧 아직 API 연동 전이므로 mock 사용
const mockProductDetail = {
    productName: "콜라 500ml",
    barcode: "8801234567890",
    promoStatus: "1+1",
    storeQuantity: 30,
    warehouseQuantity: 20,
    realStoreQuantity: 28,
    realWarehouseQuantity: 22,
    locationCode: "A-03"
};

const mockHistoryList = [
    {
        date: "2025-05-14T09:00:00",
        type: "실사 반영",
        quantity: -2,
        beforeQuantity: 30,
        afterQuantity: 28,
        location: "매장",
        by: "관리자",
        note: "정기 실사 오차"
    },
    {
        date: "2025-05-13T17:00:00",
        type: "입고",
        quantity: 10,
        beforeQuantity: 20,
        afterQuantity: 30,
        location: "창고",
        by: "김입고",
        note: "발주 입고"
    },
    {
        date: "2025-05-13T13:00:00",
        type: "이동",
        quantity: -3,
        beforeQuantity: 15,
        afterQuantity: 12,
        location: "창고 → 매장",
        by: "이매장",
        note: "진열 이동"
    }
];


export default function StockDetailCon() {
    const { productId } = useParams();

    // 추후 API 호출로 교체할 상태값
    const [productDetail, setProductDetail] = useState(null);
    const [historyList, setHistoryList] = useState([]);

    useEffect(() => {
        // ⚠️ 실제 API 연동 시 fetchProductDetail(productId) 등으로 대체
        setProductDetail(mockProductDetail);
        setHistoryList(mockHistoryList);
    }, [productId]);

    return (
        <StockDetailCom
            productDetail={productDetail}
            historyList={historyList}
        />
    );
}
