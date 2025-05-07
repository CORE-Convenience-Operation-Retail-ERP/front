import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  FormHelperText
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import AnnualLeaveCom from '../../components/headquarters/AnnualLeaveCom';
import axios from '../../service/axiosInstance';

const AnnualLeaveCon = () => {
  // 연차 신청 목록 상태
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 연차 신청 모달 상태
  const [openModal, setOpenModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  // 테스트 데이터
  const mockLeaveRequests = [
    {
      requestDate: '2023-08-01',
      startDate: '2023-08-10',
      endDate: '2023-08-11',
      days: 2,
      reason: '개인 사유',
      status: '승인'
    },
    {
      requestDate: '2023-09-15',
      startDate: '2023-09-25',
      endDate: '2023-09-25',
      days: 1,
      reason: '병원 방문',
      status: '대기중'
    },
    {
      requestDate: '2023-07-01',
      startDate: '2023-07-15',
      endDate: '2023-07-16',
      days: 2,
      reason: '가족 행사',
      status: '거절'
    }
  ];
  
  // 연차 신청 목록 조회
  useEffect(() => {
    loadLeaveRequests();
  }, []);
  
  // 연차 신청 목록 조회 함수
  const loadLeaveRequests = () => {
    setLoading(true);
    
    // 개발을 위해 목업 데이터 사용
    setLeaveRequests(mockLeaveRequests);
    setLoading(false);
    
    // 실제 API 연동 시 아래 코드 사용
    /*
    axios.get('/api/hr/annual-leave/requests')
      .then(res => {
        console.log('연차 신청 목록:', res.data);
        setLeaveRequests(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('연차 신청 목록 조회 실패:', err);
        // 개발을 위해 임시 데이터 사용
        setLeaveRequests(mockLeaveRequests);
        setError('연차 신청 목록을 불러오는데 실패했습니다. 임시 데이터를 표시합니다.');
        setLoading(false);
      });
    */
  };
  
  // 모달 열기
  const handleOpenModal = () => {
    setStartDate(null);
    setEndDate(null);
    setReason('');
    setFormErrors({});
    setSubmitError(null);
    setOpenModal(true);
  };
  
  // 모달 닫기
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  
  // 폼 유효성 검사
  const validateForm = () => {
    const errors = {};
    
    if (!startDate) {
      errors.startDate = '시작일을 선택해주세요.';
    }
    
    if (!endDate) {
      errors.endDate = '종료일을 선택해주세요.';
    }
    
    if (startDate && endDate && startDate.isAfter(endDate)) {
      errors.dateRange = '종료일은 시작일 이후여야 합니다.';
    }
    
    if (!reason.trim()) {
      errors.reason = '사유를 입력해주세요.';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // 일수 계산 함수
  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    return end.diff(start, 'day') + 1;
  };
  
  // 연차 신청 제출
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    setSubmitting(true);
    setSubmitError(null);
    
    const days = calculateDays(startDate, endDate);
    
    const requestData = {
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
      days: days,
      reason: reason
    };
    
    // 개발을 위한 가짜 성공 처리
    setTimeout(() => {
      // 새 항목 추가
      const newRequest = {
        requestDate: dayjs().format('YYYY-MM-DD'),
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        days: days,
        reason: reason,
        status: '대기중'
      };
      
      setLeaveRequests([newRequest, ...leaveRequests]);
      handleCloseModal();
      setSubmitting(false);
    }, 1000);
    
    // 실제 API 연동 시 아래 코드 사용
    /*
    axios.post('/api/hr/annual-leave/request', requestData)
      .then(res => {
        console.log('연차 신청 성공:', res.data);
        
        // 목록 새로고침
        loadLeaveRequests();
        
        // 모달 닫기
        handleCloseModal();
        setSubmitting(false);
      })
      .catch(err => {
        console.error('연차 신청 실패:', err);
        setSubmitError('연차 신청에 실패했습니다. 다시 시도해주세요.');
        setSubmitting(false);
      });
    */
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <AnnualLeaveCom 
        leaveRequests={leaveRequests}
        onNewRequest={handleOpenModal}
      />
      
      {/* 연차 신청 모달 */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1EACB5', color: 'white', fontWeight: 'bold' }}>
          연차 신청
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3, pb: 1 }}>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ mb: 2, mt: 1 }}>
              <DatePicker
                label="시작일"
                value={startDate}
                onChange={setStartDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!formErrors.startDate,
                    helperText: formErrors.startDate
                  }
                }}
                disablePast
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <DatePicker
                label="종료일"
                value={endDate}
                onChange={setEndDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!formErrors.endDate || !!formErrors.dateRange,
                    helperText: formErrors.endDate || formErrors.dateRange
                  }
                }}
                disablePast
                minDate={startDate}
              />
            </Box>
          </LocalizationProvider>
          
          {startDate && endDate && (
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              총 {calculateDays(startDate, endDate)}일의 연차를 사용합니다.
            </Typography>
          )}
          
          <TextField
            label="사유"
            multiline
            rows={3}
            fullWidth
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            error={!!formErrors.reason}
            helperText={formErrors.reason}
          />
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleCloseModal}
            sx={{ 
              color: '#777777',
              borderRadius: '8px',
              fontWeight: 'medium',
              textTransform: 'none',
              border: '1px solid #dddddd',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                borderColor: '#cccccc'
              }
            }}
          >
            취소
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            sx={{ 
              bgcolor: '#015D70', 
              '&:hover': { bgcolor: '#014D5E' },
              borderRadius: '8px',
              textTransform: 'none'
            }}
          >
            {submitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : '신청하기'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AnnualLeaveCon; 