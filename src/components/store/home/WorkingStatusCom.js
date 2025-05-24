import React from "react";

export default function WorkingStatusCom({ value = [] }) {
  const label = value.length > 0 ? `• ${value.join(", ")}` : "• 근무 없음";

  return (
    <div className="info-card">
      <div className="info-title">근무자 일정</div>
      <div className="info-value">{label}</div>
    </div>
  );
}
