import React, { useState, useEffect, useCallback } from 'react';
import { Container, Paper, Typography, Box, Alert, CircularProgress, Grid } from '@mui/material';
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
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2, height: 200 }}>
          <CircularProgress />
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
    <Container maxWidth="xl">
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          매출 분석
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          지점별, 기간별, 카테고리별 등 다양한 기준으로 매출을 분석합니다.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <SalesAnalyticsFilter
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
          dateRange={dateRange}
          setDateRange={setDateRange}
          stores={stores}
          onApplyFilter={handleApplyFilter}
          hideAnalysisType={true}
        />
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {renderLoadingOrChart('overview', SalesOverviewChart, analysisData.overview)}
          </Grid>
          
          <Grid item xs={12} md={6}>
            {renderLoadingOrChart('store', StoreSalesChart, analysisData.store)}
          </Grid>
          
          <Grid item xs={12} md={6}>
            {renderLoadingOrChart('time', TimeAnalysisChart, analysisData.time)}
          </Grid>
          
          <Grid item xs={12} md={6}>
            {renderLoadingOrChart('demographicAge', DemographicSalesChart, analysisData.demographicAge, { type: 'age' })}
          </Grid>
          
          <Grid item xs={12} md={6}>
            {renderLoadingOrChart('demographicGender', DemographicSalesChart, analysisData.demographicGender, { type: 'gender' })}
          </Grid>
          
          <Grid item xs={12} md={6}>
            {renderLoadingOrChart('category', CategorySalesChart, analysisData.category)}
          </Grid>
          
          <Grid item xs={12} md={6}>
            {renderLoadingOrChart('weather', WeatherSalesChart, analysisData.weather)}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SalesAnalysis; 