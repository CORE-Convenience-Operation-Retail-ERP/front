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
import PartTimerSchedulePage from "../pages/store/partTimer/PartTimerSchedulePage";
import SalaryPage from "../pages/store/salary/SalaryPage";
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
import OrderHistoryPage from '../pages/store/order/OrderHistoryPage';
import MySalaryPage from '../pages/headquarters/MySalaryPage';
import TransactionPage from '../pages/store/TransactionPage';
import SalesAnalysis from '../pages/headquarters/branches/SalesAnalysis';
import CustomerInquiryPage from '../pages/customer/CustomerInquiryPage';
import InventoryHistoryPage from "../pages/store/inventory/InventoryHistoryPage";
import InventoryRegisterPage from "../pages/store/inventory/InventoryRegisterPage";
import IntegratedStockMonitoringPage from '../pages/headquarters/IntegratedStockMonitoringPage';
import StockDetailPage from "../pages/store/stock/StockDetailPage";
import StockFlowLogPage from '../pages/store/stock/StockFlowLogPage';
import SettlementListPage from '../pages/store/SettlementListPage';
import ChatRoomList from '../components/chat/ChatRoomList';
import ChatRoom from '../components/chat/ChatRoom';
import { LoadingProvider, useLoading } from '../components/common/LoadingContext.tsx';
import LoadingLottie from '../components/common/LoadingLottie.tsx';
import StatisticsPage from "../pages/store/Statistic/StatisticsPage";
import AttendancePage from "../pages/store/attendance/AttendancePage";
import ErrorPage from '../components/common/ErrorPage';
import ForbiddenErrorPage from '../components/common/ForbiddenErrorPage';
import NotFoundErrorPage from '../components/common/NotFoundErrorPage';
import NetworkErrorPage from '../components/common/NetworkErrorPage';
import ServerErrorPage from '../components/common/ServerErrorPage';
import ProductSalesDetailPage from '../pages/store/Statistic/ProductSalesDetailPage.js';
import CategorySalesDetailPage from '../pages/store/Statistic/CategorySalesDetailPage.js';
import HourlySalesDetailPage from '../pages/store/Statistic/HourlySalesDetailPage.js';
import OrderTopProductsDetailPage from '../pages/store/Statistic/OrderTopProductsDetailPage.js';
import StrockInHistoryPage from '../pages/store/order/StockInHistoryPage.js';
import DeviceAuthPage from "../components/store/partTimer/DeviceAuthPage";
import QRCheckPage from '../containers/store/partTimer/attendance/QRCheckPage.js';


const AppRoutes = () => {
  const { isLoading } = useLoading();
  return (
    <>
      {isLoading && <LoadingLottie />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* 에러 페이지 라우트 */}
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/error/403" element={<ForbiddenErrorPage />} />
        <Route path="/error/network" element={<NetworkErrorPage />} />
        <Route path="/error/404" element={<NotFoundErrorPage />} />
        <Route path="/error/500" element={<ServerErrorPage />} />
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
        <Route path="/store/qr/check-in" element={<QRCheckPage mode="check-in" />} />
        <Route path="/store/qr/check-out" element={<QRCheckPage mode="check-out" />} />
        <Route path="/store/device-auth" element={<DeviceAuthPage />} />


        <Route path="/store" element={<StoreLayout/>} >
          <Route path="home" element={<HomePage/>} />
          <Route path="stock/list" element={<StockListPage/>} />
          <Route path="stock/in-history" element={<StrockInHistoryPage />} />
          <Route path="stock/flow/search" element={<StockFlowLogPage/>} />
          <Route path="inventory/check/history" element={<InventoryHistoryPage/>} />
          <Route path="inventory/check/register" element={<InventoryRegisterPage/>} />
          <Route path="stock/detail/:productId" element={<StockDetailPage/>} />
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
          <Route path="statistics" element={<StatisticsPage/>} />
          <Route path="sales/transactions" element={<TransactionPage />} />
          <Route path="sales/summary" element={<SettlementListPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="stats/time" element={<HourlySalesDetailPage />} />
          <Route path="stats/product" element={<ProductSalesDetailPage />} />
          <Route path="stats/category" element={<CategorySalesDetailPage />} />
          <Route path="stats/order" element={<OrderTopProductsDetailPage />} />
        </Route>
        {/* 고객 관련 라우트 */}
        <Route path="/customer" element={<CustomerInquiryPage />} /> 
        {/* 채팅 관련 라우트 추가 (다른 라우트와 함께 설정) */}
        <Route path="/chat" element={<ChatRoomList />} />
        <Route path="/chat/room/:roomId" element={<ChatRoom />} />
        {/* 기본 리다이렉트 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* 404 페이지 처리를 위한 와일드카드 라우트 */}
        <Route path="*" element={<NotFoundErrorPage />} />
      </Routes>
    </>
  );
};

const WrappedRoutes = () => (
  <LoadingProvider>
    <AppRoutes />
  </LoadingProvider>
);

export default WrappedRoutes;