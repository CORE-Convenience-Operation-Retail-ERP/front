import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import MyCom from '../../components/headquarters/MyCom';
import MyCon from '../../containers/headquarters/MyCon';
import CalendarBox from '../../containers/headquarters/CalendarBox';
import axios from '../../service/axiosInstance';

const MyPage = () => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    axios.get("/api/hr/my-page", { withCredentials: true }) // ✅ 세션 쿠키 포함 설정
      .then(res => {
        console.log("근무정보 응답:", res.data);
        setInfo(res.data); // ✅ 응답 데이터로 상태 설정
      })
      .catch(err => {
        console.error("API 실패:", err);
        // ✅ 실패 시 임시 데이터 fallback (선택 사항)
        setInfo({ empName: "홍길동" });
      });
  }, []);

  if (!info) return <div>Loading...</div>; // ✅ 로딩 처리

  return (
    <Box sx={{ flex: 1, p: 5, backgroundColor: '#fff', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, textAlign: 'center' }}>
        근무 이력 관리
      </Typography>
      <Grid container spacing={4} alignItems="stretch">
        <Grid item xs={12} md={4}>
          <MyCom info={info} />
        </Grid>
        <Grid item xs={12} md={5}>
          <MyCon info={info} onlyTop />
        </Grid>
        <Grid item xs={12} md={3}>
          <CalendarBox />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MyPage;