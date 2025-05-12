import axios from '../axiosInstance';

/** ✅ 공통 에러 핸들링 */
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

/**  [1] 실사 재고 등록 (리팩토링) */
export const registerInventoryCheck = ({ storeId, partTimerId, reason, checks }) =>
    handleRequest(() =>
        axios.post('/api/store/inventory-check', {
            storeId,
            partTimerId,   // 공통 담당자 ID
            reason,        // 공통 사유
            checks         // 상품 목록 (productId, realQuantity 필수)
        })
    );

/**  [2] 실사 이력 조회 (페이징, 검색 포함) */
export const fetchInventoryCheckList = (params = {}) =>
    handleRequest(() =>
        axios.get('/api/store/inventory-check/history', { params })
    );

/**  [3] 실사 반영 처리 (미반영 → 반영) */
export const applyInventoryCheck = (checkId) =>
    handleRequest(() =>
        axios.patch(`/api/store/inventory-check/apply/${checkId}`)
    );