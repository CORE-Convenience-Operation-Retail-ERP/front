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
const TimeAnalysisChart = ({ data }) => {
  if (!data || !data.chartData || !Array.isArray(data.chartData) || data.chartData.length === 0 || !data.summary) {
    return (
      <Card>
        <CardHeader 
          title="시간대별 매출 분석" 
          subheader="시간대별 매출 및 거래 건수" 
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
          title="시간대별 매출 분석" 
          subheader="시간대별 매출 및 거래 건수" 
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
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: '거래 건수',
        data: validChartData.map(item => item.additionalData.transactions),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        type: 'line',
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

  // 최고 매출 시간대 찾기
  const maxSalesItem = validChartData.reduce((max, item) => 
    item.value > max.value ? item : max, validChartData[0]);
  
  // 가장 거래가 많은 시간대 찾기
  const maxTransactionsItem = validChartData.reduce((max, item) => 
    item.additionalData.transactions > max.additionalData.transactions ? item : max, validChartData[0]);

  return (
    <Card>
      <CardHeader 
        title="시간대별 매출 분석" 
        subheader="시간대별 매출 및 거래 건수" 
      />
      <Divider />
      <CardContent>
        <Box sx={{ height: 400 }}>
          <Bar data={chartData} options={chartOptions} />
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>최고 매출 시간대:</strong> {maxSalesItem.label} ({formatNumber(Math.round(maxSalesItem.value))}원)
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>최다 거래 시간대:</strong> {maxTransactionsItem.label} ({formatNumber(maxTransactionsItem.additionalData.transactions)}건)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>총 매출:</strong> {formatNumber(Math.round(data.summary.totalSales))}원 / <strong>총 거래 건수:</strong> {formatNumber(data.summary.totalTransactions)}건
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TimeAnalysisChart; 