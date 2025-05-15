import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StockDetailCom from '../../../components/store/stock/StockDetailCom';
import { fetchStockFlowLogs, fetchProductDetail } from '../../../service/store/StockFlowService'; 


export default function StockDetailCon() {
  const { productId } = useParams();
  const [productDetail, setProductDetail] = useState(null);
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [detail, logs] = await Promise.all([
          fetchProductDetail(productId),
          fetchStockFlowLogs({ productId, page: 0, size: 10 })
        ]);

        console.log("🟢 상품 상세 정보:", detail);
        console.log("📦 재고 흐름 로그:", logs);

        setProductDetail(detail);
        setHistoryList(logs.content || []);
      } catch (err) {
        console.error("데이터 조회 실패:", err);
        alert("상품 또는 입출고 로그를 불러오는 데 실패했습니다.");
      }
    };

    loadData();
  }, [productId]);

  return (
    <StockDetailCom
      productDetail={productDetail}
      historyList={historyList}
    />
  );
}

