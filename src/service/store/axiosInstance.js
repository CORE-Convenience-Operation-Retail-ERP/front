import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 요청 인터셉터: JWT 토큰 자동 첨부
instance.interceptors.request.use(
    (config) => {
        if (config.url.includes('/auth/')) {
            return config;
        }

        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('🚀 요청 토큰:', token);
        return config;
    },
    (error) => Promise.reject(error)
);



// // 응답 인터셉터: 인증 오류 처리
// instance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             localStorage.removeItem('token');
//             window.location.href = '/login';
//         }
//         return Promise.reject(error);
//     }
// );

export default instance;
