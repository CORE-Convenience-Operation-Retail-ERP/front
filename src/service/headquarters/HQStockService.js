import axios from "../axiosInstance";

// 본사 재고 관련 서비스
export const fetchAllHQStocks = async () => {
  return await axios.get("/api/hq-stock");
};

export const fetchHQStockByProductId = async (productId) => {
  return await axios.get(`/api/hq-stock/${productId}`);
};

export const initializeAllHQStocks = async () => {
  return await axios.post("/api/hq-stock/initialize");
};

export const updateHQStock = async (productId, quantity) => {
  return await axios.put(`/api/hq-stock/${productId}?quantity=${quantity}`);
};

export const recalculateHQStock = async (productId) => {
  return await axios.post(`/api/hq-stock/recalculate/${productId}`);
};

export const recalculateAllHQStocks = async () => {
  return await axios.post("/api/hq-stock/recalculate-all");
};

export const silentRecalculateAllHQStocks = async () => {
  return await axios.get("/api/hq-stock/recalculate-all-silent");
};

// 정기 입고 설정 업데이트
export const updateRegularInSettings = async (productId, regularInDay, regularInQuantity, regularInActive) => {
  return await axios.put(`/api/hq-stock/${productId}/regular-in`, {
    regularInDay,
    regularInQuantity,
    regularInActive
  });
};

// 정기 입고 테스트용 함수
export const testProcessRegularIn = async (day) => {
  return await axios.post(`/api/hq-stock/test/process-regular-in`, { day });
};