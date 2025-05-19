import axios from "axios";

// ERP 백엔드 정산 이력 조회 API 호출
export const fetchSettlementList = async (params) => {
    const token = localStorage.getItem("token");
  
    const response = await axios.get("/api/erp/settlement/list", {
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("정산 응답:", response.data);
  
    return response.data;
  };
