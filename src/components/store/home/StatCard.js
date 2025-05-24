import React from "react";

export default function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-title">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
