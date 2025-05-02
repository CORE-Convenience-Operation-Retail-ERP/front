import React from 'react';
import { Box, Typography, Paper, Divider, Avatar } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const MyCom = ({ info }) => {
  return (
    <Paper elevation={1} sx={{ borderRadius: 2, p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        {/* 프로필 이미지 */}
          <Avatar
          src={info?.empImg}
            alt="프로필"
            sx={{
            width: 160,
            height: 160,
            mb: 2,
              border: '4px solid #f0f7ff',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
          />
        
        {/* 이름과 직급/부서 */}
        <Typography variant="h5" fontWeight="bold">
          {info?.empName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {info?.empRole} | {info?.deptName}
        </Typography>
      </Box>

      {/* 구분선 - 너무 길지 않게 설정 */}
      {/* ===== 구분선 시작 ===== */}
      <Divider sx={{ width: '60%', mx: 'auto', mb: 3 }} />
      {/* ===== 구분선 끝 ===== */}
      
      {/* 연락처 및 주소 정보 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PhoneIcon color="primary" />
          <Box>
            <Typography variant="body2" color="text.secondary">연락처:</Typography>
            <Typography variant="body1" fontWeight="medium">
              {info?.empPhone}
            </Typography>
        </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <EmailIcon color="primary" />
          <Box>
            <Typography variant="body2" color="text.secondary">이메일:</Typography>
            <Typography variant="body1" fontWeight="medium">
              {info?.empEmail}
          </Typography>
        </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <HomeIcon color="primary" sx={{ mt: 0.5 }} />
          <Box>
            <Typography variant="body2" color="text.secondary">주소:</Typography>
            <Typography variant="body1" fontWeight="medium">
              {info?.empAddr}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <LocationOnIcon color="primary" />
          <Box>
            <Typography variant="body2" color="text.secondary">사원번호:</Typography>
            <Typography variant="body1" fontWeight="medium">
              {info?.empId}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default MyCom;
