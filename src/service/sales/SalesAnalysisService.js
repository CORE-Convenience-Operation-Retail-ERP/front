import axios from 'axios';
import axiosInstance from '../axiosInstance';

const BASE_URL = '/api/sales/analysis';

class SalesAnalysisService {
    /**
     * 전체 통합 통계 데이터 조회
     * @param {Object} params - 조회 파라미터
     * @returns {Promise} API 응답
     */
    getOverview(params = {}) {
        return axiosInstance.get(`${BASE_URL}/overview`, { params });
    }
    
    /**
     * 지점별 매출 데이터 조회
     * @param {Object} params - 조회 파라미터
     * @returns {Promise} API 응답
     */
    getByStore(params = {}) {
        return axiosInstance.get(`${BASE_URL}/by-store`, { params });
    }
    
    /**
     * 날짜별 매출 데이터 조회
     * @param {Object} params - 조회 파라미터
     * @returns {Promise} API 응답
     */
    getByDate(params = {}) {
        return axiosInstance.get(`${BASE_URL}/by-date`, { params });
    }
    
    /**
     * 시간대별 매출 데이터 조회
     * @param {Object} params - 조회 파라미터
     * @returns {Promise} API 응답
     */
    getByTime(params = {}) {
        return axiosInstance.get(`${BASE_URL}/by-time`, { params });
    }
    
    /**
     * 인구통계별 매출 데이터 조회 (연령대, 성별)
     * @param {Object} params - 조회 파라미터
     * @returns {Promise} API 응답
     */
    getByDemographic(params = {}) {
        return axiosInstance.get(`${BASE_URL}/by-demographic`, { params });
    }
    
    /**
     * 카테고리별 매출 데이터 조회
     * @param {Object} params - 조회 파라미터
     * @returns {Promise} API 응답
     */
    getByCategory(params = {}) {
        return axiosInstance.get(`${BASE_URL}/by-category`, { params });
    }
    
    /**
     * 날씨별 매출 데이터 조회
     * 백엔드에서 기상청 API를 통해 실제 날씨 데이터를 사용하여 응답
     * @param {Object} params - 조회 파라미터
     * @returns {Promise} API 응답
     */
    getByWeather(params = {}) {
        return axiosInstance.get(`${BASE_URL}/by-weather`, { params });
    }
    
    /**
     * 날짜 범위 옵션에 따른 시작/종료 날짜 계산
     * @param {string} range - 날짜 범위 옵션 (today, week, month)
     * @returns {Object} 시작/종료 날짜
     */
    getDateRangeByOption(range) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endDate = new Date(now);
        
        let startDate;
        
        switch (range) {
            case 'today':
                startDate = today;
                break;
            case 'week':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 7);
                break;
            case 'month':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 30);
                break;
            default:
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 30);
        }
        
        return {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        };
    }
    
    /**
     * 날짜를 포맷팅하는 유틸리티 메서드
     * @param {Date} date - 포맷팅할 날짜
     * @returns {string} 포맷팅된 날짜 문자열 (YYYY-MM-DD)
     */
    formatDate(date) {
        if (!date) return '';
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }
}

export default new SalesAnalysisService();