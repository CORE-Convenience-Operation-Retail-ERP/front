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
    axios.get("/api/hr/my-page")
      .then(res => {
        console.log("사용자 정보 응답:", res.data);
        setInfo(res.data); 
        setLoading(false);
      })
      .catch(err => {
        console.error("API 실패:", err);
        setError("정보를 불러오는데 실패했습니다.");
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress />
    </Box>
  );

  if (error && !info) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'error.main' }}>
      <Typography variant="h6">{error}</Typography>
    </Box>
  );

  return (
    <Box sx={{ flex: 1, p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, ml: 1 }}>
        근무 이력 관리
      </Typography>
      
      <Grid container spacing={3}>
        {/* 왼쪽 영역: 프로필 정보 */}
        <Grid item xs={12} md={5} lg={4}>
          <MyCom info={info} />
        </Grid>
        
        {/* 오른쪽 영역: 근태관리, 급여내역, 캘린더 */}
        <Grid item xs={12} md={7} lg={8}>
          <Grid container spacing={3}>
            {/* 근태 관리 */}
            <Grid item xs={12}>
              <MyCon info={info} type="attendance" />
            </Grid>
            
            {/* 급여 내역 */}
            <Grid item xs={12}>
              <MyCon info={info} type="salary" />
            </Grid>
            
            {/* 캘린더 */}
            <Grid item xs={12}>
              <CalendarBox />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MyPage;