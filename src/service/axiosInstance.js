import axios from "axios";
import { loadingManager } from '../components/common/LoadingManager';

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

instance.interceptors.request.use(
  (config) => {
    loadingManager.show();
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      // 디버깅용 토큰 정보 로깅
      // console.log('요청 URL:', config.url);
      // console.log('요청 메서드:', config.method);
      // console.log('인증 토큰 존재:', !!token);
      
      try {
        // JWT 디코딩
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const decoded = JSON.parse(jsonPayload);
        // console.log('토큰 페이로드:', decoded);
        // console.log('사용자 권한:', decoded.role || decoded.roles || decoded.authorities || '권한 정보 없음');
      } catch (e) {
        // console.warn('토큰 디코딩 실패:', e);
      }
    } else {
      // console.warn('인증 토큰이 없습니다!');
    }
    return config;
  },
  (error) => {
    loadingManager.hide();
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    loadingManager.hide();
    return response;
  },
  (error) => {
    loadingManager.hide();
    if (error.response) {
      // console.log('응답 에러 상태:', error.response.status);
      // console.log('응답 에러 데이터:', error.response.data);
      
      if (error.response.status === 403) {
        // console.log('접근 권한이 없음 (403 Forbidden)');
        // console.log('현재 사용자 정보:', localStorage.getItem('loginUser'));
        // console.log('현재 역할:', localStorage.getItem('userRole'));
        
        // 403 에러 페이지로 리다이렉션
        if (window.location.pathname !== "/error/403") {
          window.location.href = "/error/403";
        }
      }
      
      if (error.response.status === 401) {
        console.log('인증되지 않음 (401 Unauthorized)');
        // 인증 관련 데이터 초기화
        localStorage.removeItem("token");
        localStorage.removeItem("loginUser");
        localStorage.removeItem("branchName");
        localStorage.removeItem("userRole");
        localStorage.removeItem("storeId");
        localStorage.removeItem("name");
        
        // 로그인 페이지로 리디렉션 비활성화
        /* 401 에러 리다이렉트 비활성화
        if (window.location.pathname !== "/login") {
          window.location.href = "/login?error=session_expired";
        }
        */
      }
      
      if (error.response.status === 404) {
        // 404 에러 페이지로 리다이렉션
        if (window.location.pathname !== "/error/404") {
          window.location.href = "/error/404";
        }
      }
      
      if (error.response.status === 500) {
        console.log('서버 에러 (500 Internal Server Error)');
        // 500 에러 페이지로 리다이렉션 비활성화
        /* 500 에러 리다이렉트 비활성화
        if (window.location.pathname !== "/error/500") {
          window.location.href = "/error/500";
        }
        */
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답이 없는 경우 (네트워크 에러)
      console.log('네트워크 오류:', error.request);
      
      // 네트워크 상태에 따라 다른 에러 메시지 제공
      if (!navigator.onLine) {
        // 오프라인인 경우
        // console.log('인터넷 연결이 없습니다');
        error.customMessage = '인터넷 연결이 끊어졌습니다. 연결 상태를 확인해주세요.';
      } else {
        // 서버에 연결할 수 없는 경우
        // console.log('서버에 연결할 수 없습니다');
        error.customMessage = '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';
      }
      
      // 네트워크 오류 페이지로 리다이렉션
      if (window.location.pathname !== "/error/network") {
        window.location.href = "/error/network";
      }
    } else {
      // 요청을 보내기 전에 발생한 오류
      // console.log('요청 설정 중 오류 발생:', error.message);
      error.customMessage = '요청을 처리할 수 없습니다.';
      
      // 일반 오류 페이지로 리다이렉션
      if (window.location.pathname !== "/error") {
        window.location.href = "/error";
      }
    }
    
    return Promise.reject(error);
  }
);

export const handleRequest = async (apiCall) => {
  try {
    return await apiCall();
  } catch (err) {
    // 사용자 친화적인 오류 메시지 생성
    let errorMessage;
    
    if (err.customMessage) {
      // 인터셉터에서 설정한 커스텀 메시지가 있는 경우
      errorMessage = err.customMessage;
    } else if (err.response?.data?.message) {
      // 서버에서 제공한 오류 메시지가 있는 경우
      errorMessage = err.response.data.message;
    } else if (typeof err.response?.data === 'string') {
      // 응답이 문자열인 경우
      errorMessage = err.response.data;
    } else {
      // 기타 오류
      errorMessage = err.message || '서버 오류가 발생했습니다';
    }
    
    // 추가 로깅 및 오류 정보 수집
    console.error('API 호출 실패:', {
      error: err,
      url: err.config?.url,
      method: err.config?.method,
      message: errorMessage
    });
    
    return Promise.reject(errorMessage);
  }
};

export default instance;