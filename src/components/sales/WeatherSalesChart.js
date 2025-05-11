import React from 'react';
import { Card, CardContent, CardHeader, Divider, Box, Typography, Grid } from '@mui/material';
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

// 날씨별 아이콘 정의
const weatherIcons = {
  '맑음': '☀️',
  '구름': '☁️',
  '비': '🌧️',
  '눈': '❄️',
  '천둥번개': '⚡',
  '안개': '🌫️',
  '흐림': '☁️',
  '먼지': '😷',
  '기타': '🌈'
};

/**
 * 날씨별 매출 분석 차트 컴포넌트
 */
const WeatherSalesChart = ({ data }) => {
  if (!data || !data.chartData || !data.summary) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body1" align="center">
            데이터가 없습니다.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // 날씨별 색상 정의
  const weatherColors = {
    '맑음': {
      backgroundColor: 'rgba(255, 206, 86, 0.6)',
      borderColor: 'rgba(255, 206, 86, 1)'
    },
    '구름': {
      backgroundColor: 'rgba(201, 203, 207, 0.6)',
      borderColor: 'rgba(201, 203, 207, 1)'
    },
    '비': {
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)'
    },
    '눈': {
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      borderColor: 'rgba(220, 220, 220, 1)'
    },
    '천둥번개': {
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
      borderColor: 'rgba(153, 102, 255, 1)'
    },
    '안개': {
      backgroundColor: 'rgba(168, 168, 168, 0.6)',
      borderColor: 'rgba(168, 168, 168, 1)'
    },
    '기타': {
      backgroundColor: 'rgba(255, 159, 64, 0.6)',
      borderColor: 'rgba(255, 159, 64, 1)'
    }
  };

  // 차트 데이터 준비
  const chartData = {
    labels: data.chartData.map(item => `${weatherIcons[item.label] || '🌈'} ${item.label}`),
    datasets: [
      {
        label: '매출',
        data: data.chartData.map(item => item.value),
        backgroundColor: data.chartData.map(item => 
          (weatherColors[item.label] || weatherColors['기타']).backgroundColor
        ),
        borderColor: data.chartData.map(item => 
          (weatherColors[item.label] || weatherColors['기타']).borderColor
        ),
        borderWidth: 1
      },
      {
        label: '거래 건수',
        data: data.chartData.map(item => item.additionalData.transactions),
        type: 'line',
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        yAxisID: 'transactions'
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
              if (context.dataset.label === '매출') {
                label += formatNumber(context.parsed.y) + '원';
              } else {
                label += formatNumber(context.parsed.y) + '건';
              }
            }
            return label;
          },
          afterLabel: function(context) {
            if (context.dataset.label === '매출') {
              const item = data.chartData[context.dataIndex];
              const days = item.additionalData.days || 0;
              
              return [
                `일평균 매출: ${formatNumber(Math.round(item.value / days))}원/일`,
                `일수: ${days}일`
              ];
            }
            return null;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '매출 (원)'
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
          drawOnChartArea: false
        },
        title: {
          display: true,
          text: '거래 건수'
        }
      }
    },
    maintainAspectRatio: false
  };

  // 최고 매출 날씨 찾기
  const maxSalesItem = data.chartData.reduce((max, item) => 
    item.value > max.value ? item : max, data.chartData[0]);
  
  // 일평균 매출이 가장 높은 날씨 찾기
  const maxDailyAvgItem = data.chartData.reduce((max, item) => {
    const days = item.additionalData.days || 1;
    const dailyAvg = item.value / days;
    return dailyAvg > (max.value / (max.additionalData.days || 1)) ? item : max;
  }, data.chartData[0]);

  return (
    <Card>
      <CardHeader 
        title="날씨별 매출 분석" 
        subheader="날씨 조건별 매출 비교" 
      />
      <Divider />
      <CardContent>
        <Box sx={{ height: 400 }}>
          <Bar data={chartData} options={chartOptions} />
        </Box>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid xs={12} md={6}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>총 매출 최대 날씨:</strong> {weatherIcons[maxSalesItem.label] || '🌈'} {maxSalesItem.label} ({formatNumber(Math.round(maxSalesItem.value))}원)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>일수:</strong> {maxSalesItem.additionalData.days || 0}일
              </Typography>
            </Box>
          </Grid>
          <Grid xs={12} md={6}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>일평균 매출 최대 날씨:</strong> {weatherIcons[maxDailyAvgItem.label] || '🌈'} {maxDailyAvgItem.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>일평균 매출:</strong> {formatNumber(Math.round(maxDailyAvgItem.value / (maxDailyAvgItem.additionalData.days || 1)))}원/일
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WeatherSalesChart; 