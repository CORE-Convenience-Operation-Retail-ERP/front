import React, { useEffect, Suspense } from 'react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import AppRoutes from './routes';
import webSocketService from './service/WebSocketService';
import { NotificationProvider } from './contexts/NotificationContext';
import { ErrorProvider } from './contexts/ErrorContext.tsx';
import LoadingLottie from './components/common/LoadingLottie.tsx';

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

// 라우팅 이벤트를 위한 컴포넌트
const RouteChangeHandler = () => {
  const location = useLocation();
  
  useEffect(() => {
    // 페이지 변경 시 오류 로그를 기록
    console.log('페이지 변경:', {
      path: location.pathname,
      search: location.search,
      hash: location.hash
    });
    
    // 페이지 방문 로그를 남기는 코드를 여기에 추가할 수 있음
  }, [location]);
  
  return null;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingLottie />}>
              <WebSocketInitializer />
              <RouteChangeHandler />
              <AppRoutes />
            </Suspense>
          </BrowserRouter>
        </NotificationProvider>
      </ErrorProvider>
    </ThemeProvider>
  );
}

export default App;