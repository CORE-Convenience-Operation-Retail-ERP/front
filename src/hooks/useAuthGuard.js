import { useNavigate } from 'react-router-dom';

const useAuthGuard = () => {
  const navigate = useNavigate();

  const checkPermission = (menu) => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userType = payload.userType;

      if (userType === 'OWNER') {
        // 점주가 접근하면 안 되는 메뉴들
        const forbiddenMenus = ['product', 'hr', 'branchManagement'];

        if (forbiddenMenus.includes(menu)) {
          alert('권한이 없습니다.');
          return;
        }
      }

      // 정상 이동
      navigate(`/${menu}`);
    } catch (error) {
      console.error('토큰 파싱 오류', error);
      alert('인증 정보가 올바르지 않습니다. 다시 로그인 해주세요.');
      navigate('/login');
    }
  };

  return { checkPermission };
};

export default useAuthGuard;
