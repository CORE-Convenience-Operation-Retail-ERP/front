import React from 'react';
import { Card, CardContent, CardHeader, Divider, Box, Typography, Grid, Tab, Tabs } from '@mui/material';
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
 * 연령대/성별 매출 분석 차트 컴포넌트
 */
const DemographicSalesChart = ({ ageData, genderData, height = 350, defaultType = 'age' }) => {
  const [chartType, setChartType] = React.useState(defaultType);

  // 탭 변경 핸들러
  const handleTabChange = (event, newValue) => {
    setChartType(newValue);
  };

  // 데이터 선택
  const data = chartType === 'age' ? ageData : genderData;

  if (!data || !data.chartData || !Array.isArray(data.chartData) || data.chartData.length === 0 || !data.summary) {
    return (
      <Card>
        <CardHeader 
          title={<Typography variant="h6" sx={{ fontWeight: 600 }}>{chartType === 'age' ? "연령대별 매출 분석" : "성별 매출 분석"}</Typography>} 
          subheader={<Typography variant="body2" color="text.secondary">인구통계학적 매출 분석</Typography>} 
        />
        <Divider />
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={chartType} 
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="연령대별" value="age" />
            <Tab label="성별" value="gender" />
          </Tabs>
        </Box>
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
          title={<Typography variant="h6" sx={{ fontWeight: 600 }}>{chartType === 'age' ? "연령대별 매출 분석" : "성별 매출 분석"}</Typography>} 
          subheader={<Typography variant="body2" color="text.secondary">인구통계학적 매출 분석</Typography>} 
        />
        <CardContent>
          <Typography variant="body1" align="center">
            유효한 데이터가 없습니다.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // 차트 색상
  const ageColors = {
    backgroundColor: 'rgba(54, 162, 235, 0.6)',
    borderColor: 'rgba(54, 162, 235, 1)'
  };

  const genderColors = {
    '남성': {
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)'
    },
    '여성': {
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderColor: 'rgba(255, 99, 132, 1)'
    },
    '기타': {
      backgroundColor: 'rgba(201, 203, 207, 0.6)',
      borderColor: 'rgba(201, 203, 207, 1)'
    }
  };

  // 차트 데이터 준비
  const chartData = {
    labels: validChartData.map(item => item.label),
    datasets: [
      {
        label: chartType === 'age' ? '연령대별 매출' : '성별 매출',
        data: validChartData.map(item => item.value),
        backgroundColor: validChartData.map(item => 
          chartType === 'age' 
            ? ageColors.backgroundColor 
            : (genderColors[item.label] || genderColors['기타']).backgroundColor
        ),
        borderColor: validChartData.map(item => 
          chartType === 'age' 
            ? ageColors.borderColor 
            : (genderColors[item.label] || genderColors['기타']).borderColor
        ),
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
          },
          afterLabel: function(context) {
            const item = validChartData[context.dataIndex];
            const transactions = item.additionalData.transactions;
            const percentage = Math.round((item.value / data.summary.totalSales) * 100);
            
            return [
              `거래 건수: ${formatNumber(transactions)}건`,
              `비중: ${percentage}%`,
              `평균 객단가: ${formatNumber(Math.round(item.additionalData.averageTransaction))}원`
            ];
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

  // 최대 매출 항목 찾기
  const maxItem = validChartData.reduce((max, item) => 
    item.value > max.value ? item : max, validChartData[0]);

  return (
    <Card>
      <CardHeader 
        title={<Typography variant="h6" sx={{ fontWeight: 600 }}>{chartType === 'age' ? "연령대별 매출 분석" : "성별 매출 분석"}</Typography>} 
        subheader={<Typography variant="body2" color="text.secondary">인구통계학적 매출 분석</Typography>} 
      />
      <Divider />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={chartType} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="연령대별" value="age" />
          <Tab label="성별" value="gender" />
        </Tabs>
      </Box>
      <CardContent>
        <Box sx={{ height: height, mb: 3 }}>
          <Bar data={chartData} options={chartOptions} />
        </Box>
        <Grid container spacing={2}>
          <Grid xs={12} md={6}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>최고 매출 {chartType === 'age' ? '연령대' : '성별'}:</strong> {maxItem.label} ({formatNumber(Math.round(maxItem.value))}원)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>비중:</strong> {Math.round((maxItem.value / data.summary.totalSales) * 100)}%
              </Typography>
            </Box>
          </Grid>
          <Grid xs={12} md={6}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>총 매출:</strong> {formatNumber(Math.round(data.summary.totalSales))}원
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>총 거래 건수:</strong> {formatNumber(data.summary.totalTransactions)}건
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DemographicSalesChart; 