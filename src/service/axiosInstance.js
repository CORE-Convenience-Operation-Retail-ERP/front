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
    if (error.response && error.response.status === 401) {
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
    return Promise.reject(error);
  }
);

export default instance;