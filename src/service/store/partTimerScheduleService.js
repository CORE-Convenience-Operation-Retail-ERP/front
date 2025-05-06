import axiosInstance from "../axiosInstance";

// 스케줄 목록 조회 (월간 or 주간 범위)
export const fetchSchedules = async (viewType, startDate, endDate) => {
    const res = await axiosInstance.get("/api/parttimer-schedule", {
        params: { view: viewType, start: startDate, end: endDate },
    });
    return res.data;
};

// 스케줄 등록
export const createSchedule = async (scheduleData) => {
    try {
        const res = await axiosInstance.post("/api/parttimer-schedule", scheduleData);
        return res.data;
    } catch (error) {
        console.error("스케줄 등록 실패:", error);
        throw error; // UI에서 alert 처리 가능
    }
};

// 스케줄 수정
export const updateSchedule = async (id, scheduleData) => {
    const res = await axiosInstance.put(`/api/parttimer-schedule/${id}`, scheduleData);
    return res.data;
};

// 스케줄 삭제
export const deleteSchedule = async (id) => {
    const res = await axiosInstance.delete(`/api/parttimer-schedule/${id}`);
    return res.data;
};