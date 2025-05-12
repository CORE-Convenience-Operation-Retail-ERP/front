import instance from '../axiosInstance';
import formDataAxios from '../formDataAxios';

// API 엔드포인트 기본 경로
const BASE_URL = '/api/store/parttimer';

export const fetchPartTimers = async ({ page, size, partName, partStatus, position }) => {
    try {
        const params = { page, size };
        if (partName) params.partName = partName;
        if (partStatus !== null) params.partStatus = partStatus;
        if (position) params.position = position;

        const response = await instance.get(`${BASE_URL}/list`, { params });
        return response.data;
    } catch (error) {
        console.error('파트타이머 목록 조회 실패:', error);
        throw error;
    }
};

export const searchPartTimers = async (params) => {
    try {
        const response = await instance.get(`${BASE_URL}/search`, { params });
        return response.data;
    } catch (error) {
        console.error('파트타이머 검색 실패:', error);
        throw error;
    }
};


export const fetchPartTimerById = async (id) => {
    try {
        console.log("🔍 API로 요청하는 ID:", id);
        const response = await instance.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('파트타이머 상세 조회 실패:', error);
        throw error;
    }
};

export const createPartTimer = async (formData) => {
    try {
        const response = await formDataAxios.post(BASE_URL, formData);
        return response.data;
    } catch (error) {
        console.error('파트타이머 등록 실패:', error);
        throw error;
    }
};

export const updatePartTimer = async (id, formData) => {
    try {
        const response = await formDataAxios.put(`${BASE_URL}/${id}`, formData);
        return response.data;
    } catch (error) {
        console.error('파트타이머 수정 실패:', error);
        throw error;
    }
};

export const deletePartTimer = async (id) => {
    try {
        const response = await instance.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('파트타이머 삭제 실패:', error);
        throw error;
    }
};

export const fetchAllPartTimers = async () => {
    try {
        const response = await instance.get('/api/store/parttimer/dropdown');
        return response.data;
    } catch (error) {
        console.error('파트타이머 전체 목록 조회 실패:', error);
        throw error;
    }
};