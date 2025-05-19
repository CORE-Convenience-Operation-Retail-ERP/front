import axios from 'axios';
import { loadingManager } from '../components/common/LoadingManager';

const instance = axios.create({
  // baseURL: 'http://localhost:8080', // 필요시 설정
});

instance.interceptors.request.use(
  config => {
    loadingManager.show();
    return config;
  },
  error => {
    loadingManager.hide();
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => {
    loadingManager.hide();
    return response;
  },
  error => {
    loadingManager.hide();
    return Promise.reject(error);
  }
);

export default instance; 