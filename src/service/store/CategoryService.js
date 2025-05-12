import axios from '../axiosInstance';

/** 공통 에러 핸들링 */
const handleRequest = async (apiCall) => {
    try {
        return await apiCall();
    } catch (err) {
        const msg = typeof err.response?.data === 'string'
            ? err.response.data
            : err.response?.data?.message || err.message || "서버 오류 발생";
        return Promise.reject(msg);
    }
};


/** [1] 대분류 카테고리 조회 */
export const fetchParentCategories = () =>
    handleRequest(() =>
      axios
        .get('/api/categories/parents')
        .then(res => res.data)    // ← res.data만 반환
    );
  
  /** [2] 하위 카테고리 조회 (중분류, 소분류) */
  export const fetchChildCategories = parentId =>
    handleRequest(() =>
      axios
        .get(`/api/categories/children/${parentId}`)
        .then(res => res.data)    // ← res.data만 반환
    );
  

    /** [3] 특정 대분류의 모든 하위 카테고리 ID 가져오기 */
export const fetchAllDescendants = (parentId) =>
    handleRequest(() =>
        axios.get(`/api/categories/all-descendants/${parentId}`).then(res => res.data)
    );
