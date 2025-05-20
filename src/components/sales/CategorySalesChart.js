import React from 'react';
import { Card, CardContent, CardHeader, Divider, Box, Typography, Grid } from '@mui/material';
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
const CategorySalesChart = ({ data, height = 350 }) => {
  if (!data || !data.chartData || !Array.isArray(data.chartData) || data.chartData.length === 0 || !data.summary) {
    return (
      <Card sx={{ width: '100%', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <CardHeader 
          title={<Typography variant="h6" sx={{ fontWeight: 600 }}>카테고리별 매출 분석</Typography>}
          subheader={<Typography variant="body2" color="text.secondary">카테고리별 매출 비율</Typography>}
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
          title={<Typography variant="h6" sx={{ fontWeight: 600 }}>카테고리별 매출 분석</Typography>}
          subheader={<Typography variant="body2" color="text.secondary">카테고리별 매출 비율</Typography>}
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

  // 차트 색상 배열 - 조화로운 색상으로
  const backgroundColors = [
    'rgba(53, 162, 235, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(255, 99, 132, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(255, 159, 64, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 99, 71, 0.8)',
    'rgba(46, 204, 113, 0.8)',
    'rgba(142, 68, 173, 0.8)'
  ];

  // 상위 5개 카테고리에 집중
  const topCategories = [...validChartData]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // 나머지 카테고리 합계 계산
  const otherCategories = validChartData.length > 5 
    ? {
        label: '기타',
        value: validChartData
          .slice(5)
          .reduce((sum, item) => sum + item.value, 0)
      }
    : null;

  // 최종 차트 데이터 구성
  const chartCategories = [...topCategories];
  if (otherCategories && otherCategories.value > 0) {
    chartCategories.push(otherCategories);
  }

  // 차트 데이터 준비
  const chartData = {
    labels: chartCategories.map(item => item.label),
    datasets: [
      {
        data: chartCategories.map(item => item.value),
        backgroundColor: chartCategories.map((_, index) => backgroundColors[index % backgroundColors.length]),
        borderWidth: 1,
        borderColor: '#fff'
      }
    ]
  };

  // 차트 옵션
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          font: {
            size: 11
          },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#555',
        bodyColor: '#333',
        borderColor: 'rgba(0, 0, 0, 0.1)',
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
            const value = context.raw;
            const label = context.label || '';
            const percentage = Math.round((value / data.summary.totalSales) * 100);
            return `${label}: ${formatNumber(value)}원 (${percentage}%)`;
          }
        }
      }
    },
    cutout: '40%',
    maintainAspectRatio: false
  };

  // 총 매출 대비 상위 카테고리 비율 계산
  const topCategoryPercentage = Math.round((topCategories[0].value / data.summary.totalSales) * 100);

  return (
    <Card sx={{ width: '100%', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
      <CardHeader 
        title={<Typography variant="h6" sx={{ fontWeight: 600 }}>카테고리별 매출 분석</Typography>}
        subheader={<Typography variant="body2" color="text.secondary">카테고리별 매출 비율</Typography>}
      />
      <Divider />
      <CardContent sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box sx={{ height: height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Pie data={chartData} options={chartOptions} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ mt: { xs: 0, md: 4 } }}>
              <Box sx={{ py: 1, px: 2, borderRadius: 1, bgcolor: 'rgba(53, 162, 235, 0.08)', mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  총 매출
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {formatNumber(Math.round(data.summary.totalSales))}원
                </Typography>
              </Box>
              
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mt: 3, color: 'text.primary' }}>
                상위 카테고리
              </Typography>
              
              {topCategories.slice(0, 3).map((category, index) => (
                <Box key={index} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 10, 
                      height: 10, 
                      borderRadius: '50%',
                      bgcolor: backgroundColors[index % backgroundColors.length],
                      mr: 1.5
                    }} 
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {category.label}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <Typography variant="body2" color="text.secondary">
                        {formatNumber(Math.round(category.value))}원
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {Math.round((category.value / data.summary.totalSales) * 100)}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
        {/* 안내 문구 */}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'right' }}>
          상위 5개 카테고리만 노출되며, 나머지는 "기타"로 합산됩니다.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CategorySalesChart; 