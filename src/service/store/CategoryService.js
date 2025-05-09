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
        axios.get('/api/categories/parents').then((res) => res.data)
    );

/** [2] 하위 카테고리 조회 (중분류, 소분류) */
export const fetchChildCategories = (parentId) =>
    handleRequest(() =>
        axios.get(`/api/categories/children/${parentId}`)
    );

/** [3] 전체 카테고리 트리 조회 (필요시) */
export const fetchCategoryTree = () =>
    handleRequest(() =>
        axios.get('/api/categories/tree')
    );
