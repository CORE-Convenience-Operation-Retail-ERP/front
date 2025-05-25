import React from "react";
import HomeStatusCon from "../../containers/store/home/HomeStatusCon";
import HomeButtonGrid from "../../containers/store/home/HomeButtonGrid";
import "../../../src/styles/home.css";

import KpiStatsCon from "../../containers/store/statistics/KpiStatsCon";
import { getMenus } from "../../service/store/homeService";

export default function HomePage() {
  // 기간: 오늘 ~ 29일 전
  const storeId = localStorage.getItem("storeId");
  const today = new Date();
  const endDate = today.toISOString().slice(0, 10);
  const start = new Date();
  start.setDate(today.getDate() - 29);
  const startDate = start.toISOString().slice(0, 10);

  const filters = { storeId, startDate, endDate };
  const menus = getMenus();

  return (
    <div className="home-wrapper">
      {/* 헤더 */}
      <div className="home-header">
        <h1>
          Welcome to the <strong>CORE</strong>
        </h1>
        <hr />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="content-inner">
        {/* 좌측: KPI 그리드 */}
        <div className="home-left">
          <KpiStatsCon filters={filters} variant="main" />
        </div>

        {/* 우측: 내비 + 상태 리스트 */}
        <div className="home-right">
          <HomeButtonGrid menus={menus} />
          <HomeStatusCon storeId={storeId} />
        </div>
      </div>
    </div>
  );
}
