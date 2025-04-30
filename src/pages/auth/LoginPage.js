import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, TextField, Button, Typography } from '@mui/material';
import useLogin from "../../hooks/useLogin";

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
  const { login, error } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(loginId, loginPwd);
      console.log("로그인 응답:", user);

      // 토큰 디코딩 및 정보 저장
      const token = user.token;
      if (token) {
        const decoded = decodeJWT(token);
        
        if (decoded) {
          // 디코딩된 데이터를 로컬스토리지에 저장 (클레임 이름에 맞게)
          localStorage.setItem('name', decoded.empName || decoded.name || '');
          localStorage.setItem('userRole', decoded.role || decoded.deptName || '');
          
          // storeId는 null이 가능하므로 조건부로 저장
          if (decoded.storeId !== undefined) {
            localStorage.setItem('storeId', decoded.storeId);
          }
          
          // 디버깅을 위한 로그
          console.log("저장된 name:", localStorage.getItem('name'));
          console.log("저장된 storeId:", localStorage.getItem('storeId'));
          console.log("저장된 userRole:", localStorage.getItem('userRole'));
        }

        // 권한에 따라 라우팅 (deptId 기반)
        const deptId = decoded?.deptId || user.deptId;
        if (deptId === 3) {
          // 점포(3번 부서)일 경우
          navigate("/store/home");
        } else {
          // 본사(그 외 부서)일 경우
          navigate("/headquarters/products/all");
        }
      } else {
        alert("토큰을 받지 못했습니다. 다시 로그인해주세요.");
      }
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

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
            error={!!error}
            required
          />
          <TextField
            fullWidth
            type="password"
            label="비밀번호"
            margin="normal"
            value={loginPwd}
            onChange={(e) => setLoginPwd(e.target.value)}
            error={!!error}
            required
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
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