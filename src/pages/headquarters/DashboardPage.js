import React from 'react';
import { Grid, Paper } from '@mui/material';

// 위젯 컴포넌트들은 나중에 components/widgets 폴더에 분리하여 구현
const DashboardWidget = ({ children }) => (
  <Paper sx={{ p: 2, height: '100%' }}>
    {children}
  </Paper>
);

const DashboardPage = () => {
  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      <Grid item xs={12} md={6} lg={3}>
        <DashboardWidget>
          매출 현황 위젯
        </DashboardWidget>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <DashboardWidget>
          직원 현황 위젯
        </DashboardWidget>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <DashboardWidget>
          재고 현황 위젯
        </DashboardWidget>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <DashboardWidget>
          공지사항 위젯
        </DashboardWidget>
      </Grid>
      <Grid item xs={12} lg={8}>
        <DashboardWidget>
          월별 매출 차트
        </DashboardWidget>
      </Grid>
      <Grid item xs={12} lg={4}>
        <DashboardWidget>
          실시간 알림
        </DashboardWidget>
      </Grid>
    </Grid>
  );
};

export default DashboardPage; 