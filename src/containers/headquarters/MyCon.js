import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography, Divider, Grid, Button, CircularProgress, 
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
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
  console.log("MyCon - 근무일수:", totalDays, "원본 데이터:", info?.attendanceDays, "타입:", typeof info?.attendanceDays);
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
    submitting: false,
    selectedDate: new Date(),
  });
  
  // 연차 신청 내역 상태 추가
  const [leaveHistory, setLeaveHistory] = useState([]);
  
  // 컴포넌트 마운트 시 연차 신청 내역 로드
  useEffect(() => {
    if (type === "attendance" && info?.empId) {
      fetchLeaveHistory();
    }
  }, [type, info?.empId]);
  
  // 연차 신청 내역 로드 함수
  const fetchLeaveHistory = () => {
    // API 호출로 연차 신청 내역 가져오기
    console.log('연차 신청 내역을 불러오는 중...');
    
    // 직원 ID로 특정 직원의 연차 신청 내역만 가져오기
    axios.get(`/api/hr/annual-leave/employee/${info?.empId}`)
      .then(res => {
        console.log('연차 신청 내역 조회 성공:', res.data);
        
        // 데이터 변환 및 가공
        const formattedRequests = Array.isArray(res.data) ? res.data.map(req => {
          // 모든 필드에 대해 null/undefined 체크
          const item = {
            id: req.reqId || Date.now(),
            startDate: '',
            endDate: '',
            requestDate: '',
            reason: req.reqReason || '',
            status: '대기중'
          };
          
          // 날짜 형식 안전하게 변환
          try {
            if (req.createdAt) {
              item.requestDate = new Date(req.createdAt);
            }
            
            if (req.reqDate) {
              item.startDate = item.endDate = new Date(req.reqDate);
            }
          } catch (e) {
            console.error('날짜 변환 오류:', e);
            item.requestDate = item.requestDate || new Date();
            item.startDate = item.startDate || new Date();
            item.endDate = item.endDate || new Date();
          }
          
          // 상태 변환 - 문자열/숫자 모두 처리
          const status = Number(req.reqStatus);
          if (status === 1) {
            item.status = '승인';
          } else if (status === 2) {
            item.status = '반려';
          } else {
            item.status = '대기중';
          }
          
          return item;
        }) : [];
        
        // 정렬: 최신 신청 항목이 위로 오도록
        formattedRequests.sort((a, b) => {
          return new Date(b.requestDate) - new Date(a.requestDate);
        });
        
        setLeaveHistory(formattedRequests);
      })
      .catch(err => {
        console.error('연차 신청 내역 조회 실패:', err);
        // 개발용 임시 데이터
        const currentDate = new Date();
        const mockHistory = [
          {
            id: 1,
            startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 5),
            endDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 5),
            reason: '개인 사유',
            status: '대기중',
            requestDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 2)
          }
        ];
        setLeaveHistory(mockHistory);
      });
  };
  
  // 연차 신청 모달 열기
  const handleOpenLeaveModal = () => {
    setLeaveModal({
      open: true,
      reason: '',
      submitting: false,
      selectedDate: new Date()
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
  
  // 퇴근 처리 로직 - 핵심 처리만 하고 API 호출은 별도 함수에서
  const processCheckOut = (time, isEarlyLeave) => {
    // 퇴근 시간 설정 및 출근 상태 변경
    setAttendanceStatus({
      ...attendanceStatus,
      isWorking: false,
      checkOutTime: time,
      isEarlyLeave: isEarlyLeave
    });
    
    // 퇴근 완료 알림
    showAlert(
      isEarlyLeave ? `조퇴 처리되었습니다. (${time})` : `퇴근 완료! (${time})`, 
      isEarlyLeave ? '조퇴 알림' : '퇴근 완료', 
      isEarlyLeave ? 'warning' : 'success',
      {
        backgroundColor: '#FFFFFF',
        titleColor: '#1EACB5',
        messageColor: '#333333',
        buttonColor: '#015D70'
      }
    );
  };
  
  // 퇴근 API 호출
  const handleCheckOut = (time, isEarlyLeave) => {
    // 퇴근 API 호출
    axios.post('/api/hr/attendance/check-out', {
      empId: info?.empId,
      checkOutTime: time,
      isEarlyLeave: isEarlyLeave
    })
    .then(res => {
      console.log('퇴근 기록 성공:', res.data);
      processCheckOut(time, isEarlyLeave);
      setLoading(false);
    })
    .catch(err => {
      console.error('퇴근 기록 실패:', err);
      handleApiError(err, '퇴근');
      
      // 개발 편의상 - 에러 발생해도 UI는 업데이트
      processCheckOut(time, isEarlyLeave);
      setLoading(false);
    });
  };
  
  // 출퇴근 토글 함수
  const handleAttendanceToggle = () => {
    if (loading) return;
    
    setLoading(true);
    console.log('출퇴근 상태 전환 요청...');
    
    // 시간 체크
    const { time, isLate, isEarlyLeave } = checkAttendanceTime();
    
    if (attendanceStatus.isWorking) {
      // 퇴근 처리
      handleCheckOut(time, isEarlyLeave);
    } else {
      // 출근 처리
      handleCheckIn(time, isLate);
    }
  };
  
  // 연차 신청 모달 닫기
  const handleCloseLeaveModal = () => {
    setLeaveModal(prev => ({
      ...prev,
      open: false
    }));
  };
  
  // 연차 신청 제출 처리
  const handleLeaveRequest = () => {
    if (!leaveModal.reason.trim()) {
      showAlert('연차 신청 사유를 입력해주세요.', '입력 오류', 'warning');
      return;
    }
    
    setLeaveModal(prev => ({ ...prev, submitting: true }));
    
    // 현재 날짜를 얻기
    const today = new Date();
    
    // 연차 신청 데이터 준비 - API 형식에 맞게 수정
    const leaveData = {
      empId: info?.empId,
      reqDate: dayjs(leaveModal.selectedDate).format('YYYY-MM-DD'),
      reqReason: leaveModal.reason,
      reqStatus: 0  // 초기 상태: 승인 대기
    };
    
    console.log('연차 신청 데이터:', leaveData);
    
    // 연차 신청 API 경로 수정
    axios.post('/api/hr/annual-leave/request', leaveData)
      .then(res => {
        console.log('연차 신청 성공:', res.data);
        
        // 성공 알림
        showAlert('연차 신청이 완료되었습니다.', '신청 완료', 'success');
        
        // 연차 내역 갱신
        fetchLeaveHistory();
        
        // 모달 닫기
        setLeaveModal({
          open: false,
          reason: '',
          submitting: false,
          selectedDate: new Date()
        });
      })
      .catch(err => {
        console.error('연차 신청 실패:', err);
        
        // 서버 오류 메시지 표시
        let errorMessage = '연차 신청 중 오류가 발생했습니다.';
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
        
        // 에러 알림
        showAlert(errorMessage, '신청 오류', 'error');
        
        // 개발용: API 실패해도 임시로 내역 추가 (개발 모드에서만)
        if (process.env.NODE_ENV === 'development') {
          const newLeave = {
            id: Date.now(),  // 임시 ID
            startDate: leaveModal.selectedDate,
            endDate: leaveModal.selectedDate,
            reason: leaveModal.reason,
            status: '대기중',
            requestDate: today
          };
          
          setLeaveHistory(prev => [newLeave, ...prev]);
          
          // 에러 메시지 대신 성공 메시지 표시 (개발용)
          showAlert('연차 신청이 완료되었습니다. (개발 모드)', '신청 완료', 'success');
        }
        
        // 모달 닫기 - 개발 모드가 아니면 오류 발생 시 모달을 닫지 않음
        if (process.env.NODE_ENV === 'development') {
          setLeaveModal({
            open: false,
            reason: '',
            submitting: false,
            selectedDate: new Date()
          });
        } else {
          setLeaveModal(prev => ({ ...prev, submitting: false }));
        }
      });
  };

  // formatter 함수 추가
  const formatDate = (date) => {
    if (!date) return '-';
    try {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    } catch (e) {
      return '-';
    }
  };

  // 출근/퇴근 전체 영역
  if (type === "attendance") {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" color="#2563A6">
            근무 이력 관리
          </Typography>
        </Box>
        
        {/* 출근/퇴근 버튼 */}
        <Box sx={{ 
          p: 2, 
          backgroundColor: '#f6fbff', 
          borderRadius: 2,
          border: '1px solid #e5f3ff',
          mb: 3
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="#2563A6">
              출퇴근 관리
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
                  border: '12px solid #f0f0f0'
                }} />
                
                {/* 진행 원 */}
                <Box sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '12px solid',
                  borderColor: attendanceStatus.isWorking ? '#4CAF50' : '#2563A6',
                  transition: 'border-color 0.3s ease'
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
                    bgcolor: attendanceStatus.isWorking ? 'rgba(76, 175, 80, 0.1)' : 'rgba(37, 99, 166, 0.1)',
                    border: 'none',
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                      bgcolor: attendanceStatus.isWorking ? 'rgba(76, 175, 80, 0.2)' : 'rgba(37, 99, 166, 0.2)',
                    },
                    '&:disabled': {
                      bgcolor: 'rgba(0, 0, 0, 0.05)',
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={30} sx={{ color: attendanceStatus.isWorking ? '#4CAF50' : '#2563A6' }} />
                  ) : (
                    <>
                      {attendanceStatus.isWorking ? (
                        <LogoutIcon sx={{ color: '#4CAF50', fontSize: 30 }} />
                      ) : (
                        <LoginIcon sx={{ color: '#2563A6', fontSize: 30 }} />
                      )}
                      <Typography variant="caption" fontWeight="bold" color={attendanceStatus.isWorking ? '#4CAF50' : '#2563A6'}>
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
        </Box>
        
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
        
        {/* 연차 신청 모달 */}
        <Dialog
          open={leaveModal.open}
          onClose={handleCloseLeaveModal}
          PaperProps={{
            style: {
              borderRadius: '12px',
              padding: '8px',
              maxWidth: '500px',
              minWidth: '320px',
              boxShadow: '0px 8px 24px rgba(111, 195, 237, 0.2)',
              border: '1px solid rgba(111, 195, 237, 0.1)'
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            pb: 1,
            color: '#2563A6',
            fontWeight: 'bold',
            fontSize: '1.2rem'
          }}>
            <CalendarMonthIcon sx={{ color: '#6FC3ED', mr: 1 }} />
            연차 신청
          </DialogTitle>
          <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="연차 사용 날짜"
                value={dayjs(leaveModal.selectedDate)}
                onChange={(newValue) => {
                  setLeaveModal(prev => ({ 
                    ...prev, 
                    selectedDate: newValue ? newValue.toDate() : new Date() 
                  }));
                }}
                sx={{ width: '100%', mt: 2, mb: 2 }}
                minDate={dayjs()}
              />
            </LocalizationProvider>
            <TextField
              autoFocus
              margin="dense"
              id="reason"
              label="연차 신청 사유"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={leaveModal.reason}
              onChange={(e) => setLeaveModal(prev => ({ ...prev, reason: e.target.value }))}
            />
          </DialogContent>
          <DialogActions sx={{ padding: '16px' }}>
            <Button 
              onClick={handleCloseLeaveModal}
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
              취소
            </Button>
            <Button 
              onClick={handleLeaveRequest}
              variant="contained"
              disabled={leaveModal.submitting}
              startIcon={leaveModal.submitting ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{ 
                backgroundColor: '#6FC3ED',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: 'medium',
                textTransform: 'none',
                padding: '8px 20px',
                boxShadow: '0px 3px 6px rgba(111, 195, 237, 0.2)',
                '&:hover': {
                  backgroundColor: '#5DB3DD',
                  boxShadow: '0px 4px 8px rgba(111, 195, 237, 0.3)',
                }
              }}
            >
              신청하기
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
  
  // 급여 정보 영역
  if (type === "salary") {
    return (
      <Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 2 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PaymentsIcon sx={{ color: '#2563A6', mr: 1 }} />
            <Typography variant="h6" fontWeight="bold" color="#2563A6">급여 내역</Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate('/headquarters/hr/my-salary')}
            startIcon={<PaymentsIcon />}
            sx={{
              color: '#2563A6',
              borderColor: '#2563A6',
              '&:hover': {
                borderColor: '#1E5187',
                backgroundColor: 'rgba(37, 99, 166, 0.04)'
              },
              borderRadius: '8px'
            }}
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
      </Box>
    );
  }
  
  // 연차 신청 내역 표시
  if (type === "leave-history") {
    return (
      <>
        {leaveHistory.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            신청한 연차 내역이 없습니다.
          </Typography>
        ) : (
          <TableContainer component={Box} sx={{ boxShadow: 'none' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>날짜</TableCell>
                  <TableCell>사유</TableCell>
                  <TableCell>상태</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveHistory.map((item) => (
                  <TableRow 
                    key={item.id}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { backgroundColor: '#f8fafb' }
                    }}
                  >
                    <TableCell>{formatDate(item.startDate)}</TableCell>
                    <TableCell sx={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.reason}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-block',
                          borderRadius: '4px',
                          px: 1,
                          py: 0.5,
                          fontSize: '0.75rem',
                          fontWeight: 'medium',
                          color: item.status === '승인' ? '#2e7d32' : 
                                 item.status === '반려' ? '#d32f2f' : '#1976d2',
                          bgcolor: item.status === '승인' ? 'rgba(46, 125, 50, 0.1)' : 
                                   item.status === '반려' ? 'rgba(211, 47, 47, 0.1)' : 'rgba(25, 118, 210, 0.1)'
                        }}
                      >
                        {item.status}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </>
    );
  }
  
  // 기본 반환 - 아무 타입도 아닐 경우 null 반환
  return null;
});

export default MyCon;
