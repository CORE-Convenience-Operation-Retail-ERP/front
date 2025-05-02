import React, { useState } from 'react';
import { Typography, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import WidgetWrapper from './WidgetWrapper';

const SalesWidget = () => {
  const [timeRange, setTimeRange] = useState('daily');

  const handleTimeRangeChange = (event, newTimeRange) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  return (
    <WidgetWrapper title="매출 현황">
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          size="small"
          value={timeRange}
          exclusive
          onChange={handleTimeRangeChange}
        >
          <ToggleButton value="daily" sx={{ px: 1, py: 0.5, fontSize: '0.75rem' }}>
            일별
          </ToggleButton>
          <ToggleButton value="monthly" sx={{ px: 1, py: 0.5, fontSize: '0.75rem' }}>
            월별
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <Box
        sx={{
          height: 'calc(100% - 40px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#f5f5f5',
          borderRadius: 1,
          p: 2
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          {timeRange === 'daily' ? '일별' : '월별'} 매출 차트가 표시될 영역입니다<br />
          차트 라이브러리 설치 후 구현 예정
        </Typography>
      </Box>
    </WidgetWrapper>
  );
};

export default SalesWidget;