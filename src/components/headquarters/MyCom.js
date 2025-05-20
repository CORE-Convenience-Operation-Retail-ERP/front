import React from 'react';
import { Box, Typography, Divider, Avatar } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// 아이콘 박스 컴포넌트화
const IconBox = ({ icon: Icon }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      borderRadius: '50%',
      backgroundColor: 'rgba(37, 99, 166, 0.1)'
    }}
  >
    <Icon fontSize="small" sx={{ color: '#2563A6' }} />
  </Box>
);

const MyCom = ({ info }) => {
  return (
      <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {/* 프로필 이미지 */}
          <Avatar
            src={info?.empImg || "/profile_default.png"}
            alt="프로필"
            sx={{
              width: 120,
              height: 120,
              border: '3px solid #e0e0e0',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
            }}
          />
          
          {/* 이름과 직급/부서 */}
          <Box sx={{ textAlign: 'center', mb: 1, width: '100%' }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {info?.empName || '-'}
            </Typography>
            <Box 
              sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                backgroundColor: 'rgba(37, 99, 166, 0.1)', 
                color: '#2563A6',
                py: 0.5,
                px: 2,
                borderRadius: 2,
                mb: 2
              }}
            >
              <Typography variant="body2" fontWeight="medium">
                {info?.empRole || '-'} | {info?.deptName || '-'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
              <PhoneIcon fontSize="small" sx={{ color: '#2563A6' }} />
              <Typography variant="body2">
                {info?.empPhone || '-'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />
        
        {/* 연락처 및 주소 정보 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconBox icon={EmailIcon} />
            <Box>
              <Typography variant="caption" color="text.secondary">이메일</Typography>
              <Typography variant="body2" fontWeight="medium">
                {info?.empEmail || '-'}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <IconBox icon={HomeIcon} />
            <Box>
              <Typography variant="caption" color="text.secondary">주소</Typography>
              <Typography variant="body2" fontWeight="medium">
                {info?.empAddr || '-'}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <IconBox icon={LocationOnIcon} />
            <Box>
              <Typography variant="caption" color="text.secondary">사원번호</Typography>
              <Typography variant="body2" fontWeight="medium">
                {info?.empId || '-'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MyCom;
