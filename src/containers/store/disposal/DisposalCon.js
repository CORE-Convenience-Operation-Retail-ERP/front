import React, { useEffect, useState } from "react";
import { cancelDisposalById, fetchDisposalHistory, fetchExpiredDisposals } from "../../../service/store/DisposalService";
import DisposalCom from "../../../components/store/disposal/DisposalCom";
import {PageTitle} from "../../../features/store/styles/common/PageLayout";

const DisposalCon = () => {
  const [expiredList, setExpiredList] = useState([]);
  const [disposalList, setDisposalList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [expiredPage, setExpiredPage] = useState(0);
  const [disposalPage, setDisposalPage] = useState(0);
  const pageSize = 10;

  const loadData = async () => {
    try {
      const [expired, history] = await Promise.all([
        fetchExpiredDisposals(),
        fetchDisposalHistory(),
      ]);
      setExpiredList(expired);
      setDisposalList(history);
    } catch (e) {
      console.error("폐기 데이터 조회 실패", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancel = async (disposalId) => {
    try {
      await cancelDisposalById(disposalId);
      alert("✅ 폐기 내역이 취소되었습니다.");
      loadData();
    } catch (e) {
      alert("❌ 취소 실패: " + (e.response?.data || e.message));
    }
  };

  const paginatedExpired = expiredList.slice(
      expiredPage * pageSize,
      (expiredPage + 1) * pageSize
  );
  const paginatedDisposal = disposalList.slice(
      disposalPage * pageSize,
      (disposalPage + 1) * pageSize
  );

  return (
      <>
        <PageTitle>🗑 폐기 관리</PageTitle>
        <DisposalCom
          expiredList={paginatedExpired}
          disposalList={paginatedDisposal}
          loading={loading}
          onCancel={handleCancel}
          expiredPage={expiredPage}
          expiredTotalPages={Math.ceil(expiredList.length / pageSize)}
          onExpiredPageChange={setExpiredPage}
          disposalPage={disposalPage}
          disposalTotalPages={Math.ceil(disposalList.length / pageSize)}
          onDisposalPageChange={setDisposalPage}
      />
      </>
  );
};

export default DisposalCon;