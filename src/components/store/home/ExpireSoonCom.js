import React from "react";

export default function ExpireSoonCom({ list }) {
  const count = list.length;
  const firstName = count > 0 ? list[0].proName : "없음";

  const label = count === 0
    ? "• 폐기 예정 없음"
    : count === 1
      ? `• ${firstName}`
      : `• ${firstName} 외 ${count - 1}건`;

  return (
    <div className="info-card">
      <div className="info-title">폐기 임박 상품</div>
      <div className="info-value">
        {label}
        {count > 0 && (
          <span className="badge badge-warning">{count}건</span>
        )}
      </div>
    </div>
  );
}
