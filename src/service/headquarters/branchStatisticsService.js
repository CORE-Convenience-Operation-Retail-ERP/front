import axios from "../axiosInstance";

export const fetchBranchSettlements = async (params) => {
    const response = await axios.get("/api/hq/settlements/list", {
      params
    });
    return response.data;
};