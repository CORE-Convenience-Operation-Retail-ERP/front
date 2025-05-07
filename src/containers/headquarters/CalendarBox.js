import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const CalendarBox = ({ fullHeight }) => {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());

  const handleSubmit = () => {
    console.log('연차 신청:', {
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD')
    });
    // 여기에 API 호출 로직 추가
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
            color="primary"
            onClick={handleSubmit}
            sx={{ 
              mt: 1,
              bgcolor: '#2563A6',
              '&:hover': {
                bgcolor: '#1e5085',
              }
            }}
          >
            연차 신청
          </Button>
        </Box>
      </LocalizationProvider>
    </Box>
  );
};

export default CalendarBox; 