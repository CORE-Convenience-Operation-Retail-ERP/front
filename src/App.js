import React, { useEffect, Suspense } from 'react';
import { BrowserRouter, useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import AppRoutes from './routes';
import webSocketService from './service/WebSocketService';
import { NotificationProvider } from './contexts/NotificationContext';
import { ErrorProvider } from './contexts/ErrorContext.tsx';
import LoadingLottie from './components/common/LoadingLottie.tsx';
import ScrollToTop from './components/common/ScrollToTop';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

// 웹소켓 초기화를 위한 컴포넌트 (Suspense 밖에서 실행)
const WebSocketInitializer = () => {
  useEffect(() => {
    // deptId를 localStorage에서 가져옴(로그인 시 저장되어 있다고 가정)
    const deptId = parseInt(localStorage.getItem('deptId'), 10);
    const token = localStorage.getItem('token');
    
    // 점주(3번 부서)와 본사 직원(4~10번 부서) 모두 웹소켓 서비스 초기화
    if (token && deptId >= 3 && deptId <= 10) {
      console.log('앱 시작 - 웹소켓 서비스 초기화');
      
      // 즉시 초기화 시도
      webSocketService.init();
      
      // 추가적으로 약간의 지연 후 연결 상태 확인
      setTimeout(() => {
        if (!webSocketService.isConnected()) {
          console.log('웹소켓 연결 상태 재확인 및 재시도');
          webSocketService.forceReconnect();
        }
      }, 2000);
      
    } else {
      console.log('웹소켓 서비스 미초기화: deptId', deptId, 'token', !!token);
    }
    
    // 토큰 변경 감지를 위한 주기적 체크
    const tokenCheckInterval = setInterval(() => {
      const currentToken = localStorage.getItem('token');
      const currentDeptId = parseInt(localStorage.getItem('deptId'), 10);
      
      if (currentToken && currentDeptId >= 3 && currentDeptId <= 10) {
        if (!webSocketService.isConnected()) {
          console.log('토큰 체크 - 웹소켓 재연결 시도');
          webSocketService.autoConnect();
        }
      } else if (!currentToken && webSocketService.isConnected()) {
        console.log('토큰 없음 - 웹소켓 연결 해제');
        webSocketService.disconnect();
      }
    }, 30000); // 30초마다 체크
    
    // 페이지 언로드 시 웹소켓 연결 해제
    const handleBeforeUnload = () => {
      webSocketService.disconnect();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      clearInterval(tokenCheckInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
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
    
    // 페이지 변경 시 웹소켓 연결 상태 확인
    const token = localStorage.getItem('token');
    const deptId = parseInt(localStorage.getItem('deptId'), 10);
    
    if (token && deptId >= 3 && deptId <= 10 && !webSocketService.isConnected()) {
      console.log('페이지 변경 감지 - 웹소켓 연결 상태 확인');
      setTimeout(() => {
        webSocketService.autoConnect();
      }, 500);
    }
    
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
            <ScrollToTop />
            {/* 웹소켓 초기화를 Suspense 밖으로 이동 */}
            <WebSocketInitializer />
            <RouteChangeHandler />
            <Suspense fallback={<LoadingLottie />}>
              <AppRoutes />
            </Suspense>
          </BrowserRouter>
        </NotificationProvider>
      </ErrorProvider>
    </ThemeProvider>
  );
}

export default App;