import React, { useState, useEffect } from 'react';
import { Typography, Box, Skeleton } from '@mui/material';
import WidgetWrapper from './WidgetWrapper';
import DashboardService from '../../../../service/dashboard/DashboardService';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
import PaymentsIcon from '@mui/icons-material/Payments';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import { useNavigate } from 'react-router-dom';

const StoreOverviewWidget = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    // 점포 통계
    totalStores: 0,
    newStores: 0,
    totalStoresGrowth: 0,
    newStoresGrowth: 0,
    
    // 매출 통계
    dailySales: 0,
    dailySalesGrowth: 0,
    monthlySales: 0,
    monthlySalesGrowth: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 모든 데이터를 한번에 조회
      const response = await DashboardService.getDashboardSummary();
      setDashboardData(response.data);
    } catch (error) {
      console.error('대시보드 데이터 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 숫자 포맷팅 함수 (단위 변환)
  const formatNumber = (num) => {
    if (num >= 100000000) {
      return (num / 100000000).toFixed(1) + '억';
    } else if (num >= 10000) {
      return (num / 10000).toFixed(1) + '만';
    }
    return num.toLocaleString();
  };

  // 카드 아이템 컴포넌트
  const StatCard = ({ icon, label, value, growth, bgColor, loading, onClick }) => (
    <Box 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: bgColor,
        p: 1,
        textAlign: 'center',
        borderRadius: 1,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        '&:hover': {
          opacity: onClick ? 0.85 : 1,
          transform: onClick ? 'translateY(-2px)' : 'none',
          boxShadow: onClick ? '0 4px 8px rgba(0,0,0,0.1)' : 'none'
        }
      }}
      onClick={onClick}
    >
      {icon}
      <Typography variant="caption" color="textSecondary" sx={{ mb: 0.3 }}>
        {label}
      </Typography>
      {loading ? (
        <Skeleton width="60%" height={28} animation="wave" />
      ) : (
        <Typography variant="h5" component="div" fontWeight="bold" sx={{ lineHeight: 1.1 }}>
          {value}
        </Typography>
      )}
      {loading ? (
        <Skeleton width="40%" height={14} animation="wave" />
      ) : (
        <Typography 
          variant="caption" 
          sx={{ 
            color: growth >= 0 ? 'success.main' : 'error.main',
            fontSize: '0.7rem'
          }}
        >
          {growth >= 0 ? '↑' : '↓'} {Math.abs(growth)}%
        </Typography>
      )}
    </Box>
  );

  return (
    <WidgetWrapper title="점포 & 매출 현황" onRefresh={fetchData}>
      <Box sx={{ 
        display: 'flex', 
        width: '100%', 
        height: 'calc(100% - 5px)'
      }}>
        {/* 전체 점포수 */}
        <Box sx={{ flex: 1, mx: 0.4, my: 0.2 }}>
          <StatCard 
            icon={<StorefrontIcon sx={{ fontSize: 20, color: '#1976d2', mb: 0.3 }} />}
            label="전체 점포 수"
            value={dashboardData.totalStores.toLocaleString()}
            growth={dashboardData.totalStoresGrowth}
            bgColor="#e3f2fd"
            loading={loading}
            onClick={() => navigate('/headquarters/branches/list')}
          />
        </Box>
        
        {/* 신규 점포수 */}
        <Box sx={{ flex: 1, mx: 0.4, my: 0.2 }}>
          <StatCard 
            icon={<AddHomeWorkIcon sx={{ fontSize: 20, color: '#ed6c02', mb: 0.3 }} />}
            label="신규 점포"
            value={dashboardData.newStores.toLocaleString()}
            growth={dashboardData.newStoresGrowth}
            bgColor="#fff8e1"
            loading={loading}
            onClick={() => navigate('/headquarters/branches/list')}
          />
        </Box>
        
        {/* 당일 매출 현황 */}
        <Box sx={{ flex: 1, mx: 0.4, my: 0.2 }}>
          <StatCard 
            icon={<PaymentsIcon sx={{ fontSize: 20, color: '#2e7d32', mb: 0.3 }} />}
            label="당일 매출"
            value={formatNumber(dashboardData.dailySales)}
            growth={dashboardData.dailySalesGrowth}
            bgColor="#e8f5e9"
            loading={loading}
            onClick={() => navigate('/headquarters/branches/sales-analysis')}
          />
        </Box>
        
        {/* 당월 매출 현황 */}
        <Box sx={{ flex: 1, mx: 0.4, my: 0.2 }}>
          <StatCard 
            icon={<PointOfSaleIcon sx={{ fontSize: 20, color: '#9c27b0', mb: 0.3 }} />}
            label="당월 매출"
            value={formatNumber(dashboardData.monthlySales)}
            growth={dashboardData.monthlySalesGrowth}
            bgColor="#f3e5f5"
            loading={loading}
            onClick={() => navigate('/headquarters/branches/sales-analysis')}
          />
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default StoreOverviewWidget; 