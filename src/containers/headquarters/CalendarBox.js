import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import DateRangeIcon from '@mui/icons-material/DateRange';

const CalendarBox = forwardRef(({ fullHeight }, ref) => {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [dayCount, setDayCount] = useState(1);

  // ref를 통해 외부에서 날짜 정보 접근 가능하도록 설정
  useImperativeHandle(ref, () => ({
    getSelectedDates: () => ({
      startDate,
      endDate,
      dayCount
    })
  }));

  // 날짜 변경 시 일수 계산
  useEffect(() => {
    if (startDate && endDate) {
      // 시작일과 종료일이 같은 경우도 1일로 계산
      const days = endDate.diff(startDate, 'day') + 1;
      setDayCount(days > 0 ? days : 1);
    }
  }, [startDate, endDate]);

  // 시작일 변경 시 종료일 자동 조정
  const handleStartDateChange = (newDate) => {
    setStartDate(newDate);
    if (endDate && newDate.isAfter(endDate)) {
      setEndDate(newDate);
    }
  };

  // 공통 DatePicker 스타일
  const datePickerStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#2563A6',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#2563A6',
        borderWidth: '1px',
      }
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#2563A6',
    }
  };

  return (
    <Box sx={{ height: fullHeight ? '100%' : 'auto' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <DatePicker
            label="시작일"
            value={startDate}
            onChange={handleStartDateChange}
            sx={datePickerStyle}
          />
          <DatePicker
            label="종료일"
            value={endDate}
            onChange={setEndDate}
            minDate={startDate}
            sx={datePickerStyle}
          />
          <Paper 
            elevation={0}
            sx={{ 
              mt: 1,
              p: 1.5,
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              backgroundColor: '#F8FAFB',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <DateRangeIcon sx={{ color: '#2563A6', mr: 1, fontSize: '1.2rem' }} />
              <Typography variant="subtitle2" fontWeight="medium" color="#2563A6">
                선택한 연차 기간
              </Typography>
            </Box>
            <Typography variant="body2" color="text.primary" sx={{ ml: 0.5 }}>
              {startDate.format('YYYY년 MM월 DD일')} ~ {endDate.format('YYYY년 MM월 DD일')}
            </Typography>
            <Box 
              sx={{ 
                mt: 1, 
                p: 0.5, 
                borderRadius: 1, 
                textAlign: 'center',
                backgroundColor: 'rgba(37, 99, 166, 0.1)',
                color: '#2563A6'
              }}
            >
              <Typography variant="body2" fontWeight="medium">
                {dayCount > 0 ? `총 ${dayCount}일` : ''}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </LocalizationProvider>
    </Box>
  );
});

export default CalendarBox; 