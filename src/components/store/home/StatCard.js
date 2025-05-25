import React from "react";

export default function StatCard({ label, value, icon }) {
  return (
    <div className="stat-card">
      {icon && <div className="stat-icon">{icon}</div>}
      <div className="stat-title">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
