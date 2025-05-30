import axios from '../axiosInstance';

/**  공통 에러 핸들링 */
const handleRequest = async (apiCall) => {
  try {
    return await apiCall();
  } catch (err) {
    const msg = typeof err.response?.data === 'string'
        ? err.response.data
        : err.response?.data?.message || err.message || "서버 오류 발생";
    return Promise.reject(msg);
  }
};


/**  [1] 발주 등록 */
export const registerOrder = ({ storeId, items }) =>
    handleRequest(() =>
        axios.post('/api/order', { storeId, items })
    );

/**  [2] 발주 목록 조회 (매장 기준) */
export const fetchOrderList = (params = {}) =>
    handleRequest(() =>
        axios.get('/api/order/history', { params })
    );

/**  [3] 발주 상세 조회 */
export const fetchOrderDetail = (orderId) =>
    handleRequest(() =>
        axios.get(`/api/order/history/${orderId}`)
    );

/**  [4] 발주 취소 */
export const deleteOrder = (orderId) =>
    handleRequest(() =>
        axios.patch(`/api/order/cancel/${orderId}`)
    );

/**  [5] 발주 상태 변경 */
export const updateOrderStatus = (orderId, status) =>
    handleRequest(() =>
        axios.patch(`/api/order/${orderId}/status`, { status })
    );

/**  [6] 발주용 상품 + 재고 조회 */
export const fetchOrderProductList = (params = {}) =>
    handleRequest(() =>
        axios.get('/api/order/products', { params })
    );


/**  [7] 부분 입고 처리 */
export const completePartialItems = (orderId, partTimerId, itemList) =>
    handleRequest(() =>
        axios.post(`/api/order/${orderId}/partial-complete`, itemList, {
          params: { partTimerId }
        })
    );

/**  [8] 전체 입고 처리 */
export const completeOrder = (orderId, partTimerId) =>
    handleRequest(() =>
        axios.post(`/api/order/${orderId}/complete`, null, {
          params: { partTimerId }
        })
    );

/**  [9] 발주 수정 */
export const updateOrder = (orderId, items) =>
    handleRequest(() =>
        axios.put(`/api/order/update/${orderId}`, { items })
    );

/**  [10] 발주 실제 삭제 (매장 전용, 상태 = 대기중만 가능) */
export const removeOrder = (orderId) =>
    handleRequest(() =>
        axios.delete(`/api/order/${orderId}`)
    );

/**  [11] 매장 목록 조회 (드롭다운용) */
export const fetchStoreList = () =>
    handleRequest(async () => {
        const res = await axios.get('/api/stores');
        return res.data || [];
    });

/** [13] 본사 재고 조회 */

export async function fetchAllHQStocks() {
  const res = await axios.get("/api/hq-stock");
  return res.data;
}

