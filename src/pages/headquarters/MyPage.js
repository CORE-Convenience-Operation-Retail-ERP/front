import React, { useEffect, useState, useRef } from 'react';
import { Box, Grid, Typography, CircularProgress, Paper, Button } from '@mui/material';
import MyCom from '../../components/headquarters/MyCom';
import MyCon from '../../containers/headquarters/MyCon';
import CalendarBox from '../../containers/headquarters/CalendarBox';
import EventIcon from '@mui/icons-material/Event';
import axios from '../../service/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const MyPage = () => {
  const { empId } = useParams();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const myConRef = useRef(null);
  const calendarRef = useRef(null);
  // 연차신청 상태
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인한 사용자 정보 가져오기
    setLoading(true);
    
    // 토큰 확인 (디버깅용)
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("토큰이 없습니다. 로그인이 필요합니다.");
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }
    
    console.log("API 호출 전 토큰:", token.substring(0, 20) + "...");
    
    // 임시 테스트 데이터 (API 실패 시 사용)
    const mockData = {
      empId: 15,
      empName: "홍길동",
      empRole: "본사",
      deptName: "인사팀",
      empPhone: "010-1234-5678",
      empEmail: "employee@example.com",
      empAddr: "서울특별시 강남구 테헤란로 123",
      empImg: "",
      attendanceDays: 245,
      lateCount: 3,
      absentCount: 2,
      annualLeaveRemain: 8,
      annualLeaveTotal: 15,
      salaryDay: "매월 25일",
      accountInfo: "123-456-78910 국민"
    };

    const url = empId ? `/api/hr/my-page/${empId}` : "/api/hr/my-page";
    axios.get(url)
      .then(res => {
        console.log("사용자 정보 응답:", res.data);
        console.log("근무일수 확인:", res.data.attendanceDays, typeof res.data.attendanceDays);
        setInfo(res.data); 
        setLoading(false);
      })
      .catch(err => {
        console.error("API 실패:", err);
        
        // 개발을 위해 임시 데이터 사용
        console.log("임시 데이터를 사용합니다.");
        setInfo(mockData);
        
        // 응답 상태코드 및 에러 메시지 로깅
        if (err.response) {
          console.error(`응답 상태 코드: ${err.response.status}`);
          console.error(`응답 데이터:`, err.response.data);
        }
        
        setError(`서버에서 정보를 불러오는데 실패했습니다. (${err.response?.status || "네트워크 오류"}) 임시 데이터를 사용합니다.`);
        setLoading(false);
      });
  }, [empId]);

  // 연차신청 함수
  const handleLeaveRequest = () => {
    if (!reason.trim()) {
      alert('연차 신청 사유를 입력해주세요.');
      return;
    }
    setSubmitting(true);
    const days = endDate.diff(startDate, 'day') + 1;
    const data = {
      empId: info?.empId,
      reason,
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
      days
    };
    axios.post('/api/hr/annual-leave/request', data, { headers: { 'Content-Type': 'application/json' } })
      .then(() => {
        setReason('');
        setSubmitting(false);
        setOpenDialog(true);
      })
      .catch(err => {
        let errorMessage = '연차 신청 중 오류가 발생했습니다.';
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
        alert(errorMessage);
        setSubmitting(false);
      });
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ 
      background: '#FFFFFF', 
      minHeight: '100vh' 
    }}>
      <Box sx={{ width: '90%', maxWidth: 2200, mx: 'auto', mt: 4, mb: 7 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{
            fontWeight: 'bold',
            fontSize: 30,
            color: '#2563A6',
            letterSpacing: '-1px',
            ml: 15
          }}>
            마이페이지
          </Typography>
        </Box>
      </Box>

      {error && (
        <Typography variant="body2" color="error.main" sx={{ width: '90%', maxWidth: 1200, mx: 'auto', mb: 2 }}>
          {error}
        </Typography>
      )}
      
      {info && (
        <Box sx={{ width: '90%', maxWidth: 1200, mx: 'auto' }}>
          <Grid container spacing={4}>
            {/* 프로필 */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid #eaeef3',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
                  backgroundColor: '#fff',
                  minHeight: 577,
                }}
              >
                <MyCom info={info} />
              </Paper>
            </Grid>
            {/* 근무/급여 */}
            <Grid item xs={12} md={8} lg={6}>
              <Grid container spacing={3} direction="column" sx={{ height: '100%' }}>
                <Grid item>
                  <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #eaeef3', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)', backgroundColor: '#fff' }}>
                    <MyCon ref={myConRef} info={info} type="attendance" />
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #eaeef3', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)', backgroundColor: '#fff' }}>
                    <MyCon info={info} type="salary" />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            {/* 연차신청 */}
            <Grid item xs={12} md={12} lg={3}>
              <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #eaeef3', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)', backgroundColor: '#fff' }}>
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 380,
                    margin: '0 auto',
                    background: '#f6fbff',
                    borderRadius: 2,
                    border: '1px solid #e5f3ff',
                    p: 3,
                    minHeight: 525,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" color="#2563A6" sx={{ mb: 3, textAlign: 'center' }}>
                    연차 신청
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <DatePicker
                        label="시작일"
                        value={startDate}
                        onChange={date => setStartDate(date)}
                        disablePast
                        sx={{ flex: 1, background: '#fff', borderRadius: 1 }}
                      />
                      <DatePicker
                        label="종료일"
                        value={endDate}
                        onChange={date => setEndDate(date)}
                        disablePast
                        minDate={startDate}
                        sx={{ flex: 1, background: '#fff', borderRadius: 1 }}
                      />
                    </Box>
                  </LocalizationProvider>
                  {/* 총 연차 사용일수 박스 */}
                  <Box
                    sx={{
                      background: '#fff',
                      border: '1px solid #e5eaf2',
                      borderRadius: 2,
                      p: 1.2,
                      mb: 2,
                      mt: 0.5,
                      textAlign: 'center',
                      boxShadow: '0 0 0 1px #e5eaf2',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center', mb: 0.7 }}>
                      <EventIcon sx={{ color: '#3b5998', fontSize: 19 }} />
                      <Typography fontWeight="bold" color="#2563A6" sx={{ fontSize: 15 }}>
                        선택한 연차 기간
                      </Typography>
                    </Box>
                    <Typography sx={{ color: '#222', fontSize: 14, mb: 0.7 }}>
                      {startDate && endDate ? `${startDate.format('YYYY년 MM월 DD일')} ~ ${endDate.format('YYYY년 MM월 DD일')}` : '기간을 선택하세요'}
                    </Typography>
                    <Box sx={{
                      background: '#e9eef6',
                      borderRadius: 1.5,
                      fontWeight: 'bold',
                      color: '#3b5998',
                      py: 0.4,
                      mt: 0.7,
                      fontSize: 15,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      총 {startDate && endDate ? `${endDate.diff(startDate, 'day') + 1}일` : '0일'}
                    </Box>
                  </Box>
                  {/* 연차 사유 입력란 */}
                  <Typography variant="subtitle2" color="text.secondary" fontWeight="bold" sx={{ mb: 1, mt: 1 }}>
                    연차 사유
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="연차 신청 사유를 입력하세요"
                    sx={{ mb: 2, background: '#fff', borderRadius: 1 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleLeaveRequest}
                    disabled={submitting}
                    startIcon={<EventIcon sx={{ fontSize: 22 }} />}
                    sx={{
                      backgroundColor: '#6FC3ED',
                      color: '#fff',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      fontSize: 18,
                      mt: 2,
                      width: '100%',
                      boxShadow: '0 2px 8px 0 #e5eaf2',
                      py: 1.5,
                      px: 3,
                      '&:hover': {
                        backgroundColor: '#5DB3DD',
                      }
                    }}
                  >
                    {submitting ? '신청 중...' : '연차 신청하기'}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#2563A6' }}>연차 신청 완료</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 1, mb: 1 }}>
            연차 신청이 완료 되었습니다.<br />신청 내역으로 이동하시겠습니까?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">취소</Button>
          <Button onClick={() => { setOpenDialog(false); navigate('/headquarters/hr/annual-leave'); }} color="primary" variant="contained">이동</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyPage;