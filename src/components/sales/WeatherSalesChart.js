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
  if (!data || !data.chartData || !Array.isArray(data.chartData) || data.chartData.length === 0 || !data.summary) {
    return (
      <Card>
        <CardHeader 
          title="날씨별 매출 분석" 
          subheader="날씨 조건별 매출 영향" 
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
    item && item.label && typeof item.value === 'number' &&
    item.additionalData && typeof item.additionalData.transactions === 'number'
  );

  if (validChartData.length === 0) {
    return (
      <Card>
        <CardHeader 
          title="날씨별 매출 분석" 
          subheader="날씨 조건별 매출 영향" 
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

  // 날씨별 색상 매핑
  const weatherColors = {
    '맑음': { backgroundColor: 'rgba(255, 206, 86, 0.6)', borderColor: 'rgba(255, 206, 86, 1)' },
    '흐림': { backgroundColor: 'rgba(201, 203, 207, 0.6)', borderColor: 'rgba(201, 203, 207, 1)' },
    '비': { backgroundColor: 'rgba(54, 162, 235, 0.6)', borderColor: 'rgba(54, 162, 235, 1)' },
    '눈': { backgroundColor: 'rgba(255, 255, 255, 0.6)', borderColor: 'rgba(201, 203, 207, 1)' },
    '안개': { backgroundColor: 'rgba(169, 169, 169, 0.6)', borderColor: 'rgba(169, 169, 169, 1)' },
    '폭염': { backgroundColor: 'rgba(255, 99, 132, 0.6)', borderColor: 'rgba(255, 99, 132, 1)' },
    '한파': { backgroundColor: 'rgba(153, 102, 255, 0.6)', borderColor: 'rgba(153, 102, 255, 1)' },
    '기타': { backgroundColor: 'rgba(201, 203, 207, 0.6)', borderColor: 'rgba(201, 203, 207, 1)' }
  };

  // 기본 색상
  const defaultColor = { backgroundColor: 'rgba(201, 203, 207, 0.6)', borderColor: 'rgba(201, 203, 207, 1)' };

  // 차트 데이터 준비
  const chartData = {
    labels: validChartData.map(item => item.label),
    datasets: [
      {
        label: '매출',
        data: validChartData.map(item => item.value),
        backgroundColor: validChartData.map(item => (weatherColors[item.label] || defaultColor).backgroundColor),
        borderColor: validChartData.map(item => (weatherColors[item.label] || defaultColor).borderColor),
        borderWidth: 1
      },
      {
        label: '거래 건수',
        data: validChartData.map(item => item.additionalData.transactions),
        type: 'line',
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        fill: false,
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
  const maxSalesItem = validChartData.reduce((max, item) => 
    item.value > max.value ? item : max, validChartData[0]);

  return (
    <Card>
      <CardHeader 
        title="날씨별 매출 분석" 
        subheader="날씨 조건별 매출 영향" 
      />
      <Divider />
      <CardContent>
        <Box sx={{ height: 350 }}>
          <Bar data={chartData} options={chartOptions} />
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>최고 매출 날씨:</strong> {maxSalesItem.label} ({formatNumber(Math.round(maxSalesItem.value))}원)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>매출 영향률:</strong> {maxSalesItem.additionalData && maxSalesItem.additionalData.impactRate ? `${maxSalesItem.additionalData.impactRate > 0 ? '+' : ''}${maxSalesItem.additionalData.impactRate}%` : '측정 불가'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeatherSalesChart; 