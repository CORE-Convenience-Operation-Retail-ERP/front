import React, { useState } from "react";
import { updateHQStock } from "../../service/headquarters/HQStockService";

const ProductsDetailCom = ({ detail, onBack, onEdit, onInOut }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isUpdatingHQStock, setIsUpdatingHQStock] = useState(false);
  const [hqStockQuantity, setHqStockQuantity] = useState(detail?.hqStock || 0);
  const [showHQStockEditor, setShowHQStockEditor] = useState(false);

  if (!detail) return <div>로딩중...</div>;

  const handleHQStockUpdate = async () => {
    if (hqStockQuantity < 0) {
      alert("재고 수량은 0 이상이어야 합니다.");
      return;
    }
    
    setIsUpdatingHQStock(true);
    
    try {
      await updateHQStock(detail.productId, hqStockQuantity);
      alert("본사 재고가 업데이트되었습니다.");
      setShowHQStockEditor(false);
    } catch (error) {
      alert(`재고 업데이트 실패: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsUpdatingHQStock(false);
    }
  };

  return (
    <div style={{ padding: 32 }}>
      {/* 상단 네비 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={onBack}>← 제품 목록으로 돌아가기</button>
        <button onClick={onEdit}>상품 정보 수정</button>
      </div>
      {/* 제품 기본 정보 */}
      <div style={{ display: "flex", alignItems: "center", marginTop: 24 }}>
        <img src={detail.proImage} alt="제품" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8, marginRight: 32 }} />
        <div>
        <h1 style={{ margin: 0 }}>{detail.proName}</h1>
          <div>제품 코드: {detail.productId}</div>
          <div>
            카테고리: {detail.categoryPath ? detail.categoryPath.join(" > ") : ""}
          </div>
          <div>바코드: {detail.proBarcode}</div>
          <div>상태: {detail.status}</div>
          <div>
            이벤트 기간:{" "}
            {detail.eventStart && detail.eventEnd
              ? `${detail.eventStart} ~ ${detail.eventEnd}`
              : "없음"}
          </div>
        </div>
      </div>
      {/* 2x2 표 정보 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 24,
          marginTop: 32,
        }}
      >
        {/* 재고 정보 */}
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
          <h3>재고 정보</h3>
          <div>매장 총 재고: {detail.totalStock}</div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
            <div>본사 재고: </div>
            {showHQStockEditor ? (
              <div style={{ display: "flex", alignItems: "center", marginLeft: 8 }}>
                <input
                  type="number"
                  value={hqStockQuantity}
                  onChange={(e) => setHqStockQuantity(parseInt(e.target.value) || 0)}
                  style={{ width: 80, marginRight: 8 }}
                />
                <button 
                  onClick={handleHQStockUpdate}
                  disabled={isUpdatingHQStock}
                  style={{
                    padding: "4px 8px",
                    background: "#5bc0de",
                    border: "none",
                    borderRadius: "4px",
                    color: "white",
                    marginRight: 4
                  }}
                >
                  {isUpdatingHQStock ? "..." : "저장"}
                </button>
                <button 
                  onClick={() => setShowHQStockEditor(false)}
                  style={{
                    padding: "4px 8px",
                    background: "#f5f5f5",
                    border: "1px solid #ddd",
                    borderRadius: "4px"
                  }}
                >
                  취소
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ 
                  color: detail.hqStock < 100 ? "orange" : "black",
                  marginLeft: 8,
                  marginRight: 8
                }}>
                  {detail.hqStock}
                </span>
                <button 
                  onClick={() => {
                    setHqStockQuantity(detail.hqStock || 0);
                    setShowHQStockEditor(true);
                  }}
                  style={{
                    padding: "4px 8px",
                    background: "#5bc0de",
                    border: "none",
                    borderRadius: "4px",
                    color: "white",
                    fontSize: "12px"
                  }}
                >
                  수정
                </button>
              </div>
            )}
          </div>
          <div>발주 임계치: {detail.proStockLimit}</div>
          <button onClick={() => setModalOpen(true)}>점포별 재고 조회</button>
        </div>
        {/* 가격 정보 */}
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
          <h3>가격 정보</h3>
          <div>공급가: {detail.proCost?.toLocaleString()}원</div>
          <div>판매가: {detail.proSellCost?.toLocaleString()}원</div>
          <div>이익률: {detail.profitRate?.toFixed(1)}%</div>
          <div>원가율: {detail.costRate?.toFixed(1)}%</div>
        </div>
        {/* 입출고 정보 */}
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
          <h3>입출고 정보</h3>
          {detail.recentStockIns?.map((s, i) => (
            <div key={i}>
              {s.storeName} | {s.inDate} | {s.inQuantity}개
            </div>
          ))}
          <button onClick={onInOut} style={{ marginTop: 8 }}>
            입출고 내역 확인
          </button>
        </div>
        {/* 부가 정보 */}
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
          <h3>부가 정보</h3>
          {detail.productDetail ? (
            <>
              <div>제조사: {detail.productDetail.manufacturer}</div>
              <div>제조사 연락처: {detail.productDetail.manuNum}</div>
              <div>유통기한: {detail.productDetail.shelfLife}</div>
              <div>알레르기: {detail.productDetail.allergens}</div>
              <div>보관방법: {detail.productDetail.storageMethod}</div>
            </>
          ) : (
            <div>부가 정보 없음</div>
          )}
        </div>
      </div>
      {/* 제품 상세 분석 (공간만) */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 16,
          marginTop: 24,
        }}
      >
        <h3>제품 상세 분석</h3>
        <div
          style={{
            height: 180,
            background: "#f5f5f5",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          (분석/차트 등 공간)
        </div>
      </div>
      {/* 점포별 재고 모달 */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: 32,
              minWidth: 320,
            }}
          >
            <h3>점포별 재고</h3>
            {detail.storeStocks?.map((s, i) => (
              <div key={i} style={{ color: s.quantity <= 5 ? "red" : "black" }}>
                {s.storeName} : {s.quantity}개
              </div>
            ))}
            <button onClick={() => setModalOpen(false)} style={{ marginTop: 16 }}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsDetailCom;