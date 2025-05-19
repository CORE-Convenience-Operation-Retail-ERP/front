import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Card, TextField, Button, Typography } from '@mui/material';
import useLogin from "../../hooks/useLogin";
import { useError } from '../../contexts/ErrorContext.tsx';

// 개선된 JWT 디코딩 함수
function decodeJWT(token) {
    if (!token) {
        console.error("토큰이 없습니다");
        return null;
    }
    
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error("잘못된 JWT 형식입니다");
            return null;
        }
        
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        
        const decoded = JSON.parse(jsonPayload);
        console.log("디코딩된 토큰:", decoded);
        return decoded;
    } catch (e) {
        console.error("JWT 디코딩 실패:", e);
        return null;
    }
}

export default function LoginPage() {
  const [loginId, setLoginId] = useState("");
  const [loginPwd, setLoginPwd] = useState("");
  const { login, error: loginError, setError: setLoginError } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const { error, setError } = useError();

  useEffect(() => {
    // URL 쿼리 파라미터에서 에러 메시지 처리
    const queryParams = new URLSearchParams(location.search);
    const errorParam = queryParams.get('error');
    
    if (errorParam) {
      let errorMessage = '로그인에 문제가 발생했습니다';
      
      // 에러 유형별 메시지 처리
      switch(errorParam) {
        case 'session_expired':
          errorMessage = '세션이 만료되었습니다. 다시 로그인해주세요.';
          break;
        case 'unauthorized':
          errorMessage = '로그인이 필요한 서비스입니다.';
          break;
        case 'invalid_credentials':
          errorMessage = '아이디 또는 비밀번호가 올바르지 않습니다.';
          break;
        default:
          errorMessage = '로그인 중 오류가 발생했습니다.';
      }
      
      // 오류 상태 설정
      setLoginError(errorMessage);
      
      // ErrorContext에 오류 등록
      setError(errorMessage);
    }
    
    // 이전 페이지에서 전달된 상태 메시지 처리
    if (location.state?.message) {
      setLoginError(location.state.message);
      setError(location.state.message);
    }
  }, [location, setError, setLoginError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(loginId, loginPwd);
      console.log("로그인 응답:", user);

      // 토큰 디코딩 (이제 토큰 디코딩 정보는 참조만 하고 로컬스토리지 저장은 useLogin.js에서 처리)
      const token = user.token;
      if (token) {
        const decoded = decodeJWT(token);
        
        // 권한에 따라 라우팅 (deptId 기반)
        const deptId = user.deptId;
        if (deptId === 3) {
          // 점포(3번 부서)일 경우
          navigate("/store/home");
        } else {
          // 본사(그 외 부서)일 경우
          navigate("/headquarters/dashboard");
        }
      } else {
        alert("토큰을 받지 못했습니다. 다시 로그인해주세요.");
      }
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  // 사용할 에러 메시지 (ErrorContext나 useLogin의 에러 중 존재하는 것 사용)
  const displayError = error || loginError;

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5'
      }}
    >
      <Card sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" align="center" gutterBottom>
          CORE ERP
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" sx={{ mb: 3 }}>
          본사 관리자 로그인
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="아이디"
            margin="normal"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            error={!!displayError}
            required
          />
          <TextField
            fullWidth
            type="password"
            label="비밀번호"
            margin="normal"
            value={loginPwd}
            onChange={(e) => setLoginPwd(e.target.value)}
            error={!!displayError}
            required
          />
          {displayError && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {displayError}
            </Typography>
          )}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
          >
            로그인
          </Button>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            sx={{ mt: 2 }}
            onClick={() => navigate('/register')}
          >
            회원가입
          </Button>
        </form>
      </Card>
    </Box>
  );
}