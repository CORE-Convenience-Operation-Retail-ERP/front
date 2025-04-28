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
import HeadquartersLayout from '../layouts/HeadquartersLayout';
import ProductsAllPage from '../pages/headquarters/ProductsAllPage';
import ProductsDetailPage from '../pages/headquarters/ProductsDetailPage';
import EmployeesListPage from '../pages/headquarters/EmployeesListPage';
import EmployeeManagementPage from '../pages/headquarters/EmployeeManagementPage';
import MyPage from '../pages/headquarters/MyPage';
import BranchesListPage from '../pages/headquarters/BranchesListPage';
import BranchesManagementPage from '../pages/headquarters/BranchesManagementPage';
import BranchesSalesAnalysisPage from '../pages/headquarters/BranchesSalesAnalysisPage';
import BranchesStockMonitoringPage from '../pages/headquarters/BranchesStockMonitoringPage';
import BranchesStatisticsPage from '../pages/headquarters/BranchesStatisticsPage';
import BoardNoticePage from '../pages/headquarters/BoardNoticePage';
import BoardSuggestionsPage from '../pages/headquarters/BoardSuggestionsPage';
import BoardStoreInquiriesPage from '../pages/headquarters/BoardStoreInquiriesPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* 본사 관련 라우트 */}
      <Route path="/headquarters/*" element={<HeadquartersLayout />}>
        <Route path="products/all" element={<ProductsAllPage />} />
        <Route path="products/detail" element={<ProductsDetailPage />} />
        <Route path="hr/employees" element={<EmployeesListPage />} />
        <Route path="hr/employee-management" element={<EmployeeManagementPage />} />
        <Route path="hr/my-page" element={<MyPage />} />
        <Route path="branches/list" element={<BranchesListPage />} />
        <Route path="branches/management" element={<BranchesManagementPage />} />
        <Route path="branches/sales-analysis" element={<BranchesSalesAnalysisPage />} />
        <Route path="branches/stock-monitering" element={<BranchesStockMonitoringPage />} />
        <Route path="branches/statistics" element={<BranchesStatisticsPage />} />
        <Route path="board/notice" element={<BoardNoticePage />} />
        <Route path="board/suggestions" element={<BoardSuggestionsPage />} />
        <Route path="board/store-inquiries" element={<BoardStoreInquiriesPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
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