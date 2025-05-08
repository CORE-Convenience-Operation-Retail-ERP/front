import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/headquarters/DashboardPage';
import StoreLayout from "../layouts/StoreLayout";
import HomePage from "../pages/store/HomePage";
import StockAdjusPage from "../pages/store/stock/StockAdjustPage";
import DisposalPage from "../pages/store/disposal/DisposalPage";
import OrderRegisterPage from "../pages/store/order/OrderRegisterPage";
import OrderListPage from "../pages/store/order/OrderListPage";
import PartTimerPage from "../pages/store/partTimer/PartTimerPage";
import PartTimerSchedulePage from "../pages/store/PartTimerSchedulePage";
import SalaryPage from "../pages/store/salary/SalaryPage";
import StatsOrderPage from "../pages/store/StatsOrderPage";
import StatsSalesPage from "../pages/store/StatsSalesPage";
import SalesPage from "../pages/store/SalesPage";
import HeadquartersLayout from '../layouts/HeadquartersLayout';
import ProductsAllPage from '../pages/headquarters/ProductsAllPage';
import ProductsDetailPage from '../pages/headquarters/ProductsDetailPage';
import ProductsEditPage from '../pages/headquarters/ProductsEditPage';
import EmployeesListPage from '../pages/headquarters/EmployeesListPage';
import ProductsRegisterPage from '../pages/headquarters/ProductsRegisterPage';
import EmployeeManagementPage from '../pages/headquarters/EmployeeManagementPage';
import MyPage from '../pages/headquarters/MyPage';
import AnnualLeavePage from '../pages/headquarters/AnnualLeavePage';
import BranchesListPage from '../pages/headquarters/BranchesListPage';
import BranchFormPage from '../pages/headquarters/BranchFormPage';
import BranchesManagementPage from '../pages/headquarters/BranchesManagementPage';
import BranchesSalesAnalysisPage from '../pages/headquarters/BranchesSalesAnalysisPage';
import BranchesStockMonitoringPage from '../pages/headquarters/BranchesStockMonitoringPage';
import BranchesStatisticsPage from '../pages/headquarters/BranchesStatisticsPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ParttimerRegisterPage from "../pages/store/partTimer/ParttimerRegisterPage";
import PartTimerOnePage from "../pages/store/partTimer/PartTimerOnePage";
import PartTimerUpdatePage from '../pages/store/partTimer/PartTimerUpdatePage';
import NoticePage from '../pages/headquarters/board/NoticePage';
import SuggestionsPage from '../pages/headquarters/board/SuggestionsPage';
import StoreInquiriesPage from '../pages/headquarters/board/StoreInquiriesPage';
import SalaryBreakdownPage from '../pages/store/salary/SalaryBreakdownPage';
import StockListPage from '../pages/store/stock/StockListPage';
import StockInHistoryPage from '../pages/store/stock/StockInHistoryPage';
import AdjustLogPage from '../pages/store/stock/AdjustLogPage';
import OrderHistoryPage from '../pages/store/order/OrderHistoryPage';
import MySalaryPage from '../pages/headquarters/MySalaryPage';
import OrederUpdatePage from '../pages/store/order/OrderUpdatePage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* 본사 관련 라우트 */}
      <Route path="/headquarters/*" element={<HeadquartersLayout />}>
        <Route path="products/all" element={<ProductsAllPage />} />
        <Route path="hr/employees" element={<EmployeesListPage />} />
        <Route path="hr/employee-management" element={<EmployeeManagementPage />} />
        <Route path="hr/employee-management/:empId" element={<EmployeeManagementPage />} />
        <Route path="hr/my-page" element={<MyPage />} />
        <Route path="hr/my-salary" element={<MySalaryPage />} />
        <Route path="hr/annual-leave" element={<AnnualLeavePage />} />
        <Route path="branches/list" element={<BranchesListPage />} />
        <Route path="branches/add" element={<BranchFormPage />} />
        <Route path="branches/edit/:storeId" element={<BranchFormPage />} />
        <Route path="branches/management" element={<BranchesManagementPage />} />
        <Route path="branches/sales-analysis" element={<BranchesSalesAnalysisPage />} />
        <Route path="branches/stock-monitering" element={<BranchesStockMonitoringPage />} />
        <Route path="branches/statistics" element={<BranchesStatisticsPage />} />
        <Route path="board/notice" element={<NoticePage />} />
        <Route path="board/suggestions" element={<SuggestionsPage />} />
        <Route path="board/store-inquiries" element={<StoreInquiriesPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products/detail/:id" element={<ProductsDetailPage />} />
        <Route path="products/edit/:id" element={<ProductsEditPage />} />
        <Route path="products/register" element={<ProductsRegisterPage />} />
      </Route>

      {/* 지점 관련 라우트*/}
      <Route path="/store" element={<StoreLayout/>} >
        <Route path="home" element={<HomePage/>} />
        <Route path="stock/list" element={<StockListPage/>} />              
        <Route path="stock/in-history" element={<StockInHistoryPage/>} />  
        <Route path="stock/manual-adjust" element={<StockAdjusPage/>} />  
        <Route path="stock/adjust-log" element={<AdjustLogPage/>} />       
        <Route path="inventory/disposal" element={<DisposalPage/>} />
        <Route path="order/register" element={<OrderRegisterPage/>} />
        <Route path="order/list" element={<OrderListPage/>} />
        <Route path="order/detail/:id" element={<OrderHistoryPage/>} />
        <Route path="order/update/:id" element={<OrederUpdatePage/>} />
        <Route path="parttimer/list" element={<PartTimerPage/>} />
        <Route path="parttimer/register" element={<ParttimerRegisterPage/>} />
        <Route path="parttimer/:id" element={<PartTimerOnePage/>} />
        <Route path="/store/parttimer/:id/edit" element={<PartTimerUpdatePage/>} />
        <Route path="hr/salary" element={<SalaryPage/>} />
        <Route path="hr/schedule" element={<PartTimerSchedulePage/>} />
        <Route path="hr/salary/:id/detail" element={<SalaryBreakdownPage/>} />
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