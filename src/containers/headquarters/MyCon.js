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
import DateRangeIcon from '@mui/icons-material/DateRange';

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
    submitting: false
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
    console.log('직원 ID:', info?.empId);
    
    // 직원 ID로 특정 직원의 연차 신청 내역만 가져오기
    axios.get(`/api/hr/annual-leave/employee/${info?.empId}`)
      .then(res => {
        console.log('연차 신청 내역 조회 성공:', res.data);
        console.log('연차 내역 원본 데이터 구조:', JSON.stringify(res.data, null, 2));
        
        // 데이터 변환 및 가공
        const formattedRequests = Array.isArray(res.data) ? res.data.map(req => {
          console.log('각 연차 항목 데이터:', req);
          // 연차 사유 필드명 관련 디버깅
          console.log('연차 사유 필드 확인:', { 
            reqReason: req.reqReason, 
            reason: req.reason, 
            originalReq: req 
          });
          
          // 모든 필드에 대해 null/undefined 체크
          const item = {
            id: req.reqId || Date.now(),
            startDate: '',
            endDate: '',
            requestDate: '',
            reason: req.reqReason || req.reason || '사유 없음', // 다양한 필드명 시도
            status: '대기중'
          };
          
          // 데이터 확인용 로그
          console.log('매핑된 연차 항목:',
            '시작일:', req.reqDate,
            '생성일:', req.createdAt,
            '사유:', req.reqReason || req.reason,
            '상태:', req.reqStatus
          );
          
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
  
  // 연차 신청 모달 열기 - 수정된 버전
  const handleOpenLeaveModal = () => {
    console.log('연차 신청 모달 열기');
    
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
    let titleColor = options.titleColor || '#1E90FF';
    let messageColor = options.messageColor || '#333333';
    let buttonColor = options.buttonColor || '#1E90FF';
    
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
    {backgroundColor = '#FFFFFF', titleColor = '#1E90FF', messageColor = '#333333', buttonColor = '#1E90FF'} = {}
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
    {backgroundColor = '#FFFFFF', titleColor = '#1E90FF', messageColor = '#333333', buttonColor = '#1E90FF'} = {}
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
      titleColor: '#1E90FF',
      messageColor: '#333333',
      buttonColor: '#1E90FF'
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
          titleColor: '#1E90FF',
          messageColor: isLate ? '#333333' : '#333333', 
          buttonColor: '#1E90FF'
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
          titleColor: '#1E90FF',
          messageColor: '#333333',
          buttonColor: '#1E90FF'
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
        titleColor: '#1E90FF',
        messageColor: '#333333',
        buttonColor: '#1E90FF'
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
    setLeaveModal({
      open: false,
      reason: '',
      submitting: false
    });
  };
  
  // 연차 신청 제출 처리 함수
  const handleLeaveRequest = () => {
    if (!leaveModal.reason.trim()) {
      showAlert('연차 신청 사유를 입력해주세요.', '입력 오류', 'warning');
      return;
    }
    
    setLeaveModal(prev => ({ ...prev, submitting: true }));
    
    // 현재 날짜를 YYYY-MM-DD 형식으로 변환
    const today = new Date().toISOString().split('T')[0];
    
    // API 호출
    const data = {
      empId: info?.empId,
      reqDate: today, // 오늘 날짜를 기본값으로 사용
      reqReason: leaveModal.reason,
      reason: leaveModal.reason, // 추가 - 백엔드에서 이 필드명을 사용할 수도 있음
      reqStatus: 0 // 0: 대기중 상태
    };
    
    console.log('연차 신청 데이터:', data);
    
    // Content-Type 헤더 추가 및 요청 형식 명확화
    axios.post('/api/hr/annual-leave/request', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log('연차 신청 성공:', res.data);
        
        // 연차 내역 다시 로드
        fetchLeaveHistory();
        
        // 확인 버튼을 누르면 연차 신청 관리 페이지로 이동하도록 수정
        showConfirm(
          '연차 신청이 완료되었습니다. \n연차 신청 관리 페이지로 이동하시겠습니까?',
          () => navigate('/headquarters/hr/annual-leave'),
          '신청 완료',
          'success',
          {
            backgroundColor: '#FFFFFF',
            titleColor: '#1E90FF',
            messageColor: '#333333',
            buttonColor: '#1E90FF'
          }
        );
        
        // 모달 닫기
        handleCloseLeaveModal();
        
        // 제출 상태 초기화
        setLeaveModal(prev => ({ ...prev, submitting: false }));
      })
      .catch(err => {
        console.error('연차 신청 실패:', err, '요청 데이터:', data);
        
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
            requestDate: new Date()  // today가 아닌 Date 객체로 수정
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
              lineHeight: 1.5,
              whiteSpace: 'pre-line'
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
                backgroundColor: dialog.buttonColor || '#1E90FF',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: 'medium',
                textTransform: 'none',
                padding: '8px 20px',
                boxShadow: '0px 3px 6px rgba(1, 93, 112, 0.2)',
                '&:hover': {
                  backgroundColor: '#4b6beb',
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
              maxWidth: '400px',
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
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              id="reason"
              label="연차 신청 사유"
              type="text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={leaveModal.reason}
              onChange={(e) => setLeaveModal(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="연차 신청 사유를 입력해주세요"
              sx={{ mb: 1 }}
            />
          </DialogContent>
          <DialogActions sx={{ padding: '8px 16px 16px' }}>
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
    // 은행 ID에 따른 은행명 매핑
    const getBankName = (bankId) => {
      const bankMap = {
        1: '국민',
        2: '하나', // 수정: 2는 하나은행
        3: '신한'
      };
      return bankMap[bankId] || '기타';
    };

    // 계좌정보 포맷팅
    const formatAccountInfo = () => {
      if (info?.accountInfo) {
        // 계좌번호와 은행명 분리
        const parts = info.accountInfo.split(' ');
        if (parts.length >= 2) {
          let bankName = parts[1];
          if (bankName.includes('우리')) bankName = '하나';
          // 국민, 신한은 그대로, 하나/우리만 하나로 강제
          return `${parts[0]} ${bankName}`;
        }
        return info.accountInfo;
      }
      return '-';
    };

    // 급여일 포맷팅 (매월 5일 형태로 변환)
    const formatSalaryDay = () => {
      if (!info?.salaryDay) return '-';
      // 이미 '매월'이 포함되어 있으면 그대로
      if (String(info.salaryDay).includes('매월')) return info.salaryDay;
      // 날짜 형식(ISO 등)인 경우
      if (String(info.salaryDay).includes('T') || String(info.salaryDay).includes('-')) {
        try {
          const date = new Date(info.salaryDay);
          if (!isNaN(date.getDate())) {
            return `매월 ${date.getDate()}일`;
          }
        } catch (e) {}
      }
      // 숫자만 있는 경우
      if (/^\d+$/.test(String(info.salaryDay))) {
        return `매월 ${info.salaryDay}일`;
      }
      return info.salaryDay;
    };

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
              <Typography variant="h6" fontWeight="medium">{formatSalaryDay()}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">계좌/은행</Typography>
              <Typography variant="h6" fontWeight="medium">
                {formatAccountInfo()}
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
            연차 신청에 대한 문의는 인사팀에게 문의하세요.
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
                      {item.reason || '사유 없음'}
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