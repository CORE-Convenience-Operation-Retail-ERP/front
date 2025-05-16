import axios from "axios";

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      // 디버깅용 토큰 정보 로깅
      console.log('요청 URL:', config.url);
      console.log('요청 메서드:', config.method);
      console.log('인증 토큰 존재:', !!token);
      console.log('인증 토큰:', token);
      
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
        console.log('토큰 페이로드:', decoded);
        console.log('사용자 권한:', decoded.role || decoded.roles || decoded.authorities || '권한 정보 없음');
      } catch (e) {
        console.warn('토큰 디코딩 실패:', e);
      }
    } else {
      console.warn('인증 토큰이 없습니다!');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.log('응답 에러 상태:', error.response.status);
      console.log('응답 에러 데이터:', error.response.data);
      console.log('응답 에러 헤더:', error.response.headers);
      
      if (error.response.status === 403) {
        console.log('접근 권한이 없음 (403 Forbidden)');
        console.log('현재 사용자 정보:', localStorage.getItem('loginUser'));
        console.log('현재 역할:', localStorage.getItem('userRole'));
      }
      
      if (error.response.status === 401) {
        console.log('인증되지 않음 (401 Unauthorized)');
        localStorage.removeItem("token");
        localStorage.removeItem("loginUser");
        localStorage.removeItem("branchName");
        localStorage.removeItem("userRole");
        localStorage.removeItem("storeId");
        localStorage.removeItem("name");
        
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export const handleRequest = async (apiCall) => {
  try {
    return await apiCall();
  } catch (err) {
    const msg =
        typeof err.response?.data === 'string'
            ? err.response.data
            : err.response?.data?.message || err.message || '서버 오류 발생';
    return Promise.reject(msg);
  }
};


export default instance;