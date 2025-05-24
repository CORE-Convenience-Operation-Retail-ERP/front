import React from "react";

export default function StockShortageCom({ count }) {
  const label = count === 0 ? "• 부족한 상품 없음" : "• 재고 부족 상품";

  return (
    <div className="info-card">
      <div className="info-title">재고 부족</div>
      <div className="info-value">
        {label}
        {count > 0 && (
          <span className="badge badge-danger">{count}건</span>
        )}
      </div>
    </div>
  );
}
