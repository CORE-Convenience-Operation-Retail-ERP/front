import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography, Paper, Divider, Grid, Button, CircularProgress, 
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  TextField } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import WorkIcon from '@mui/icons-material/Work';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useNavigate } from 'react-router-dom';
import axios from '../../service/axiosInstance';

const MyCon = forwardRef(({ info, type }, ref) => {
  const navigate = useNavigate();
  
  // 근태 데이터
  const totalDays = info?.attendanceDays || 0;
  const lateDays = info?.lateCount || 0;
  const absentDays = info?.absentCount || 0;
  const annualRemain = info?.annualLeaveRemain || 0;
  const annualTotal = info?.annualLeaveTotal || 0;
  
  // 출퇴근 상태
  const [attendanceStatus, setAttendanceStatus] = useState({
    isWorking: false,
    checkInTime: null,
    checkOutTime: null,
    isLate: false,
    isEarlyLeave: false
  });
  
  // 로딩 상태
  const [loading, setLoading] = useState(false);
  
  // 커스텀 알림창 상태
  const [dialog, setDialog] = useState({
    open: false,
    title: '',
    message: '',
    type: 'info', // 'info', 'warning', 'success', 'error'
    confirmText: '확인',
    cancelText: '취소',
    showCancel: false,
    onConfirm: () => {},
    onCancel: () => {},
    // 커스텀 색상 추가
    backgroundColor: '',
    titleColor: '',
    messageColor: '',
    buttonColor: ''
  });
  
  // 연차 신청 모달 상태
  const [leaveModal, setLeaveModal] = useState({
    open: false,
    reason: '',
    submitting: false
  });
  
  // 연차 신청 모달 열기
  const handleOpenLeaveModal = () => {
    setLeaveModal({
      open: true,
      reason: '',
      submitting: false
    });
  };
  
  // ref를 통해 함수 노출
  useImperativeHandle(ref, () => ({
    handleOpenLeaveModal
  }));
  
  // 커스텀 알림창 열기 함수
  const openDialog = (options) => {
    // 기본 색상 설정 - 홈페이지 UI 색상에 맞춤
    let backgroundColor = options.backgroundColor || '#FFFFFF';
    let titleColor = options.titleColor || '#1EACB5';
    let messageColor = options.messageColor || '#333333';
    let buttonColor = options.buttonColor || '#015D70';
    
    setDialog({
      ...dialog,
      open: true,
      backgroundColor,
      titleColor,
      messageColor,
      buttonColor,
      ...options
    });
  };
  
  // 커스텀 알림창 닫기 함수
  const closeDialog = () => {
    setDialog({
      ...dialog,
      open: false
    });
  };
  
  // 커스텀 알림창 (alert 대체)
  const showAlert = (
    message, 
    title = '알림', 
    type = 'info', 
    {backgroundColor = '#FFFFFF', titleColor = '#1EACB5', messageColor = '#333333', buttonColor = '#015D70'} = {}
  ) => {
    openDialog({
      title,
      message,
      type,
      showCancel: false,
      onConfirm: closeDialog,
      backgroundColor,
      titleColor,
      messageColor,
      buttonColor
    });
  };
  
  // 커스텀 확인창 (confirm 대체)
  const showConfirm = (
    message, 
    onConfirm, 
    title = '확인', 
    type = 'warning',
    {backgroundColor = '#FFFFFF', titleColor = '#1EACB5', messageColor = '#333333', buttonColor = '#015D70'} = {}
  ) => {
    openDialog({
      title,
      message,
      type,
      showCancel: true,
      onConfirm: () => {
        closeDialog();
        onConfirm();
      },
      onCancel: closeDialog,
      backgroundColor,
      titleColor,
      messageColor,
      buttonColor
    });
  };
  
  // 현재 시간 체크 (9시 이후 출근 시 지각, 18시 이전 퇴근 시 조퇴)
  const checkAttendanceTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    // 9시 이후 출근 시 지각
    if (hours >= 9 && !attendanceStatus.isWorking) {
      return { isLate: true, isEarlyLeave: false, time: timeString };
    }
    // 18시 이전 퇴근 시 조퇴
    else if (hours < 18 && attendanceStatus.isWorking) {
      return { isLate: false, isEarlyLeave: true, time: timeString };
    }
    
    return { isLate: false, isEarlyLeave: false, time: timeString };
  };
  
  // API 오류 처리 함수
  const handleApiError = (err, actionType) => {
    let errorMessage = `${actionType} 기록 처리 중 오류가 발생했습니다.`;
    
    if (err.response && err.response.data && err.response.data.message) {
      errorMessage = err.response.data.message;
    }
    
    // setAlert 대신 커스텀 Dialog 사용
    showAlert(errorMessage, '오류', 'error', {
      backgroundColor: '#FFFFFF',
      titleColor: '#1EACB5',
      messageColor: '#333333',
      buttonColor: '#015D70'
    });
  };
  
  // 출근 처리 함수
  const handleCheckIn = (time, isLate) => {
    // 출근 API 호출
    axios.post('/api/hr/attendance/check-in', {
      empId: info?.empId,
      checkInTime: time,
      isLate: isLate
    })
    .then(res => {
      console.log('출근 기록 성공:', res.data);
      
      // 디버깅 - 응답 내용 확인
      console.log('받은 응답 전체:', JSON.stringify(res.data));
      
      setAttendanceStatus({
        ...attendanceStatus,
        isWorking: true,
        checkInTime: time,
        isLate: isLate
      });
      
      // 커스텀 알림창으로 출근 완료 알림
      showAlert(
        isLate ? `지각 처리되었습니다. (${time})` : `출근 완료! (${time})`, 
        isLate ? '지각 알림' : '출근 완료', 
        isLate ? 'warning' : 'success',
        {
          backgroundColor: '#FFFFFF',
          titleColor: '#1EACB5',
          messageColor: isLate ? '#333333' : '#333333', 
          buttonColor: '#015D70'
        }
      );
      
      setLoading(false);
    })
    .catch(err => {
      console.error('출근 기록 실패:', err);
      
      // 커스텀 알림창으로 오류 표시
      showAlert(
        `출근 기록 처리 중 오류가 발생했습니다: ${err.message}`,
        '오류',
        'error',
        {
          backgroundColor: '#FFFFFF',
          titleColor: '#1EACB5',
          messageColor: '#333333',
          buttonColor: '#015D70'
        }
      );
      
      handleApiError(err, '출근');
      
      // 오류 발생 시에도 UI 업데이트 (개발 편의를 위해)
      setAttendanceStatus({
        ...attendanceStatus,
        isWorking: true,
        checkInTime: time,
        isLate: isLate
      });
      
      setLoading(false);
    });
  };
  
  // 퇴근 API 호출 함수 (조기 퇴근 확인 이후 호출)
  const processCheckOut = (time, isEarlyLeave) => {
    axios.post('/api/hr/attendance/check-out', {
      empId: info?.empId,
      checkOutTime: time,
      isEarlyLeave: isEarlyLeave
    })
    .then(res => {
      console.log('퇴근 기록 성공:', res.data);
      console.log('받은 응답 전체:', JSON.stringify(res.data));
      
      // 상태 업데이트
      setAttendanceStatus({
        ...attendanceStatus,
        isWorking: false,
        checkOutTime: time,
        isEarlyLeave: isEarlyLeave
      });
      
      // 성공 알림
      if (isEarlyLeave) {
        showAlert(`조퇴 처리되었습니다. (${time})`, '조퇴 완료', 'warning', {
          backgroundColor: '#FFFFFF',
          titleColor: '#1EACB5',
          messageColor: '#333333',
          buttonColor: '#015D70'
        });
      } else {
        showAlert(`퇴근 완료! (${time})`, '퇴근 완료', 'success', {
          backgroundColor: '#FFFFFF',
          titleColor: '#1EACB5',
          messageColor: '#333333',
          buttonColor: '#015D70'
        });
      }
      
      setLoading(false);
    })
    .catch(err => {
      console.error('퇴근 기록 실패:', err);
      showAlert(`퇴근 기록 처리 중 오류가 발생했습니다: ${err.message}`, '오류', 'error', {
        backgroundColor: '#FFFFFF',
        titleColor: '#1EACB5',
        messageColor: '#333333',
        buttonColor: '#015D70'
      });
      handleApiError(err, '퇴근');
      
      // 오류 발생 시에도 UI 업데이트 (개발 편의를 위해)
      setAttendanceStatus({
        ...attendanceStatus,
        isWorking: false,
        checkOutTime: time,
        isEarlyLeave: isEarlyLeave
      });
      
      setLoading(false);
    });
  };
  
  // 퇴근 처리 함수
  const handleCheckOut = (time, isEarlyLeave) => {
    // 조기 퇴근인 경우 확인 대화상자 표시
    if (isEarlyLeave) {
      showConfirm(
        '정규 퇴근 시간(18:00) 이전일 경우 조퇴 처리됩니다. 계속하시겠습니까?',
        () => processCheckOut(time, true),
        '조퇴 확인',
        'warning',
        {
          backgroundColor: '#FFFFFF',
          titleColor: '#1EACB5',
          messageColor: '#333333',
          buttonColor: '#015D70'
        }
      );
    } else {
      // 정상 퇴근인 경우 바로 처리
      processCheckOut(time, false);
    }
  };
  
  // 출퇴근 버튼 클릭
  const handleAttendanceToggle = () => {
    setLoading(true);
    
    const attendanceInfo = checkAttendanceTime();
    const { time, isLate, isEarlyLeave } = attendanceInfo;
    
    if (!attendanceStatus.isWorking) {
      // 지각인 경우 경고 표시 후 출근 처리
      if (isLate) {
        showConfirm(
          `현재 시간은 09:00 이후입니다. 지각으로 처리됩니다. (${time})`,
          () => handleCheckIn(time, true),
          '지각 확인',
          'warning',
          {
            backgroundColor: '#FFFFFF',
            titleColor: '#1EACB5',
            messageColor: '#333333',
            buttonColor: '#015D70'
          }
        );
      } else {
        // 정상 출근
        handleCheckIn(time, false);
      }
    } else {
      // 퇴근 처리
      handleCheckOut(time, isEarlyLeave);
    }
  };
  
  // 연차 신청 모달 닫기
  const handleCloseLeaveModal = () => {
    setLeaveModal({
      open: false,
      reason: '',
      submitting: false
    });
  };

  // 연차 신청 처리
  const handleLeaveRequest = () => {
    if (!leaveModal.reason.trim()) {
      showAlert('연차 사유를 입력해주세요.', '알림', 'warning');
      return;
    }

    setLeaveModal(prev => ({ ...prev, submitting: true }));

    // API 호출
    axios.post('/api/hr/annual-leave/request', {
      empId: info?.empId,
      reason: leaveModal.reason
    })
    .then(res => {
      console.log('연차 신청 응답:', res.data);
      
      showAlert('연차가 신청되었습니다.', '신청 완료', 'success');
      handleCloseLeaveModal();
      
      // 오늘 날짜로 연차 신청 정보 생성
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      // 연차 신청 페이지로 이동하고 페이지 새로고침
      navigate('/headquarters/hr/annual-leave');
    })
    .catch(err => {
      console.error('연차 신청 실패:', err);
      
      let errorMessage = '연차 신청에 실패했습니다.';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      
      showAlert(errorMessage, '오류', 'error');
      setLeaveModal(prev => ({ ...prev, submitting: false }));
    });
  };
  
  const renderAttendanceInfo = () => (
    <Paper elevation={3} sx={{ borderRadius: 2, p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          근태 정보
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4}>
              <Box>
                <Typography variant="caption" color="text.secondary">근무 일수</Typography>
                <Typography variant="h6" fontWeight="medium">{totalDays}일</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Box>
                <Typography variant="caption" color="text.secondary">지각</Typography>
                <Typography variant="h6" fontWeight="medium">{lateDays}회</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Box>
                <Typography variant="caption" color="text.secondary">결근</Typography>
                <Typography variant="h6" fontWeight="medium">{absentDays}일</Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">잔여 연차</Typography>
            <Typography variant="h6" fontWeight="medium">{annualRemain}/{annualTotal}일</Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ position: 'relative', width: 120, height: 120 }}>
            {/* 배경 원 */}
            <Box sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '12px solid #e0e0e0'
            }} />
            
            {/* 진행 원 */}
            <Box sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '12px solid #2563A6',
              borderTopColor: attendanceStatus.isWorking ? '#2563A6' : '#FFCC80',
              borderRightColor: attendanceStatus.isWorking ? '#2563A6' : '#FFCC80',
              borderBottomColor: attendanceStatus.isWorking ? '#2563A6' : '#FFCC80',
              transform: 'rotate(-45deg)'
            }} />
            
            {/* 출퇴근 버튼 */}
            <Box 
              component={Button}
              onClick={handleAttendanceToggle}
              disabled={loading}
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                bgcolor: 'transparent',
                border: 'none',
                '&:hover': {
                  bgcolor: 'rgba(37, 99, 166, 0.1)',
                },
                '&:disabled': {
                  bgcolor: 'rgba(0, 0, 0, 0.05)',
                }
              }}
            >
              {loading ? (
                <CircularProgress size={30} sx={{ color: '#2563A6' }} />
              ) : (
                <>
                  <PersonIcon sx={{ color: '#2563A6', fontSize: 30 }} />
                  <Typography variant="caption" fontWeight="bold" color="#2563A6">
                    {attendanceStatus.isWorking ? '퇴근' : '출근'}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
      
      {/* 출근/퇴근 상태 표시 */}
      {(attendanceStatus.checkInTime || attendanceStatus.checkOutTime) && (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {attendanceStatus.checkInTime && (
            <Typography variant="caption" color="text.secondary">
              출근: {attendanceStatus.checkInTime}
              {attendanceStatus.isLate && ' (지각)'}
            </Typography>
          )}
          {attendanceStatus.checkOutTime && (
            <Typography variant="caption" color="text.secondary">
              퇴근: {attendanceStatus.checkOutTime}
              {attendanceStatus.isEarlyLeave && ' (조퇴)'}
            </Typography>
          )}
        </Box>
      )}
      
      {/* 커스텀 알림창 */}
      <Dialog
        open={dialog.open}
        onClose={dialog.showCancel ? dialog.onCancel : dialog.onConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            backgroundColor: dialog.backgroundColor || '#ffffff',
            borderRadius: '12px',
            padding: '8px',
            maxWidth: '400px',
            minWidth: '320px',
            boxShadow: '0px 8px 24px rgba(1, 93, 112, 0.15)',
            border: '1px solid rgba(30, 172, 181, 0.1)'
          }
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ 
          display: 'flex', 
          alignItems: 'center',
          pb: 1,
          color: dialog.titleColor || '#1EACB5',
          fontWeight: 'bold',
          fontSize: '1.2rem'
        }}>
          {dialog.type === 'warning' && <WarningIcon sx={{ color: dialog.titleColor || '#1EACB5', mr: 1 }} />}
          {dialog.type === 'success' && <CheckCircleIcon sx={{ color: dialog.titleColor || '#1EACB5', mr: 1 }} />}
          {dialog.type === 'error' && <ErrorIcon sx={{ color: dialog.titleColor || '#1EACB5', mr: 1 }} />}
          {dialog.type === 'info' && <PersonIcon sx={{ color: dialog.titleColor || '#1EACB5', mr: 1 }} />}
          {dialog.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ 
            color: dialog.messageColor || '#333333',
            fontWeight: 'medium',
            fontSize: '1rem',
            lineHeight: 1.5
          }}>
            {dialog.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '16px' }}>
          {dialog.showCancel && (
            <Button 
              onClick={dialog.onCancel} 
              sx={{
                color: '#777777',
                borderRadius: '8px',
                fontWeight: 'medium',
                textTransform: 'none',
                padding: '8px 16px',
                border: '1px solid #dddddd',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  borderColor: '#cccccc'
                }
              }}
            >
              {dialog.cancelText}
            </Button>
          )}
          <Button 
            onClick={dialog.onConfirm} 
            variant="contained"
            autoFocus
            sx={{
              backgroundColor: dialog.buttonColor || '#015D70',
              color: '#ffffff',
              borderRadius: '8px',
              fontWeight: 'medium',
              textTransform: 'none',
              padding: '8px 20px',
              boxShadow: '0px 3px 6px rgba(1, 93, 112, 0.2)',
              '&:hover': {
                backgroundColor: '#014D5E',
                boxShadow: '0px 4px 8px rgba(1, 93, 112, 0.3)',
              }
            }}
          >
            {dialog.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
  
  const renderSalaryInfo = () => (
    <Paper 
      elevation={3} 
      sx={{ 
        borderRadius: 2, 
        p: 3,
        mb: 3
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 2 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PaymentsIcon sx={{ color: '#2563A6', mr: 1 }} />
          <Typography variant="h6" fontWeight="bold">급여 내역</Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate('/headquarters/hr/my-salary')}
          startIcon={<PaymentsIcon />}
        >
          급여내역
        </Button>
      </Box>
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">급여일</Typography>
            <Typography variant="h6" fontWeight="medium">{info?.salaryDay || '-'}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="caption" color="text.secondary">계좌/은행</Typography>
            <Typography variant="h6" fontWeight="medium">
              {info?.accountInfo || '-'}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
  
  return (
    <>
      {type === 'attendance' ? renderAttendanceInfo() : renderSalaryInfo()}
      
      {/* 연차 신청 모달 */}
      <Dialog 
        open={leaveModal.open} 
        onClose={handleCloseLeaveModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#1EACB5', color: 'white', fontWeight: 'bold' }}>
          연차 신청
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 1 }}>
          <TextField
            label="연차 사유"
            multiline
            rows={4}
            fullWidth
            value={leaveModal.reason}
            onChange={(e) => setLeaveModal(prev => ({ ...prev, reason: e.target.value }))}
            placeholder="연차 사유를 입력해주세요"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleCloseLeaveModal}
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
            onClick={handleLeaveRequest}
            variant="contained"
            disabled={leaveModal.submitting}
            sx={{ 
              bgcolor: '#015D70', 
              '&:hover': { bgcolor: '#014D5E' },
              borderRadius: '8px',
              textTransform: 'none'
            }}
          >
            {leaveModal.submitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : '신청하기'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default MyCon;
