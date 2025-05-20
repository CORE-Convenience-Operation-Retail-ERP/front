import axios from "../axiosInstance";

//  KPI 통계 조회
export const fetchKpiStats = async (params) => {
    const res = await axios.get("/api/erp/statistics/kpis", { params });
    return res.data;
};

//  시간대별 매출 조회
export const fetchHourlySales = async (params) => {
    const res = await axios.get("/api/erp/statistics/sales/hourly", { params });
    return res.data;
};

//  상품별 매출 조회
export const fetchProductSales = async (params) => {
    const res = await axios.get("/api/erp/statistics/sales/products", { params });
    return res.data;
};

//  카테고리별 매출 조회
export const fetchCategorySales = async (params) => {
    const res = await axios.get("/api/erp/statistics/sales/categories", { params });
    return res.data;
};

//  상위 발주 상품 조회
export const fetchOrderTopProducts = async (params) => {
    const res = await axios.get("/api/erp/statistics/orders/products", { params });
    return res.data;
};
