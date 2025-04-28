import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/headquarters/DashboardPage';
import StoreLayout from "../layouts/StoreLayout";
import HomePage from "../pages/store/HomePage";
import InventoryPage from "../pages/store/InventoryPage";
import DisposalPage from "../pages/store/DisposalPage";
import OrderRegisterPage from "../pages/store/OrderRegisterPage";
import OrderListPage from "../pages/store/OrderListPage";
import PartTimerPage from "../pages/store/PartTimerPage";
import PartTimerSchedulePage from "../pages/store/PartTimerSchedulePage";
import SalaryPage from "../pages/store/SalaryPage";
import StatsOrderPage from "../pages/store/StatsOrderPage";
import StatsSalesPage from "../pages/store/StatsSalesPage";
import SalesPage from "../pages/store/SalesPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* 본사 관련 라우트 */}
      <Route path="/headquarters" element={<MainLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="employees" element={<div>직원 관리 페이지</div>} />
        <Route path="sales" element={<div>매출 관리 페이지</div>} />
        <Route path="settings" element={<div>설정 페이지</div>} />
      </Route>

        {/* 지점 관련 라우트*/}
      <Route path="/store" element={<StoreLayout/>} >
        <Route path="home" element={<HomePage/>} />
        <Route path="inventory/current" element={<InventoryPage/>} />
        <Route path="inventory/disposal" element={<DisposalPage/>} />
        <Route path="order/register" element={<OrderRegisterPage/>} />
        <Route path="order/list" element={<OrderListPage/>} />
        <Route path="hr/employee" element={<PartTimerPage/>} />
        <Route path="hr/schedule" element={<PartTimerSchedulePage/>} />
        <Route path="hr/salary" element={<SalaryPage/>} />
        <Route path="sales" element={<SalesPage/>} />
        <Route path="stats/order" element={<StatsOrderPage/>} />
        <Route path="stats/sales" element={<StatsSalesPage/>} />
      </Route>


        {/* 기본 리다이렉트 */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes; 