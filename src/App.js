import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import HomePage from './pages/store/HomePage';
import DashboardPage from './pages/headquarters/DashboardPage';
import LoginPage from './pages/auth/LoginPage';


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
           {/* 기본 경로는 로그인 페이지로 리다이렉트 */}
           <Route path="/" element={<Navigate to="/auth/login" />} />

          {/* 로그인 페이지 */}
          <Route path="/auth/login" element={<LoginPage />} />
           
          {/* 점주 로그인 성공 시 */}
          <Route path="/store/home" element={<HomePage />} />

          {/* 본사 로그인 성공 시 */}
          <Route path="/headquarters/dashboard" element={<DashboardPage />} />

          {/* 추가 라우트는 여기 필요할 때 또 등록 */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
