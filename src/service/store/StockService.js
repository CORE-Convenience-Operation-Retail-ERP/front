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

// 2. 단일 상품 재고 상세 조회
export const fetchStoreStockById = async (stockId) => {
  return await axios.get(`/api/store-stock/${stockId}`);
};

// 3. 수동 재고 조정 요청
export const adjustStoreStock = async (adjustmentData) => {
  return await axios.post("/api/store-stock/adjust", adjustmentData);
};

// 4. 재고 조정 로그 조회
export const fetchAdjustLog = async ({ startDate, endDate, reasonCode, page = 0, size = 10 }) => {
  return await axios.get("/api/store-stock/adjust-log", {
    params: {
      startDate,
      endDate,
      reasonCode,
      page,
      size
    }
  });
};
