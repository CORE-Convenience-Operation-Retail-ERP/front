import React from 'react';
import { Box, Typography, Paper, Divider, Avatar } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const MyCom = ({ info }) => {
  return (
    <Paper elevation={3} sx={{ borderRadius: 2, p: 3, mb: 3, height: 'calc(100% - 24px)' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {/* 프로필 이미지 */}
        <Avatar
          src={info?.empImg || "/profile_default.png"}
          alt="프로필"
          sx={{
            width: 120,
            height: 120,
            border: '2px solid #e0e0e0'
          }}
        />
        
        {/* 이름과 직급/부서 */}
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {info?.empName || '-'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {info?.empRole || '-'} | {info?.deptName || '-'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
            <PhoneIcon fontSize="small" color="primary" />
            <Typography variant="body2">
              {info?.empPhone || '-'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />
      
      {/* 연락처 및 주소 정보 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmailIcon fontSize="small" color="primary" />
          <Box>
            <Typography variant="caption" color="text.secondary">이메일</Typography>
            <Typography variant="body2">
              {info?.empEmail || '-'}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <HomeIcon fontSize="small" color="primary" sx={{ mt: 0.5 }} />
          <Box>
            <Typography variant="caption" color="text.secondary">주소</Typography>
            <Typography variant="body2">
              {info?.empAddr || '-'}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOnIcon fontSize="small" color="primary" />
          <Box>
            <Typography variant="caption" color="text.secondary">사원번호</Typography>
            <Typography variant="body2">
              {info?.empId || '-'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default MyCom;
