import React from 'react';
import { Box, Typography } from '@mui/material';

const MyCom = ({ info }) => {
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: 2,
        p: 3,
        textAlign: 'center',
        boxShadow: 1
      }}
    >
      <Box
        component="img"
        src="/profile_default.png"
        alt="프로필"
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          objectFit: 'cover',
          mb: 2
        }}
      />
      <Typography variant="h6" fontWeight="bold">
        {info.empName || '이름 없음'}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {info.empRole || '직급 없음'}
      </Typography>
      <Typography variant="body2">
        {info.empPhone || '전화번호 없음'}
      </Typography>
      <Typography variant="body2">
        {info.empAcount || '계좌 없음'}
      </Typography>
      <Typography variant="body2">
        {info.empAddr || '주소 없음'}
      </Typography>
    </Box>
  );
};

export default MyCom;
