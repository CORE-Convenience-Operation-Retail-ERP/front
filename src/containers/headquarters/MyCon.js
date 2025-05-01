import React from 'react';
import { Box, Typography, Paper, Divider, Chip } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import CircularProgress from '@mui/material/CircularProgress';

const MyCon = ({ info }) => {
  // 연차 사용률 계산
  const calculateUsedPercentage = () => {
    if (!info || !info.annualLeaveTotal || info.annualLeaveTotal === 0) return 0;
    const used = info.annualLeaveTotal - info.annualLeaveRemain;
    return Math.round((used / info.annualLeaveTotal) * 100);
  };

  const usedPercentage = calculateUsedPercentage();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
      {/* 근태 관리 박스 */}
      <Paper 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 3, 
          boxShadow: 3, 
          border: '1.5px solid #dbe6ef', 
          overflow: 'hidden',
          flex: 1
        }}
      >
        <Box sx={{ backgroundColor: '#f7fafd', p: 2, borderBottom: '1px solid #dbe6ef' }}>
          <Typography variant="h6" fontWeight="bold" color="primary" display="flex" alignItems="center">
            <AccessTimeIcon sx={{ mr: 1 }} />근태 정보
          </Typography>
        </Box>
        
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>출근일수</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircleIcon color="success" sx={{ mr: 0.5 }} />
                <Typography variant="h6">{info.attendanceDays || 0}일</Typography>
              </Box>
            </Box>
            
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>지각</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AccessTimeIcon color="warning" sx={{ mr: 0.5 }} />
                <Typography variant="h6">{info.lateCount || 0}회</Typography>
              </Box>
            </Box>
            
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>결근</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EventBusyIcon color="error" sx={{ mr: 0.5 }} />
                <Typography variant="h6">{info.absentCount || 0}일</Typography>
              </Box>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2, borderColor: '#dbe6ef' }} />
          
          <Typography gutterBottom variant="body1" fontWeight="bold">연차 사용 현황</Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
              <CircularProgress 
                variant="determinate" 
                value={usedPercentage} 
                size={60} 
                thickness={5} 
                sx={{ color: usedPercentage > 80 ? 'error.main' : 'primary.main' }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption" component="div" fontWeight="bold">
                  {usedPercentage}%
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="body2">
                남은 연차: <Typography component="span" fontWeight="bold" color="primary">{info.annualLeaveRemain || 0}일</Typography>/{info.annualLeaveTotal || 0}일
              </Typography>
              <Typography variant="body2" color="text.secondary">
                사용 연차: {(info.annualLeaveTotal || 0) - (info.annualLeaveRemain || 0)}일
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
      
      {/* 급여 정보 박스 */}
      <Paper sx={{ borderRadius: 3, boxShadow: 3, border: '1.5px solid #dbe6ef', overflow: 'hidden' }}>
        <Box sx={{ backgroundColor: '#f7fafd', p: 2, borderBottom: '1px solid #dbe6ef' }}>
          <Typography variant="h6" fontWeight="bold" color="primary" display="flex" alignItems="center">
            <AttachMoneyIcon sx={{ mr: 1 }} />급여 정보
          </Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body1">급여일</Typography>
            <Chip 
              icon={<CalendarMonthIcon />} 
              label={info.salaryDay || '매월 25일'} 
              color="primary" 
              variant="outlined" 
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1">계좌</Typography>
            <Typography variant="body2" color="text.secondary">
              {info.empAcount || '정보 없음'}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default MyCon;
