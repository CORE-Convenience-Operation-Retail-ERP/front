import React from 'react';
import { Box, Typography, Paper, Divider, Checkbox } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import WorkIcon from '@mui/icons-material/Work';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import LoopIcon from '@mui/icons-material/Loop';

const MyCon = ({ info, type }) => {
  const renderAttendanceInfo = () => (
    <Paper 
      elevation={1} 
      sx={{ 
        borderRadius: 2, 
        p: 3, 
        height: '100%', 
        borderTop: '5px solid #3a5ca8' 
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <DonutLargeIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight="bold">근태 관리</Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">근무 일수:</Typography>
            <Typography variant="h6" fontWeight="medium">{info?.work_date}일</Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">지각:</Typography>
            <Typography variant="h6" fontWeight="medium">{info?.attend_status?.late}회</Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">결근:</Typography>
            <Typography variant="h6" fontWeight="medium">{info?.attend_status?.absent}일</Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">잔여 연차:</Typography>
            <Typography variant="h6" fontWeight="medium">
              {info?.rem_days}회/{info?.total_days}회
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ 
          width: 120, 
          height: 120, 
          borderRadius: '50%', 
          border: '8px solid #4a90e2', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: '#fff',
          position: 'relative',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}>
          <Box 
            sx={{ 
              position: 'absolute',
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: '#4a90e2',
              bottom: '10%',
              left: '50%',
              transform: 'translateX(-50%)'
            }} 
          />
          <Typography variant="h6" fontWeight="bold" color="primary">
            {info?.attend_status?.status || '출근'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
  
  const renderSalaryInfo = () => (
    <Paper 
      elevation={1} 
      sx={{ 
        borderRadius: 2, 
        p: 3, 
        height: '100%', 
        borderTop: '5px solid #3a5ca8' 
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <PaymentsIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight="bold">급여 내역</Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">급여일:</Typography>
          <Typography variant="h6" fontWeight="medium">{info?.salary_day}</Typography>
        </Box>
        
        <Box>
          <Typography variant="body2" color="text.secondary">계좌/은행:</Typography>
          <Typography variant="h6" fontWeight="medium">{info?.account_info}</Typography>
        </Box>
      </Box>
      
      <Box>
        <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>첨부 파일</Typography>
        {info?.attachments && info.attachments.length > 0 ? (
          info.attachments.map((file, index) => (
            <Box 
              key={index}
              sx={{ 
                p: 2, 
                bgcolor: '#f5f5f5', 
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1
              }}
            >
              <Checkbox size="small" />
              <Typography variant="body2">{file.name}</Typography>
            </Box>
          ))
        ) : (
          <Box sx={{ 
            p: 2, 
            bgcolor: '#f5f5f5', 
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Checkbox size="small" />
            <Typography variant="body2">연차 신청서.xls</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
  
  return type === 'attendance' ? renderAttendanceInfo() : renderSalaryInfo();
};

export default MyCon;
