import axiosInstance from '../axiosInstance';

/**
 * 대시보드 데이터 서비스
 * - 점포 통계, 당일/당월 매출 데이터 조회
 */
class DashboardService {
    /**
     * 점포 통계 조회 (전체 점포수, 신규 점포수)
     * @returns {Promise} API 응답
     */
    getStoreStatistics() {
        return axiosInstance.get('/api/dashboard/store-statistics');
    }
    
    /**
     * 당일 매출 현황 조회 (전체 점포 기준)
     * @returns {Promise} API 응답
     */
    getDailySales() {
        return axiosInstance.get('/api/dashboard/daily-sales');
    }
    
    /**
     * 당월 매출 현황 조회 (전체 점포 기준)
     * @returns {Promise} API 응답
     */
    getMonthlySales() {
        return axiosInstance.get('/api/dashboard/monthly-sales');
    }
    
    /**
     * 대시보드 요약 정보 조회 (모든 정보 한번에)
     * @returns {Promise} API 응답
     */
    getDashboardSummary() {
        return axiosInstance.get('/api/dashboard/summary');
    }
}

export default new DashboardService(); 