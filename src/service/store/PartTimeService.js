import instance from './axiosInstance';

// API 엔드포인트 기본 경로
const BASE_URL = '/api/parttimer';

export const fetchPartTimers = async ({ page, size, partName, partStatus }) => {
    try {
        const params = { page, size };
        if (partName) params.partName = partName;
        if (partStatus !== null) params.partStatus = partStatus;

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
        console.log("🔍 API로 요청하는 ID:", id);  // 이거 추가
        const response = await instance.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('파트타이머 상세 조회 실패:', error);
        throw error;
    }
};

export const createPartTimer = async (data) => {
    try {
        const response = await instance.post(BASE_URL, data);
        return response.data;
    } catch (error) {
        console.error('파트타이머 등록 실패:', error);
        throw error;
    }
};

export const updatePartTimer = async (id, data) => {
    try {
        const response = await instance.put(`${BASE_URL}/${id}`, data);
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