import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const formDataAxios = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

// 요청 인터셉터 (JWT 자동 첨부)
formDataAxios.interceptors.request.use(
    (config) => {
        if (config.url.includes('/auth/')) return config;

        const token = localStorage.getItem('token');
        console.log('📦 formDataAxios 토큰:', token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터 (401 처리)
formDataAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default formDataAxios;
