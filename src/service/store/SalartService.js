import axios from "../axiosInstance"; // 경로는 실제 인스턴스 파일 경로로 수정

// 1. 급여 리스트 조회 (월별 or 연도별)
// 1. 급여 리스트 조회 (월별 or 연도별 + 페이징)
export async function fetchSalaryList({ 
    name = '', 
    status = '', 
    year, 
    month, 
    view = 'monthly',
    page = 0,
    size = 10
  }) {


    return await axios.get('/api/salary/list', {
      params: {
        name,
        status,
        year,
        month: month?.toString().padStart(2, '0'),
        view,
        page,
        size
      }
    });
  }
// 2. 급여 생성 요청 (ex: "2024-04" 형식으로 전달)
export async function generateSalaryForMonth(year, month) {
  const yearMonth = `${year}-${month.toString().padStart(2, "0")}`;
  return await axios.post("/api/salary/generate", null, {
    params: { yearMonth },
  });
}

// 3. 상세 급여 조회 (월별 or 연도별)
export const fetchSalaryDetailById = async (id, view, year, month) => {
  const params = {
    view,
    year,
  };
  if (month !== null && month !== "null" && month !== undefined) {
    params.month = month.toString().padStart(2, "0");
  }

  return await axios.get(`/api/salary/detail/${id}`, { params });
};