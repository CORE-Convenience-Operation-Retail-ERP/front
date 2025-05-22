import React from "react";
import SettlementCon from "../../containers/store/SettlementCon";
import {PageWrapper} from "../../features/store/styles/common/PageLayout";


const SettlementListPage = () => {
  return (
      <PageWrapper>
    <div style={{ padding: "24px" }}>
      <h2>| 정산 이력 조회</h2>
      <SettlementCon />
    </div>
      </PageWrapper>
  );
};

export default SettlementListPage;
