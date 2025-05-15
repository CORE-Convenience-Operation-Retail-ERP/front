import axios from "../axiosInstance";

// 1. 재고 현황 조회
export const fetchStoreStockList = async ({ categoryId, productName, barcode, page = 0, size = 10 }) => {
  return await axios.get("/api/stock/summary", {
    params: {
      categoryId,
      productName,
      barcode,
      page,
      size
    }
  });
};

// 2. 재고 이동 요청
export const requestStockTransfer = async (transferData) => {
  return await axios.post("/api/stock/transfer", transferData);
};
