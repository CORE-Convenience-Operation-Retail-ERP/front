import React from "react";
import StatCard from "../../../components/store/home/StatCard";

export default function StatRow({ stats, columns = 4, gap = 20 }) {
  const style = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap}px`,
  };

  return (
    <div className="stat-row" style={style}>
      {stats.map((item, idx) => (
        <StatCard key={idx} label={item.label} value={item.value} />
      ))}
    </div>
  );
}
