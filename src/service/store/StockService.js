// src/service/store/StockService.js
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

// 2. 재고 상세 정보 조회
export const fetchStockDetail = async (productId) => {
  return await axios.get(`/api/store/stock/detail/${productId}`);
};

// 3. 수량 변화 로그 조회
export const fetchStockHistory = async (productId) => {
  return await axios.get(`/api/store/stock/history/${productId}`);
};
