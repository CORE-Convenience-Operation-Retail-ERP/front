import axios from 'axios';
import { loadingManager } from '../components/common/LoadingManager';

const API_URL = process.env.REACT_APP_API_URL;

const instance = axios.create({
  baseURL: API_URL, // 환경변수에서 API 주소를 읽어옴
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