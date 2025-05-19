import axios from "../axiosInstance";

export const fetchKpiStats = async (params) =>
    await axios.get("/api/erp/statistics/kpis", { params });

export const fetchHourlySales = async (params) =>
    await axios.get("/api/erp/statistics/sales/hourly", { params });

export const fetchProductSales = async (params) =>
    await axios.get("/api/erp/statistics/sales/products", { params });

export const fetchCategorySales = async (params) =>
    await axios.get("/api/erp/statistics/sales/categories", { params });

export const fetchOrderTopProducts = async (params) =>
    await axios.get("/api/erp/statistics/orders/products", { params });
