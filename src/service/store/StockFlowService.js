import axios from "../axiosInstance";

// 1. 재고 흐름 전체 조회 (페이징 포함)
export const fetchStockFlowLogs = async ({ productId, page = 0, size = 10 }) => {
  const response = await axios.get(`/api/stock-flow/${productId}`, {
    params: { page, size },
  });
  return response.data;
};

// 2. 재고 흐름 필터 조회 (선택적 기능 - flowType 기준)
export const fetchStockFlowLogsByType = async ({ productId, flowType, page = 0, size = 10 }) => {
  const response = await axios.get(`/api/stock-flow/${productId}`, {
    params: { flowType, page, size },
  });
  return response.data;
};

// 3. 입출고 기록 조회

export const searchStockFlows = async (searchCondition) => {
  const response = await axios.post("/api/stock-flow/search", searchCondition);
  return response.data;
};

// 4. 상품 상세 조회
export const fetchProductDetail = async (productId) => {
  const response = await axios.get(`/api/products/detail/${productId}`);
  return response.data;
};
