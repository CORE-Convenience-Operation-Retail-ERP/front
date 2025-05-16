import axios from "../axiosInstance";

/**
 * 공통 요청 핸들러
 * - 에러 응답을 추출해 사용자에게 알림으로 전달
 */
const handleRequest = async (apiCall) => {
  try {
    return await apiCall();
  } catch (err) {
    const msg =
        typeof err.response?.data === "string"
            ? err.response.data
            : err.response?.data?.message || err.message || "서버 오류 발생";
    return Promise.reject(msg);
  }
};

/**
 * 1. 재고 현황 조회
 * @param {Object} filters
 * @returns {Promise<AxiosResponse>}
 */
export const fetchStoreStockList = async ({
                                            categoryId,
                                            productName,
                                            barcode,
                                            page = 0,
                                            size = 10,
                                          }) => {
  return await handleRequest(() =>
      axios.get("/api/stock/summary", {
        params: {
          categoryId,
          productName,
          barcode,
          page,
          size,
        },
      })
  );
};

/**
 * 2. 재고 이동 요청
 * @param {Object} transferData
 * @returns {Promise<AxiosResponse>}
 */
export const requestStockTransfer = async (transferData) => {
  return await handleRequest(() =>
      axios.post("/api/stock/transfer", transferData)
  );
};
