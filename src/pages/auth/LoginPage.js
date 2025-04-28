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
      if (!response.ok) {
        throw new Error('로그인 실패');
      }
      return response.json();
    })
    .then(data => {
      console.log("서버 응답:", data);

      localStorage.setItem('branchName', data.branchName);
      
      // 서버에서 받은 사용자 정보 예: { id: 123, name: "김철수", ... }
      localStorage.setItem('loginUser', JSON.stringify(data));
      if (data.workType === 3) {
        navigate('/store/home'); // 점주용
      } else {
        navigate('/headquarters/dashboard'); // 본사용
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