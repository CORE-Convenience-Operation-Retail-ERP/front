import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, TextField, Button, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';

const LoginPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log("Login data:", data);  // 로그인 요청 데이터 출력
  
    // 폼 데이터 방식으로 요청을 보냄
    fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',  // 폼 데이터 형식으로 변경
      },
      body: new URLSearchParams({
        loginId: data.loginId,
        loginPwd: data.loginPwd,
      }),
      credentials: 'include', // 세션 쿠키를 포함
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('로그인 실패');
        }
        return response.json();
      })
      .then(data => {
        console.log("서버 응답:", data);
  debugger;
        // branchName이 null일 경우 점주가 아니면 경고 처리
        if (!data.branchName && 2 != data.workType) {
          alert("점주 지점명이 없습니다. 관리자에게 문의하세요.");
          return;
        }
  
        // 서버에서 받은 JWT 토큰을 로컬 스토리지에 저장
        localStorage.setItem('branchName', data.branchName);
        localStorage.setItem('loginUser', JSON.stringify(data));
  debugger;
        // 사용자 유형에 맞춰 리다이렉션
        if (data.workType === 3) {
          // 점주일 경우
          navigate('/store/home');  // 점주용 홈 화면
        } else if (data.workType === 2) {
          // 본사 관리자일 경우
          navigate('/headquarters/dashboard');  // 본사 대시보드 화면
        } else {
          alert('알 수 없는 사용자 유형입니다.');
        }
      })
      .catch(error => {
        console.error('네트워크 오류', error);
        alert('서버와 연결할 수 없습니다.');
      });
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="아이디"
            margin="normal"
            {...register('loginId', { required: '아이디를 입력해주세요' })}
            error={!!errors.loginId}
            helperText={errors.loginId?.message}
          />
          <TextField
            fullWidth
            type="password"
            label="비밀번호"
            margin="normal"
            {...register('loginPwd', { required: '비밀번호를 입력해주세요' })}
            error={!!errors.loginPwd}
            helperText={errors.loginPwd?.message}
          />
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
};

export default LoginPage; 