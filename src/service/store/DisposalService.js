import axios from "axios";

const token = localStorage.getItem("token");

// 폐기 대상 자동 조회
export const fetchExpiredDisposals = async () => {
  const response = await axios.get("/api/erp/disposal/expired", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// 폐기 내역 전체 조회
export const fetchDisposalHistory = async () => {
  const response = await axios.get("/api/erp/disposal/history", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// 폐기 내역 삭제(취소)
export const cancelDisposalById = async (disposalId) => {
  const response = await axios.delete(`/api/erp/disposal/cancel/${disposalId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
