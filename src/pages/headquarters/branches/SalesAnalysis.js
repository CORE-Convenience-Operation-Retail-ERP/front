import React, { useState, useEffect, useCallback } from 'react';
import { Container, Paper, Typography, Box, Alert, CircularProgress } from '@mui/material';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-06-30')
  });
  const [analysisType, setAnalysisType] = useState('overview');
  const [analysisData, setAnalysisData] = useState({
    overview: null,
    store: null,
    date: null,
    time: null,
    'demographic-age': null,
    'demographic-gender': null,
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

  // 매출 분석 데이터 조회
  const fetchAnalysisData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
        storeId: selectedStore
      };
      
      let response;
      let type = analysisType;
      
      switch (analysisType) {
        case 'overview':
          response = await SalesAnalysisService.getOverview(params);
          console.log('매출 데이터 응답:', response.data);
          if (!response.data || !response.data.chartData || response.data.chartData.length === 0) {
            console.log('매출 데이터가 비어있습니다');
            setError('해당 기간에 매출 데이터가 없습니다. 다른 날짜 범위를 선택해주세요.');
          }
          break;
        case 'store':
          response = await SalesAnalysisService.getByStore(params);
          if (!response.data || !response.data.chartData || response.data.chartData.length === 0) {
            setError('해당 기간에 지점별 매출 데이터가 없습니다. 다른 날짜 범위를 선택해주세요.');
          }
          break;
        case 'date':
          response = await SalesAnalysisService.getByDate(params);
          if (!response.data || !response.data.chartData || response.data.chartData.length === 0) {
            setError('해당 기간에 날짜별 매출 데이터가 없습니다. 다른 날짜 범위를 선택해주세요.');
          }
          break;
        case 'time':
          response = await SalesAnalysisService.getByTime(params);
          if (!response.data || !response.data.chartData || response.data.chartData.length === 0) {
            setError('해당 기간에 시간대별 매출 데이터가 없습니다. 다른 날짜 범위를 선택해주세요.');
          }
          break;
        case 'demographic-age':
          params.type = 'age';
          response = await SalesAnalysisService.getByDemographic(params);
          if (!response.data || !response.data.chartData || response.data.chartData.length === 0) {
            setError('해당 기간에 연령대별 매출 데이터가 없습니다. 다른 날짜 범위를 선택해주세요.');
          }
          break;
        case 'demographic-gender':
          params.type = 'gender';
          response = await SalesAnalysisService.getByDemographic(params);
          if (!response.data || !response.data.chartData || response.data.chartData.length === 0) {
            setError('해당 기간에 성별 매출 데이터가 없습니다. 다른 날짜 범위를 선택해주세요.');
          }
          break;
        case 'category':
          response = await SalesAnalysisService.getByCategory(params);
          if (!response.data || !response.data.chartData || response.data.chartData.length === 0) {
            setError('해당 기간에 카테고리별 매출 데이터가 없습니다. 다른 날짜 범위를 선택해주세요.');
          }
          break;
        case 'weather':
          response = await SalesAnalysisService.getByWeather(params);
          if (!response.data || !response.data.chartData || response.data.chartData.length === 0) {
            setError('해당 기간에 날씨별 매출 데이터가 없습니다. 다른 날짜 범위를 선택해주세요.');
          }
          break;
        default:
          type = 'overview';
          response = await SalesAnalysisService.getOverview(params);
          if (!response.data || !response.data.chartData || response.data.chartData.length === 0) {
            setError('해당 기간에 매출 데이터가 없습니다. 다른 날짜 범위를 선택해주세요.');
          }
      }
      
      setAnalysisData(prevData => ({
        ...prevData,
        [type]: response.data
      }));
    } catch (error) {
      console.error('매출 분석 데이터 조회 실패:', error);
      setError('매출 분석 데이터를 가져오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  }, [analysisType, dateRange, selectedStore]);

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
    fetchAnalysisData();
  }, [fetchAnalysisData]);

  // 필터 적용 핸들러
  const handleApplyFilter = () => {
    fetchAnalysisData();
  };

  // 현재 분석 유형에 맞는 차트 렌더링
  const renderChart = () => {
    switch (analysisType) {
      case 'overview':
        return <SalesOverviewChart data={analysisData.overview} />;
      case 'store':
        return <StoreSalesChart data={analysisData.store} />;
      case 'date':
        return <SalesOverviewChart data={analysisData.date} />;
      case 'time':
        return <TimeAnalysisChart data={analysisData.time} />;
      case 'demographic-age':
        return <DemographicSalesChart data={analysisData['demographic-age']} type="age" />;
      case 'demographic-gender':
        return <DemographicSalesChart data={analysisData['demographic-gender']} type="gender" />;
      case 'category':
        return <CategorySalesChart data={analysisData.category} />;
      case 'weather':
        return <WeatherSalesChart data={analysisData.weather} />;
      default:
        return <SalesOverviewChart data={analysisData.overview} />;
    }
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
          analysisType={analysisType}
          setAnalysisType={setAnalysisType}
          stores={stores}
          onApplyFilter={handleApplyFilter}
        />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          renderChart()
        )}
      </Paper>
    </Container>
  );
};

export default SalesAnalysis; 