import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import StockDetailCom from "../../../components/store/stock/StockDetailCom";
import LocationEditorModal from "../../../components/store/display/LocationEditorModal";
import {
  fetchStockFlowLogs,
  fetchProductDetail
} from "../../../service/store/StockFlowService";
import { fetchMappedLocations } from "../../../service/store/StockService";

export default function StockDetailCon() {
  const { productId } = useParams();

  const [productDetail, setProductDetail] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [highlightLocationCodes, setHighlightLocationCodes] = useState([]);
  const [selectedLocationCode, setSelectedLocationCode] = useState(null);
  const [showLocationEdit, setShowLocationEdit] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [version, setVersion] = useState(0); // 강제 리렌더링 트리거용

  const loadData = useCallback(async () => {
    try {
      const [detail, logs, mapped] = await Promise.all([
        fetchProductDetail(productId),
        fetchStockFlowLogs({ productId, page: 0, size: 10 }),
        fetchMappedLocations(productId)
      ]);

      setProductDetail(detail);
      setHistoryList(logs.content || []);

      const shelf = mapped?.shelf || [];
      const warehouse = mapped?.warehouse || [];
      const codes = [...shelf, ...warehouse].map(loc => loc.locationCode);
      setHighlightLocationCodes(codes);
      setVersion(v => v + 1); // 리렌더링 트리거 증가
    } catch (err) {
      console.error("데이터 조회 실패:", err);
      alert("상품 또는 입출고 로그를 불러오는 데 실패했습니다.");
    }
  }, [productId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <>
      <StockDetailCom
        productDetail={{
          ...productDetail,
          locationCode: highlightLocationCodes,
          selectedLocationCode
        }}
        historyList={historyList}
        onReload={loadData}
        highlightLocationCodes={highlightLocationCodes}
        selectedLocationCode={selectedLocationCode}
        onClickSaveLocation={loadData}
        setMappedLocation={({ locationCode }) => {
          setSelectedLocationCode(locationCode);
        }}
        onClickOpenView={() => {
          setIsEditMode(false);
          setShowLocationEdit(true);
        }}
        onClickOpenEdit={() => {
          setIsEditMode(true);
          setShowLocationEdit(true);
        }}
      />

      {showLocationEdit && (
        <LocationEditorModal
          isEditMode={isEditMode}
          onClose={() => setShowLocationEdit(false)}
          onSaveSuccess={() => {
            loadData();
            setShowLocationEdit(false);
          }}
          productLocationCode={highlightLocationCodes}
          selectedLocationCode={selectedLocationCode}
          onSelectLocation={(locationCode) => {
            setSelectedLocationCode(locationCode);
          }}
        />
      )}
    </>
  );
}