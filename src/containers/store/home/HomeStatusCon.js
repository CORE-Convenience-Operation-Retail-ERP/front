import React from "react";
import WorkingStatusCon from "./WorkingStatusCon";
import StockShortageCon from "./StockShortageCon";
import ExpireSoonCon from "./ExpireSoonCon";

export default function HomeStatusCon({ storeId }) {
  return (
    <div className="info-col">
      <WorkingStatusCon storeId={storeId} />
      <StockShortageCon storeId={storeId} />
      <ExpireSoonCon storeId={storeId} />
    </div>
  );
}
