import axios from '../axiosInstance';

// ✅ [1] 발주 등록 (복수 상품 등록)
export const registerOrder = async ({ storeId, items }) => {
  // items: [{ productId: 1, quantity: 5 }, { productId: 2, quantity: 10 }]
  return await axios.post('/api/order', {
    storeId,
    items
  });
};

// ✅ [2] 발주 목록 조회 (매장 기준)
export const fetchOrderList = async (params = {}) => {
  // params: { status: '', startDate: '', endDate: '', page: 0, size: 10 }
  return await axios.get('/api/order/history', { params });
};

// ✅ [3] 발주 상세 조회
export const fetchOrderDetail = async (orderId) => {
  return await axios.get(`/api/order/history/${orderId}`);
};

// ✅ [4] 발주 삭제 (해당 발주 전체 삭제)
export const deleteOrder = async (orderId) => {
  return await axios.delete(`/api/order/${orderId}`);
};

// ✅ [5] 발주 상태 변경 (예: 승인/반려 처리)
export const updateOrderStatus = async (orderId, status) => {
  return await axios.patch(`/api/order/${orderId}/status`, { status });
};

// ✅ [6] 발주용 상품+재고 조회 (현재 매장 기준)
export const fetchOrderProductList = async ({ page = 0, size = 10 }) => {
  try {
    const res = await axios.get('/api/order/products', {
      params: { page, size }
    });
    return res;
  } catch (error) {
    throw error;
  }
};

// ✅ [7] 부분 입고 처리
export const completePartialItems = async (orderId, partialItems) => {
  return await axios.post(`/api/order/${orderId}/partial-complete`, partialItems);
};

// ✅ [8] 전체 입고 처리
export const completeOrder = (orderId) => {
  return axios.post(`/api/order/${orderId}/complete`);
};