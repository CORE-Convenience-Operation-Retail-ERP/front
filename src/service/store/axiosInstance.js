import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 요청 인터셉터 추가
instance.interceptors.request.use(
    (config) => {
        // 로그인 관련 요청은 토큰이 필요없음
        if (config.url.includes('/auth/')) {
            return config;
        }

        // localStorage에서 사용자 정보 가져오기
        const user = localStorage.getItem('loginUser');
        if (user) {
            // const token = JSON.parse(user).token; // 토큰이 있는 경우
            // config.headers.Authorization = `Bearer ${token}`;

            // 세션 쿠키를 사용하는 경우는 withCredentials: true만으로 충분
            return config;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 추가
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // 인증 에러 발생 시 로그인 페이지로 리다이렉트
            localStorage.removeItem('loginUser');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance;