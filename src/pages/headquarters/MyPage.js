import React, { useEffect, useState, useRef } from 'react';
import { Box, Grid, Typography, CircularProgress, Paper, Button } from '@mui/material';
import MyCom from '../../components/headquarters/MyCom';
import MyCon from '../../containers/headquarters/MyCon';
import CalendarBox from '../../containers/headquarters/CalendarBox';
import EventIcon from '@mui/icons-material/Event';
import axios from '../../service/axiosInstance';
import { useParams } from 'react-router-dom';

const MyPage = () => {
  const { empId } = useParams();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const myConRef = useRef(null);
  const calendarRef = useRef(null);

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

  // 연차 신청 모달 열기 함수
  const handleOpenLeaveModal = () => {
    console.log("연차 신청 모달 열기 함수 호출됨");
    
    if (myConRef.current && myConRef.current.handleOpenLeaveModal) {
      // 날짜 정보 전달 없이 단순히 모달 열기
      myConRef.current.handleOpenLeaveModal();
    } else {
      console.error("연차 신청 모달을 열 수 없습니다. myConRef:", myConRef.current);
    }
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
            {/* 왼쪽: 사원 프로필 */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper 
                elevation={0} 
                sx={{ 
                  borderRadius: 3, 
                  p: 3,
                  height: '100%',
                  border: '1px solid #eaeef3',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
                  backgroundColor: '#fff'
                }}
              >
                <MyCom info={info} />
              </Paper>
            </Grid>
            
            {/* 오른쪽: 컨텐츠 영역 */}
            <Grid item xs={12} md={8} lg={9}>
              <Grid container spacing={4} sx={{ height: '100%' }}>
                {/* 왼쪽 컬럼: 근무 이력 관리 + 급여 정보 */}
                <Grid item xs={12} lg={6} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Grid container direction="column" spacing={3} sx={{ height: '100%' }}>
                    {/* 근무 이력 관리 */}
                    <Grid item sx={{ flex: '0 0 auto' }}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 3, 
                          borderRadius: 3,
                          backgroundColor: '#fff',
                          border: '1px solid #eaeef3',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
                          height: '100%'
                        }}
                      >
                        <MyCon ref={myConRef} info={info} type="attendance" />
                      </Paper>
                    </Grid>
                    
                    {/* 급여 정보 */}
                    <Grid item sx={{ flex: '1 1 auto' }}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 3, 
                          borderRadius: 3,
                          backgroundColor: '#fff',
                          border: '1px solid #eaeef3',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <MyCon info={info} type="salary" />
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
                
                {/* 오른쪽 컬럼: 연차 신청 캘린더 + 연차 신청 내역 */}
                <Grid item xs={12} lg={6} sx={{ height: '100%' }}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 3,
                      backgroundColor: '#fff',
                      border: '1px solid #eaeef3',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="#2563A6" sx={{ mb: 2 }}>
                      연차 신청
                    </Typography>
                    
                    {/* 연차 신청 캘린더 */}
                    <Box sx={{ mb: 3 }}>
                      <CalendarBox ref={calendarRef} />
                      
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Button 
                          variant="contained"
                          startIcon={<EventIcon />}
                          onClick={handleOpenLeaveModal}
                          sx={{ 
                            bgcolor: '#6FC3ED',
                            '&:hover': {
                              bgcolor: '#5DB3DD',
                            },
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 'medium',
                            padding: '8px 16px',
                            boxShadow: '0px 3px 6px rgba(111, 195, 237, 0.3)',
                            width: '100%',
                          }}
                        >
                          연차 신청하기
                        </Button>
                      </Box>
                    </Box>
                    
                    {/* 신청한 연차 정보 */}
                    <Box sx={{ mt: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" fontWeight="bold" color="#2563A6" sx={{ mb: 2 }}>
                        연차 신청 내역
                      </Typography>
                      
                      <Box 
                        sx={{ 
                          border: '1px solid #e0e0e0', 
                          borderRadius: 2, 
                          p: 2,
                          backgroundColor: '#F8FAFB',
                          flex: 1,
                          overflow: 'auto'
                        }}
                      >
                        {/* 여기에 연차 신청 내역 표시 - 수정 */}
                        <MyCon ref={myConRef} info={info} type="leave-history" />
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default MyPage;