import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, CircularProgress, Paper } from '@mui/material';
import MyCom from '../../components/headquarters/MyCom';
import MyCon from '../../containers/headquarters/MyCon';
import CalendarBox from '../../containers/headquarters/CalendarBox';
import axios from '../../service/axiosInstance';

const MyPage = () => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    axios.get("/api/hr/my-page")
      .then(res => {
        console.log("사용자 정보 응답:", res.data);
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
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        근무 이력 관리
      </Typography>
      
      {error && (
        <Typography variant="body2" color="error.main" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      {info && (
        <Grid container spacing={3}>
          {/* 왼쪽: 사원 프로필 */}
          <Grid item xs={12} md={3}>
            <MyCom info={info} />
          </Grid>
          
          {/* 중앙: 근태 정보와 급여 정보 */}
          <Grid item xs={12} md={5}>
            <MyCon info={info} type="attendance" />
            <MyCon info={info} type="salary" />
          </Grid>
          
          {/* 오른쪽: 캘린더 */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                연차 신청 기간
              </Typography>
              <CalendarBox />
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default MyPage;