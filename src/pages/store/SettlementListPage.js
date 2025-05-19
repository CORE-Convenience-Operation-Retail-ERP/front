import React from "react";
import SettlementCon from "../../containers/store/SettlementCon";


const SettlementListPage = () => {
  return (
    <div style={{ padding: "24px" }}>
      <h2>정산 이력 조회</h2>
      <SettlementCon />
    </div>
  );
};

export default SettlementListPage;
