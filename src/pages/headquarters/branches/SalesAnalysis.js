import React, { useState, useEffect, useCallback } from 'react';
import { Container, Paper, Typography, Box, Alert, CircularProgress, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../service/axiosInstance';

// 컴포넌트 임포트
import SalesAnalyticsFilter from '../../../components/sales/SalesAnalyticsFilter';
import SalesOverviewChart from '../../../components/sales/SalesOverviewChart';
import StoreSalesChart from '../../../components/sales/StoreSalesChart';
import TimeAnalysisChart from '../../../components/sales/TimeAnalysisChart';
import CategorySalesChart from '../../../components/sales/CategorySalesChart';
import DemographicSalesChart from '../../../components/sales/DemographicSalesChart';
import WeatherSalesChart from '../../../components/sales/WeatherSalesChart';

// 서비스 임포트
import SalesAnalysisService from '../../../service/sales/SalesAnalysisService';

const SalesAnalysis = () => {
  const navigate = useNavigate();

  // 상태 정의
  const [loading, setLoading] = useState({
    overview: false,
    store: false,
    date: false,
    time: false,
    demographicAge: false,
    demographicGender: false,
    category: false,
    weather: false
  });
  const [error, setError] = useState(null);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-06-30')
  });
  const [analysisData, setAnalysisData] = useState({
    overview: null,
    store: null,
    date: null,
    time: null,
    demographicAge: null,
    demographicGender: null,
    category: null,
    weather: null
  });
  const [tab, setTab] = useState(0);

  // 권한 확인
  const checkPermission = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return false;
    }
    
    try {
      // JWT 디코딩
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;
      
      // 권한 확인 (HQ_BR, HQ_BR_M, MASTER)
      return role && ['ROLE_HQ_BR', 'ROLE_HQ_BR_M', 'ROLE_MASTER'].includes(role);
    } catch (error) {
      console.error('권한 확인 오류:', error);
      return false;
    }
  };

  // 지점 목록 조회
  const fetchStores = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/stores');
      if (response.data && response.data.length > 0) {
        console.log('지점 목록 조회 성공:', response.data);
        setStores(response.data);
      } else {
        throw new Error('지점 데이터가 없습니다');
      }
    } catch (error) {
      console.error('지점 정보 조회 실패:', error);
      setError('지점 정보를 가져오는데 실패했습니다. 관리자에게 문의하세요.');
    }
  }, []);

  // 모든 매출 분석 데이터 조회
  const fetchAllAnalysisData = useCallback(async () => {
      const params = {
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
        storeId: selectedStore
      };
      
    // 개요 데이터 조회
    setLoading(prev => ({ ...prev, overview: true }));
    try {
      const overviewResponse = await SalesAnalysisService.getOverview(params);
      setAnalysisData(prev => ({ ...prev, overview: overviewResponse.data }));
    } catch (error) {
      console.error('매출 개요 데이터 조회 실패:', error);
    } finally {
      setLoading(prev => ({ ...prev, overview: false }));
    }

    // 지점별 데이터 조회
    setLoading(prev => ({ ...prev, store: true }));
    try {
      const storeResponse = await SalesAnalysisService.getByStore(params);
      setAnalysisData(prev => ({ ...prev, store: storeResponse.data }));
    } catch (error) {
      console.error('지점별 매출 데이터 조회 실패:', error);
    } finally {
      setLoading(prev => ({ ...prev, store: false }));
    }

    // 날짜별 데이터 조회
    setLoading(prev => ({ ...prev, date: true }));
    try {
      const dateResponse = await SalesAnalysisService.getByDate(params);
      setAnalysisData(prev => ({ ...prev, date: dateResponse.data }));
    } catch (error) {
      console.error('날짜별 매출 데이터 조회 실패:', error);
    } finally {
      setLoading(prev => ({ ...prev, date: false }));
    }

    // 시간대별 데이터 조회
    setLoading(prev => ({ ...prev, time: true }));
    try {
      const timeResponse = await SalesAnalysisService.getByTime(params);
      setAnalysisData(prev => ({ ...prev, time: timeResponse.data }));
    } catch (error) {
      console.error('시간대별 매출 데이터 조회 실패:', error);
    } finally {
      setLoading(prev => ({ ...prev, time: false }));
    }

    // 연령대별 데이터 조회
    setLoading(prev => ({ ...prev, demographicAge: true }));
    try {
      const ageParams = { ...params, type: 'age' };
      const ageResponse = await SalesAnalysisService.getByDemographic(ageParams);
      setAnalysisData(prev => ({ ...prev, demographicAge: ageResponse.data }));
    } catch (error) {
      console.error('연령대별 매출 데이터 조회 실패:', error);
    } finally {
      setLoading(prev => ({ ...prev, demographicAge: false }));
    }

    // 성별별 데이터 조회
    setLoading(prev => ({ ...prev, demographicGender: true }));
    try {
      const genderParams = { ...params, type: 'gender' };
      const genderResponse = await SalesAnalysisService.getByDemographic(genderParams);
      setAnalysisData(prev => ({ ...prev, demographicGender: genderResponse.data }));
    } catch (error) {
      console.error('성별별 매출 데이터 조회 실패:', error);
    } finally {
      setLoading(prev => ({ ...prev, demographicGender: false }));
    }

    // 카테고리별 데이터 조회
    setLoading(prev => ({ ...prev, category: true }));
    try {
      const categoryResponse = await SalesAnalysisService.getByCategory(params);
      setAnalysisData(prev => ({ ...prev, category: categoryResponse.data }));
    } catch (error) {
      console.error('카테고리별 매출 데이터 조회 실패:', error);
    } finally {
      setLoading(prev => ({ ...prev, category: false }));
    }

    // 날씨별 데이터 조회
    setLoading(prev => ({ ...prev, weather: true }));
    try {
      const weatherResponse = await SalesAnalysisService.getByWeather(params);
      setAnalysisData(prev => ({ ...prev, weather: weatherResponse.data }));
    } catch (error) {
      console.error('날씨별 매출 데이터 조회 실패:', error);
    } finally {
      setLoading(prev => ({ ...prev, weather: false }));
    }
  }, [dateRange, selectedStore]);

  // 초기 로딩
  useEffect(() => {
    if (!checkPermission()) {
      setError('접근 권한이 없습니다.');
      return;
    }
    
    fetchStores();
  }, [fetchStores]);

  // 필터 변경 시 데이터 조회
  useEffect(() => {
    fetchAllAnalysisData();
  }, [fetchAllAnalysisData]);

  // 필터 적용 핸들러
  const handleApplyFilter = () => {
    fetchAllAnalysisData();
  };

  const renderLoadingOrChart = (type, ChartComponent, data, props = {}) => {
    if (loading[type]) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: props.height || 250, 
          bgcolor: 'rgba(0, 0, 0, 0.02)', 
          borderRadius: 1 
        }}>
          <CircularProgress size={40} thickness={4} sx={{ color: 'primary.main' }} />
        </Box>
      );
    }
    
    // null 데이터 또는 chartData가 없는 경우 기본 데이터 제공
    const safeData = data && data.chartData ? data : { 
      chartData: [], 
      summary: {
        totalSales: 0,
        totalTransactions: 0,
        averageTransaction: 0,
        previousPeriodSales: 0,
        growthRate: 0
      }
    };
    
    return <ChartComponent data={safeData} {...props} />;
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f7', minHeight: '100vh', pb: 6 }}>
      {/* ERP 스타일 헤더 */}
      <Box sx={{ 
        width: '100%', 
        bgcolor: 'white', 
        // boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
        mb: 4, 
        pt: 4, 
        pb: 3 
      }}>
        <Box sx={{ width: '90%', maxWidth: 1216, mx: 'auto' }}>
          <Typography sx={{
            fontWeight: 700,
            fontSize: 30,
            color: '#2563A6',
            letterSpacing: '-0.5px'
          }}>
            지점 매출 분석
          </Typography>
        </Box>
      </Box>

      {/* 컨텐츠 영역 */}
      <Box sx={{ width: '90%', maxWidth: 1500, mx: 'auto' }}>
        {/* 매출 분석 필터와 탭 버튼 섹션 */}
        <Box sx={{ 
          display: 'flex', 
          mb: 4, 
          alignItems: 'flex-start', 
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          gap: 3
        }}>
          {/* 왼쪽: 필터 */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <SalesAnalyticsFilter
              selectedStore={selectedStore}
              setSelectedStore={setSelectedStore}
              dateRange={dateRange}
              setDateRange={setDateRange}
              stores={stores}
              onApplyFilter={handleApplyFilter}
              hideAnalysisType={true}
            />
          </Box>
          
          {/* 오른쪽: 탭 버튼 */}
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'row',
            gap: 0,
            minWidth: { xs: '100%', sm: 180 },
            mt: { xs: 0, md: 1 }
          }}>
            <Button
              variant={tab === 0 ? 'contained' : 'outlined'}
              onClick={() => setTab(0)}
              sx={{
                borderRadius: '20px 0 0 20px',
                backgroundColor: tab === 0 ? '#2563A6' : 'transparent',
                color: tab === 0 ? 'white' : '#2563A6',
                borderColor: '#2563A6',
                fontWeight: 500,
                px: 3,
                boxShadow: 0,
                '&:hover': {
                  backgroundColor: tab === 0 ? '#1E5187' : 'rgba(37, 99, 166, 0.1)',
                },
                minWidth: 0
              }}
            >
              매출 분석
            </Button>
            <Button
              variant={tab === 1 ? 'contained' : 'outlined'}
              onClick={() => setTab(1)}
              sx={{
                borderRadius: '0 20px 20px 0',
                backgroundColor: tab === 1 ? '#2563A6' : 'transparent',
                color: tab === 1 ? 'white' : '#2563A6',
                borderColor: '#2563A6',
                fontWeight: 500,
                px: 3,
                boxShadow: 0,
                '&:hover': {
                  backgroundColor: tab === 1 ? '#1E5187' : 'rgba(37, 99, 166, 0.1)',
                },
                minWidth: 0
              }}
            >
              요인 분석
            </Button>
          </Box>
        </Box>

        {/* 차트 그룹 */}
        <Box>
          {tab === 0 && (
            <Grid container spacing={4}>
              {/* 1줄: 매출 개요 차트 */}
              <Grid item xs={12}>
                {renderLoadingOrChart('overview', SalesOverviewChart, analysisData.overview, { height: 340 })}
              </Grid>
              
              {/* 2줄: 좌우 50%씩 시간대별 & 지점별 차트 */}
              <Grid item xs={12} md={6}>
                {renderLoadingOrChart('time', TimeAnalysisChart, analysisData.time, { height: 350 })}
              </Grid>
              
              <Grid item xs={12} md={6}>
                {renderLoadingOrChart('store', StoreSalesChart, analysisData.store, { height: 340 })}
              </Grid>
            </Grid>
          )}
          
          {tab === 1 && (
            <Grid container spacing={4}>
              {/* 1줄: 카테고리 & 연령대/성별(탭) */}
              <Grid item xs={12} md={6} sx={{ width: '40%' }}>
                {renderLoadingOrChart('category', CategorySalesChart, analysisData.category, { height: 370 })}
              </Grid>

              <Grid item xs={12} md={6} sx={{ width: '25%' }}>
                {renderLoadingOrChart('weather', WeatherSalesChart, analysisData.weather, { height: 350 })}
              </Grid>

              {/* 연령대/성별 매출 분석: 탭으로 병합 */}
              <Grid item xs={12} md={6}>
                <DemographicSalesChart
                  ageData={analysisData.demographicAge}
                  genderData={analysisData.demographicGender}
                  height={250}
                  defaultType="age"
                />
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SalesAnalysis; 