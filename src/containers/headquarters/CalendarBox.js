import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';

const CalendarBox = ({ fullHeight }) => {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log('연차 신청:', {
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD')
    });
    // 연차 신청 페이지로 이동
    navigate('/headquarters/hr/annual-leave');
  };

  return (
    <Box sx={{ p: 2, background: '#fff', minWidth: 340, height: fullHeight ? '100%' : 'auto' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <DatePicker
            label="시작일"
            value={startDate}
            onChange={setStartDate}
            sx={{ background: '#fff', borderRadius: 2 }}
          />
          <DatePicker
            label="종료일"
            value={endDate}
            onChange={setEndDate}
            sx={{ background: '#fff', borderRadius: 2 }}
          />
          <Button 
            variant="contained"
            startIcon={<EventIcon />}
            onClick={handleSubmit}
            sx={{ 
              mt: 1,
              bgcolor: '#1EACB5',
              '&:hover': {
                bgcolor: '#015D70',
              },
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 'medium',
              boxShadow: '0px 3px 6px rgba(1, 93, 112, 0.2)',
            }}
          >
            연차 신청하기
          </Button>
        </Box>
      </LocalizationProvider>
    </Box>
  );
};

export default CalendarBox; 