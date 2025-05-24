import React from "react";
import StatCard from "../../../components/store/home/StatCard";


export default function StatRow({ stats }) {
  return (
    <div className="stat-row">
      {stats.map((item, idx) =>
        <StatCard key={idx} label={item.label} value={item.value} />
      )}
    </div>
  );
}
