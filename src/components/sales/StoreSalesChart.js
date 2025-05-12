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
 * 지점별 매출 차트 컴포넌트
 */
const StoreSalesChart = ({ data }) => {
  if (!data || !data.chartData || !Array.isArray(data.chartData) || data.chartData.length === 0 || !data.summary) {
    return (
      <Card>
        <CardHeader 
          title="지점별 매출" 
          subheader="지점별 매출 비교" 
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
          title="지점별 매출" 
          subheader="지점별 매출 비교" 
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

  // 차트 색상 배열
  const backgroundColors = [
    'rgba(75, 192, 192, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(255, 99, 132, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
    'rgba(201, 203, 207, 0.6)',
    'rgba(255, 99, 71, 0.6)',
    'rgba(50, 205, 50, 0.6)',
    'rgba(138, 43, 226, 0.6)'
  ];

  // 차트 데이터 준비
  const chartData = {
    labels: validChartData.map(item => item.label),
    datasets: [
      {
        label: '매출',
        data: validChartData.map(item => item.value),
        backgroundColor: validChartData.map((_, index) => backgroundColors[index % backgroundColors.length]),
        borderWidth: 1
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

  return (
    <Card>
      <CardHeader 
        title="지점별 매출" 
        subheader="지점별 매출 비교" 
      />
      <Divider />
      <CardContent>
        <Box sx={{ height: 400 }}>
          <Bar data={chartData} options={chartOptions} />
        </Box>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            총 매출: {formatNumber(Math.round(data.summary.totalSales))}원
          </Typography>
          <Typography variant="body2" color="text.secondary">
            총 거래 건수: {formatNumber(data.summary.totalTransactions)}건
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StoreSalesChart; 