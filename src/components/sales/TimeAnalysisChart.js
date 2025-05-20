import React from 'react';
import { Card, CardContent, CardHeader, Divider, Box, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// 천 단위 콤마 포맷 함수
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * 시간대별 매출 분석 차트 컴포넌트
 */
const TimeAnalysisChart = ({ data, height = 250 }) => {
  if (!data || !data.chartData || !Array.isArray(data.chartData) || data.chartData.length === 0 || !data.summary) {
    return (
      <Card sx={{ width: '100%', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <CardHeader 
          title={<Typography variant="h6" sx={{ fontWeight: 600 }}>시간대별 매출 분석</Typography>}
          subheader={<Typography variant="body2" color="text.secondary">시간대별 매출 및 거래 건수</Typography>}
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
    item && item.label && typeof item.value === 'number' && 
    item.additionalData && typeof item.additionalData.transactions === 'number'
  );

  if (validChartData.length === 0) {
    return (
      <Card sx={{ width: '100%', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <CardHeader 
          title={<Typography variant="h6" sx={{ fontWeight: 600 }}>시간대별 매출 분석</Typography>}
          subheader={<Typography variant="body2" color="text.secondary">시간대별 매출 및 거래 건수</Typography>}
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
        backgroundColor: 'rgba(53, 162, 235, 0.7)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 0,
        borderRadius: 4,
        maxBarThickness: 40
      },
      {
        label: '거래 건수',
        data: validChartData.map(item => item.additionalData.transactions),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        type: 'line',
        yAxisID: 'transactions',
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)'
      }
    ]
  };

  // 차트 옵션
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          font: {
            size: 12
          }
        }
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
              if (context.dataset.label === '매출') {
                label += formatNumber(context.parsed.y) + '원';
              } else {
                label += formatNumber(context.parsed.y) + '건';
              }
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
      },
      transactions: {
        beginAtZero: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
          color: 'rgba(255, 99, 132, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 99, 132, 0.8)'
        }
      }
    },
    maintainAspectRatio: false
  };

  // 최고 매출 시간대 찾기
  const maxSalesItem = validChartData.reduce((max, item) => 
    item.value > max.value ? item : max, validChartData[0]);
  
  // 가장 거래가 많은 시간대 찾기
  const maxTransactionsItem = validChartData.reduce((max, item) => 
    item.additionalData.transactions > max.additionalData.transactions ? item : max, validChartData[0]);

  return (
    <Card sx={{ width: '100%', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
      <CardHeader 
        title={<Typography variant="h6" sx={{ fontWeight: 600 }}>시간대별 매출 분석</Typography>}
        subheader={<Typography variant="body2" color="text.secondary">시간대별 매출 및 거래 건수</Typography>}
      />
      <Divider />
      <CardContent sx={{ p: 2 }}>
        {/* 요약 박스: 한 줄 flex */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1, minWidth: 100, py: 1, px: 2, borderRadius: 1, bgcolor: 'rgba(53, 162, 235, 0.08)' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>최고 매출 시간대</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{maxSalesItem.label}</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 100, py: 1, px: 2, borderRadius: 1, bgcolor: 'rgba(255, 99, 132, 0.08)' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>최다 거래 시간대</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{maxTransactionsItem.label}</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 100, py: 1, px: 2, borderRadius: 1, bgcolor: 'rgba(53, 162, 235, 0.08)' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>총 매출</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{formatNumber(Math.round(data.summary.totalSales))}원</Typography>
          </Box>
        </Box>
        {/* 차트: 최대한 넓게 */}
        <Box sx={{ width: '100%', height, mt: 1 }}>
          <Bar data={chartData} options={chartOptions} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TimeAnalysisChart; 