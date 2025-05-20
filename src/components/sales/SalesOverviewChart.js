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
const SalesOverviewChart = ({ data, height = 220 }) => {
  if (!data || !data.chartData || !Array.isArray(data.chartData) || data.chartData.length === 0 || !data.summary) {
    return (
      <Card sx={{ width: '100%', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <CardHeader 
          title={<Typography variant="h6" sx={{ fontWeight: 600 }}>매출 개요</Typography>}
          subheader={<Typography variant="body2" color="text.secondary">기간 내 매출 추이</Typography>}
        />
        <Divider />
        <CardContent sx={{ p: 2 }}>
          <Typography variant="body1" align="center" sx={{ py: 6 }}>
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
      <Card sx={{ width: '100%', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <CardHeader 
          title={<Typography variant="h6" sx={{ fontWeight: 600 }}>매출 개요</Typography>}
          subheader={<Typography variant="body2" color="text.secondary">기간 내 매출 추이</Typography>}
        />
        <Divider />
        <CardContent sx={{ p: 2 }}>
          <Typography variant="body1" align="center" sx={{ py: 6 }}>
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
        backgroundColor: 'rgba(53, 162, 235, 0.2)',
        borderColor: 'rgba(53, 162, 235, 0.8)',
        tension: 0.4
      }
    ]
  };

  // 차트 옵션
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#555',
        bodyColor: '#333',
        borderColor: 'rgba(53, 162, 235, 0.8)',
        borderWidth: 1,
        titleFont: {
          size: 13,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        },
        padding: 10,
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
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
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
  const growthColor = growthRate > 0 ? '#2e7d32' : growthRate < 0 ? '#d32f2f' : '#666';
  const growthBgColor = growthRate > 0 ? 'rgba(46, 125, 50, 0.1)' : growthRate < 0 ? 'rgba(211, 47, 47, 0.1)' : 'rgba(0, 0, 0, 0.05)';

  return (
    <Card sx={{ width: '100%', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
      <CardHeader 
        title={<Typography variant="h6" sx={{ fontWeight: 600 }}>매출 개요</Typography>}
        subheader={<Typography variant="body2" color="text.secondary">기간 내 매출 추이</Typography>}
      />
      <Divider />
      <CardContent sx={{ p: 2 }}>
        {/* 요약 박스: 한 줄로 깔끔하게 */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1, minWidth: 100, py: 1, px: 2, borderRadius: 1, bgcolor: 'rgba(53, 162, 235, 0.08)' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>총 매출</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{formatNumber(Math.round(totalSales))}원</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 100, py: 1, px: 2, borderRadius: 1, bgcolor: 'rgba(53, 162, 235, 0.08)' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>총 거래 건수</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{formatNumber(totalTransactions)}건</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 100, py: 1, px: 2, borderRadius: 1, bgcolor: 'rgba(53, 162, 235, 0.08)' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>평균 객단가</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{formatNumber(Math.round(averageTransaction))}원</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 100, py: 1, px: 2, borderRadius: 1, bgcolor: growthBgColor }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>전기 대비</Typography>
            <Typography variant="h6" sx={{ color: growthColor, fontWeight: 600 }}>
              {growthRate > 0 ? '+' : ''}{growthRate.toFixed(1)}%
            </Typography>
          </Box>
        </Box>
        {/* 차트: 최대한 넓게 */}
        <Box sx={{ width: '100%', height, mt: 2 }}>
          <Line data={chartData} options={chartOptions} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SalesOverviewChart; 