import React from 'react';
import { Card, CardContent, CardHeader, Divider, Box, Typography } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Chart.js 등록
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

// 천 단위 콤마 포맷 함수
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * 카테고리별 매출 차트 컴포넌트
 */
const CategorySalesChart = ({ data }) => {
  if (!data || !data.chartData || !Array.isArray(data.chartData) || data.chartData.length === 0 || !data.summary) {
    return (
      <Card>
        <CardHeader 
          title="카테고리별 매출 분석" 
          subheader="카테고리별 매출 비율" 
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
          title="카테고리별 매출 분석" 
          subheader="카테고리별 매출 비율" 
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
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const label = context.label || '';
            const percentage = Math.round((value / data.summary.totalSales) * 100);
            return `${label}: ${formatNumber(value)}원 (${percentage}%)`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  // 상위 3개 카테고리
  const topCategories = [...validChartData].sort((a, b) => b.value - a.value).slice(0, 3);

  return (
    <Card>
      <CardHeader 
        title="카테고리별 매출 분석" 
        subheader="카테고리별 매출 비율" 
      />
      <Divider />
      <CardContent>
        <Box sx={{ height: 350, display: 'flex', justifyContent: 'center' }}>
          <Pie data={chartData} options={chartOptions} />
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>상위 카테고리:</strong>
          </Typography>
          {topCategories.map((category, index) => (
            <Typography key={index} variant="body2" color="text.secondary" gutterBottom>
              {index + 1}. {category.label}: {formatNumber(Math.round(category.value))}원 ({Math.round((category.value / data.summary.totalSales) * 100)}%)
            </Typography>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CategorySalesChart; 