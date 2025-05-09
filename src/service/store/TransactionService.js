import axios from "axios";

// 점주 storeId 기반 전체 거래 조회
export const fetchTransactionsByStore = async (storeId) => {
  const token = localStorage.getItem("token");

  const response = await axios.get("/api/transactions", {
    params: { storeId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};