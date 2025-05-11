import React from 'react';
import { Card, CardContent, CardHeader, Divider, Box, Typography, Grid } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
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

  // 차트 색상 배열
  const backgroundColors = [
    'rgba(255, 99, 132, 0.7)',
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 206, 86, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 159, 64, 0.7)',
    'rgba(201, 203, 207, 0.7)',
    'rgba(255, 99, 71, 0.7)',
    'rgba(50, 205, 50, 0.7)',
    'rgba(138, 43, 226, 0.7)'
  ];

  // 차트 데이터 준비
  const chartData = {
    labels: data.chartData.map(item => item.label),
    datasets: [
      {
        data: data.chartData.map(item => item.value),
        backgroundColor: data.chartData.map((_, index) => backgroundColors[index % backgroundColors.length]),
        borderColor: data.chartData.map((_, index) => backgroundColors[index % backgroundColors.length].replace('0.7', '1')),
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
            const label = context.label || '';
            const value = context.raw;
            const total = context.chart.getDatasetMeta(0).total;
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${formatNumber(Math.round(value))}원 (${percentage}%)`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  // 상위 3개 카테고리 추출
  const topCategories = [...data.chartData]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  return (
    <Card>
      <CardHeader 
        title="카테고리별 매출 분석" 
        subheader="카테고리별 매출 비중" 
      />
      <Divider />
      <CardContent>
        <Grid container spacing={3}>
          <Grid xs={12} md={8}>
            <Box sx={{ height: 350 }}>
              <Doughnut data={chartData} options={chartOptions} />
            </Box>
          </Grid>
          <Grid xs={12} md={4}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                상위 3개 카테고리
              </Typography>
              <Divider sx={{ my: 1 }} />
              {topCategories.map((category, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ 
                    color: backgroundColors[data.chartData.findIndex(item => item.label === category.label) % backgroundColors.length].replace('0.7', '1'),
                    fontWeight: 'bold'
                  }}>
                    {index + 1}. {category.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatNumber(Math.round(category.value))}원
                    {category.additionalData && category.additionalData.salesCount && (
                      <span> ({formatNumber(category.additionalData.salesCount)}건)</span>
                    )}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary">
                총 매출: {formatNumber(Math.round(data.summary.totalSales))}원
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CategorySalesChart; 