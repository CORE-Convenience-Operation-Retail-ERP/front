import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/headquarters/DashboardPage';

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

      {/* 기본 리다이렉트 */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes; 