import React from "react";
import HomeStatusCon from "../../containers/store/home/HomeStatusCon";
import HomeButtonGrid from "../../containers/store/home/HomeButtonGrid";
import "../../../src/styles/home.css";

import KpiStatsCon from "../../containers/store/statistics/KpiStatsCon";
import { getMenus } from "../../service/store/homeService";

export default function HomePage() {
  // 1. 기간: 최근 30일 (오늘~30일 전)
  const storeId = localStorage.getItem("storeId");
  const today = new Date();
  const endDate = today.toISOString().slice(0, 10);
  const start = new Date();
  start.setDate(today.getDate() - 29);
  const startDate = start.toISOString().slice(0, 10);

  // 2. KPI/통계용 필터 (storeId, 기간)
  const filters = { storeId, startDate, endDate };

  const menus = getMenus();

  return (
    <div className="home-wrapper">
      <div className="content-inner">
        <div className="home-left">
          <KpiStatsCon filters={filters} variant="main" />
          <HomeStatusCon storeId={storeId} />
        </div>
        <div className="home-right">
          <HomeButtonGrid menus={menus} />
        </div>
      </div>
    </div>
  );
}
