import React, { useState } from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const CalendarBox = ({ fullHeight }) => {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());

  return (
    <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3, border: '1.5px solid #dbe6ef', background: '#fff', minWidth: 340, height: fullHeight ? '100%' : 'auto' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography sx={{ fontWeight: 'bold', mb: 1 }}>기간 선택</Typography>
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
        </Box>
      </LocalizationProvider>
    </Paper>
  );
};

export default CalendarBox; 