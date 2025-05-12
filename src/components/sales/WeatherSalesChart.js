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
  '구름많음': '⛅',
  '흐림': '☁️',
  '비': '🌧️',
  '소나기': '🌦️',
  '비/눈': '🌨️',
  '눈': '❄️',
  '천둥번개': '⚡',
  '안개': '🌫️',
  '먼지': '😷',
  '기타': '🌈'
};

// 날씨별 색상 정의
const weatherColors = {
  '맑음': '#FFD700',    // 골드
  '구름': '#A9A9A9',    // 다크 그레이
  '구름많음': '#B0C4DE', // 라이트 스틸 블루
  '흐림': '#708090',    // 슬레이트 그레이
  '비': '#4682B4',      // 스틸 블루
  '소나기': '#1E90FF',   // 도저 블루
  '비/눈': '#87CEFA',    // 라이트 스카이 블루
  '눈': '#E0FFFF',      // 라이트 시안
  '천둥번개': '#9932CC',  // 다크 오키드
  '안개': '#D3D3D3',     // 라이트 그레이
  '먼지': '#CD853F',     // 페루
  '기타': '#FFFFFF'      // 화이트
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
  const validChartData = data.chartData.filter(item => item.value !== null && item.value !== undefined);
  
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

  // 차트 데이터 구성
  const chartData = {
    labels: validChartData.map(item => `${item.label} ${weatherIcons[item.label] || ''}`),
    datasets: [
      {
        label: '매출액',
        data: validChartData.map(item => item.value),
        backgroundColor: validChartData.map(item => `${weatherColors[item.label] || weatherColors['기타']}80`), // 80은 알파값(투명도)
        borderColor: validChartData.map(item => weatherColors[item.label] || weatherColors['기타']),
        borderWidth: 1,
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
    ],
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