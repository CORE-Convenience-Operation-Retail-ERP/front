import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/headquarters/DashboardPage';
import StoreLayout from "../layouts/StoreLayout";
import HomePage from "../pages/store/HomePage";
import DisposalPage from "../pages/store/disposal/DisposalPage";
import OrderFormPage from "../pages/store/order/OrderFormPage";
import OrderListPage from "../pages/store/order/OrderListPage";
import PartTimerPage from "../pages/store/partTimer/PartTimerPage";
import PartTimerSchedulePage from "../pages/store/PartTimerSchedulePage";
import SalaryPage from "../pages/store/salary/SalaryPage";
import StatsOrderPage from "../pages/store/StatsOrderPage";
import StatsSalesPage from "../pages/store/StatsSalesPage";
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
import BranchesStockMonitoringPage from '../pages/headquarters/BranchesStockMonitoringPage';
import BranchesStatisticsPage from '../pages/headquarters/BranchesStatisticsPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ParttimerRegisterPage from "../pages/store/partTimer/ParttimerRegisterPage";
import PartTimerOnePage from "../pages/store/partTimer/PartTimerOnePage";
import PartTimerUpdatePage from '../pages/store/partTimer/PartTimerUpdatePage';
import NoticePage from '../pages/headquarters/board/NoticePage';
import SuggestionsPage from '../pages/headquarters/board/SuggestionsPage';
import StoreInquiryPage from '../pages/headquarters/StoreInquiryPage';
import StoreInquiriesPage from '../pages/headquarters/board/StoreInquiriesPage';
import SalaryBreakdownPage from '../pages/store/salary/SalaryBreakdownPage';
import StockListPage from '../pages/store/stock/StockListPage';
import StockInHistoryPage from '../pages/store/stock/StockInHistoryPage';
import AdjustLogPage from '../pages/store/stock/AdjustLogPage';
import OrderHistoryPage from '../pages/store/order/OrderHistoryPage';
import MySalaryPage from '../pages/headquarters/MySalaryPage';
import TransactionPage from '../pages/store/TransactionPage';
import SalesAnalysis from '../pages/headquarters/branches/SalesAnalysis';
// 고객용 문의 페이지 import
import CustomerInquiryPage from '../pages/customer/CustomerInquiryPage';
import InventoryHistoryPage from "../pages/store/inventory/InventoryHistoryPage";
import InventoryRegisterPage from "../pages/store/inventory/InventoryRegisterPage";
// 통합 재고 모니터링 페이지 import
import IntegratedStockMonitoringPage from '../pages/headquarters/IntegratedStockMonitoringPage';
import StockDetailPage from "../pages/store/stock/StockDetailPage";
import StockFlowLogPage from '../pages/store/stock/StockFlowLogPage';
import SettlementListPage from '../pages/store/SettlementListPage';
// 채팅 페이지 라우트 추가
import ChatRoomList from '../components/chat/ChatRoomList';
import ChatRoom from '../components/chat/ChatRoom';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* 본사 관련 라우트 */}
      <Route path="/headquarters/*" element={<HeadquartersLayout />}>
        <Route path="products/all" element={<ProductsAllPage />} />
        <Route path="products/integrated-stock" element={<IntegratedStockMonitoringPage />} />
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
        <Route path="branches/sales-analysis" element={<SalesAnalysis />} />
        <Route path="branches/stock-monitering" element={<BranchesStockMonitoringPage />} />
        <Route path="branches/statistics" element={<BranchesStatisticsPage />} />
        <Route path="board/notice" element={<NoticePage />} />
        <Route path="board/suggestions" element={<SuggestionsPage />} />
        <Route path="board/store-inquiries" element={<StoreInquiriesPage />} />
        <Route path="branches/inquiry" element={<StoreInquiryPage />} />
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
        <Route path="stock/flow/search" element={<StockFlowLogPage/>} />
        <Route path="inventory/check/history" element={<InventoryHistoryPage/>} />
        <Route path="inventory/check/register" element={<InventoryRegisterPage/>} />
        <Route path="stock/detail/:productId" element={<StockDetailPage/>} />
        <Route path="stock/adjust-log" element={<AdjustLogPage/>} />       
        <Route path="inventory/disposal" element={<DisposalPage/>} />
        <Route path="order/register" element={<OrderFormPage/>} />
        <Route path="order/list" element={<OrderListPage/>} />
        <Route path="order/detail/:id" element={<OrderHistoryPage/>} />
        <Route path="order/update/:id" element={<OrderFormPage/>} />
        <Route path="parttimer/list" element={<PartTimerPage/>} />
        <Route path="parttimer/register" element={<ParttimerRegisterPage/>} />
        <Route path="parttimer/:id" element={<PartTimerOnePage/>} />
        <Route path="/store/parttimer/:id/edit" element={<PartTimerUpdatePage/>} />
        <Route path="hr/salary" element={<SalaryPage/>} />
        <Route path="hr/schedule" element={<PartTimerSchedulePage/>} />
        <Route path="hr/salary/:id/detail" element={<SalaryBreakdownPage/>} />
        <Route path="stats/order" element={<StatsOrderPage/>} />
        <Route path="stats/sales" element={<StatsSalesPage/>} />
        <Route path="sales/transactions" element={<TransactionPage />} />
        <Route path="sales/summary" element={<SettlementListPage />} />
      </Route>

      {/* 고객 관련 라우트 */}
      <Route path="/customer" element={<CustomerInquiryPage />} />

      {/* 채팅 관련 라우트 추가 (다른 라우트와 함께 설정) */}
      <Route path="/chat" element={<ChatRoomList />} />
      <Route path="/chat/room/:roomId" element={<ChatRoom />} />

      {/* 기본 리다이렉트 */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes; 