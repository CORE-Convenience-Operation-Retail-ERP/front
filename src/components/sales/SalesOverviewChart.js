import React from 'react';
import { Card, CardContent, CardHeader, Divider, Box, Typography, Grid } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// 천 단위 콤마 포맷 함수
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * 전체 통합 통계 차트 컴포넌트
 */
const SalesOverviewChart = ({ data }) => {
  if (!data || !data.chartData || !Array.isArray(data.chartData) || data.chartData.length === 0 || !data.summary) {
    return (
      <Card>
        <CardHeader 
          title="매출 개요" 
          subheader="기간 내 매출 추이" 
        />
        <Divider />
        <CardContent>
          <Typography variant="body1" align="center">
            데이터가 없습니다.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // 차트 데이터 유효성 검증
  const validChartData = data.chartData.filter(item => 
    item && item.label && typeof item.value === 'number'
  );

  if (validChartData.length === 0) {
    return (
      <Card>
        <CardHeader 
          title="매출 개요" 
          subheader="기간 내 매출 추이" 
        />
        <Divider />
        <CardContent>
          <Typography variant="body1" align="center">
            유효한 데이터가 없습니다.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // 차트 데이터 준비
  const chartData = {
    labels: validChartData.map(item => item.label),
    datasets: [
      {
        label: '매출',
        data: validChartData.map(item => item.value),
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4
      }
    ]
  };

  // 차트 옵션
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatNumber(context.parsed.y) + '원';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M';
            } else if (value >= 1000) {
              return (value / 1000).toFixed(0) + 'K';
            }
            return value;
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  // 요약 데이터
  const { totalSales, totalTransactions, averageTransaction, previousPeriodSales, growthRate } = data.summary;

  // 성장률 색상 결정
  const growthColor = growthRate > 0 ? 'success.main' : growthRate < 0 ? 'error.main' : 'text.secondary';

  return (
    <Card>
      <CardHeader 
        title="매출 개요" 
        subheader="기간 내 매출 추이" 
      />
      <Divider />
      <CardContent>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid xs={12} sm={6} md={3}>
            <Box sx={{ p: 2, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                총 매출
              </Typography>
              <Typography variant="h6">
                {formatNumber(Math.round(totalSales))}원
              </Typography>
            </Box>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Box sx={{ p: 2, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                총 거래 건수
              </Typography>
              <Typography variant="h6">
                {formatNumber(totalTransactions)}건
              </Typography>
            </Box>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Box sx={{ p: 2, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                평균 객단가
              </Typography>
              <Typography variant="h6">
                {formatNumber(Math.round(averageTransaction))}원
              </Typography>
            </Box>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Box sx={{ p: 2, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                전기 대비 성장률
              </Typography>
              <Typography variant="h6" color={growthColor}>
                {growthRate > 0 ? '+' : ''}{growthRate.toFixed(1)}%
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ height: 350 }}>
          <Line data={chartData} options={chartOptions} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SalesOverviewChart; 