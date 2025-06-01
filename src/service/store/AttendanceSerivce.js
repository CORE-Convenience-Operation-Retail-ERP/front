import axios from "../axiosInstance";
import { handleRequest } from "../axiosInstance"

/** [1] 아르바이트 출근 요청 */
export const checkInPartTimer = (payload) =>
  handleRequest(() =>
    axios.post("/api/public/attendance/part-timer/check-in", payload, {
      headers: {
        "X-DEVICE-ID": localStorage.getItem("deviceId")
      }
    }).then(res => res.data)
  );

/** [2] 아르바이트 퇴근 요청 */
export const checkOutPartTimer = (payload) =>
  handleRequest(() =>
    axios.post("/api/public/attendance/part-timer/check-out", payload, {
      headers: {
        "X-DEVICE-ID": localStorage.getItem("deviceId")
      }
    }).then(res => res.data)
  );

/** [3] 출퇴근 기록 목록 조회 (필터 + 페이징) */
export const fetchPartTimerAttendanceList = ({
  storeId,
  partTimerId,
  partName,
  position,
  startDate,
  endDate,
  page = 0,
  size = 10
}) =>
  handleRequest(() =>
    axios.get("/api/attendance/part-timer/list", {
      params: {
        storeId,
        partTimerId,
        partName,
        position,
        startDate,
        endDate,
        page,
        size
      }
    }).then(res => res.data)
  );