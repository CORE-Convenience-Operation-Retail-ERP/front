import React, { useEffect } from 'react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import AppRoutes from './routes';
import webSocketService from './service/WebSocketService';
import { NotificationProvider } from './contexts/NotificationContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

// 웹소켓 초기화를 위한 컴포넌트
const WebSocketInitializer = () => {
  useEffect(() => {
    // 앱 시작 시 웹소켓 서비스 초기화
    console.log('앱 시작 - 웹소켓 서비스 초기화');
    webSocketService.init();
  }, []);

  return null; // 화면에 아무것도 렌더링하지 않음
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <BrowserRouter>
          <WebSocketInitializer />
          <AppRoutes />
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;