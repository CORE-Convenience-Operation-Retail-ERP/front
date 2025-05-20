import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid,
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  Typography,
  TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import koLocale from 'date-fns/locale/ko';

// 서비스 임포트
import SalesAnalysisService from '../../service/sales/SalesAnalysisService';

/**
 * 매출 분석 필터 컴포넌트
 */
const SalesAnalyticsFilter = ({ 
  selectedStore, 
  setSelectedStore, 
  dateRange, 
  setDateRange, 
  stores,
  onApplyFilter,
  hideAnalysisType = false
}) => {
  // 날짜 범위 프리셋
  const dateRangeOptions = [
    { value: 'today', label: '오늘' },
    { value: 'week', label: '최근 7일' },
    { value: 'month', label: '최근 30일' },
    { value: 'custom', label: '사용자 정의' }
  ];

  const [selectedDateRangePreset, setSelectedDateRangePreset] = useState('month');
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);

  // 날짜 범위 프리셋 변경 시 날짜 범위 업데이트
  useEffect(() => {
    if (selectedDateRangePreset !== 'custom') {
      const { startDate, endDate } = SalesAnalysisService.getDateRangeByOption(selectedDateRangePreset);
      setDateRange({ 
        startDate: new Date(startDate), 
        endDate: new Date(endDate) 
      });
    } else if (customStartDate && customEndDate) {
      setDateRange({
        startDate: customStartDate,
        endDate: customEndDate
      });
    }
  }, [selectedDateRangePreset, customStartDate, customEndDate]);

  // 필터 적용 핸들러
  const handleApplyFilter = () => {
    if (onApplyFilter) {
      onApplyFilter();
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        매출 분석 필터
      </Typography>
      <Grid container spacing={2} alignItems="center">
        {/* 지점 선택 */}
        <Grid xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small" sx={{ minWidth: 120 }}>
            <InputLabel>지점</InputLabel>
            <Select
              value={selectedStore === null || selectedStore === '' ? 'ALL' : selectedStore}
              onChange={(e) => setSelectedStore(e.target.value === 'ALL' ? null : e.target.value)}
              label="지점"
            >
              <MenuItem value="ALL">전체 지점</MenuItem>
              {stores.map(store => (
                <MenuItem key={store.storeId} value={store.storeId}>
                  {store.storeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* 날짜 범위 선택 */}
        <Grid xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>기간</InputLabel>
            <Select
              value={selectedDateRangePreset}
              onChange={(e) => setSelectedDateRangePreset(e.target.value)}
              label="기간"
            >
              {dateRangeOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* 사용자 정의 날짜 선택 */}
        {selectedDateRangePreset === 'custom' && (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={koLocale}>
            <Grid xs={6} md={2}>
              <DatePicker
                label="시작일"
                value={customStartDate}
                onChange={(date) => setCustomStartDate(date)}
                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
              />
            </Grid>
            <Grid xs={6} md={2}>
              <DatePicker
                label="종료일"
                value={customEndDate}
                onChange={(date) => setCustomEndDate(date)}
                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
              />
            </Grid>
          </LocalizationProvider>
        )}
        {/* 필터 적용 버튼 */}
        <Grid xs={12} md={selectedDateRangePreset === 'custom' ? 3 : 5}>
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth
            onClick={handleApplyFilter}
          >
            필터 적용
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SalesAnalyticsFilter; 