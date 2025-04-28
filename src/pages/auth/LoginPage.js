import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, TextField, Button, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';

const LoginPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log("Login data:", data);  // 로그인 요청 데이터 출력


    fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        loginId: data.loginId,
        loginPwd: data.loginPwd,
      }),
      credentials: 'include', 
    })

    .then(response => {
      console.log("Response status:", response.status);  // 응답 상태 코드 확인
      if (response.ok) {
        console.log('로그인 성공');
        navigate('/headquarters/dashboard'); // 로그인 성공 시 이동할 페이지
      } else {
        console.error('로그인 실패');
        alert('아이디 또는 비밀번호가 올바르지 않습니다.');
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
        </form>
      </Card>
    </Box>
  );
};

export default LoginPage; 