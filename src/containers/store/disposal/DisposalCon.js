import React, { useEffect, useState } from "react";
import { cancelDisposalById, fetchDisposalHistory, fetchExpiredDisposals } from "../../../service/store/DisposalService";
import DisposalCom from "../../../components/store/disposal/DisposalCom";

const DisposalCon = () => {
  const [expiredList, setExpiredList] = useState([]);
  const [disposalList, setDisposalList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 폐기 데이터 로딩 함수
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

  // 최초 마운트 시 데이터 로드
  useEffect(() => {
    loadData();
  }, []);

  // 폐기 취소 처리
  const handleCancel = async (disposalId) => {
    try {
      await cancelDisposalById(disposalId);
      alert("✅ 폐기 내역이 취소되었습니다.");
      loadData(); // 데이터 갱신
    } catch (e) {
      alert("❌ 취소 실패: " + (e.response?.data || e.message));
    }
  };

  return (
    <DisposalCom
      expiredList={expiredList}
      disposalList={disposalList}
      loading={loading}
      onCancel={handleCancel}
    />
  );
};

export default DisposalCon;
