import React, { useState } from 'react';
import { Box } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const CalendarBox = ({ fullHeight }) => {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());

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
        </Box>
      </LocalizationProvider>
    </Box>
  );
};

export default CalendarBox; 