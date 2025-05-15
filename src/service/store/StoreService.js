import axios from "../axiosInstance";

/**
 * 매장 목록 조회 (드롭다운용)
 * GET /api/stores
 */
export const fetchStoreList = async () => {
    const res = await axios.get("/api/stores");
    return res;
};
