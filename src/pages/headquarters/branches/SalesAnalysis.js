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
import AgeGroupSalesChart from '../../../components/sales/AgeGroupSalesChart';
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
  
  // 각 차트별 로딩 상태를 추적
  const [chartLoading, setChartLoading] = useState({
    overview: false,
    store: false,
    date: false,
    time: false,
    'demographic-age': false,
    'demographic-gender': false,
    category: false,
    weather: false
  });
  
  // 각 차트별 오류 상태를 추적
  const [chartErrors, setChartErrors] = useState({
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

  // 개별 차트 데이터 조회 함수
  const fetchChartData = useCallback(async (type) => {
    setChartLoading(prev => ({ ...prev, [type]: true }));
    setChartErrors(prev => ({ ...prev, [type]: null }));
    
    try {
      const params = {
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
        storeId: selectedStore
      };
      
      let response;
      
      switch (type) {
        case 'overview':
          response = await SalesAnalysisService.getOverview(params);
          break;
        case 'store':
          response = await SalesAnalysisService.getByStore(params);
          break;
        case 'date':
          response = await SalesAnalysisService.getByDate(params);
          break;
        case 'time':
          response = await SalesAnalysisService.getByTime(params);
          break;
        case 'demographic-age':
          params.type = 'age';
          response = await SalesAnalysisService.getByDemographic(params);
          break;
        case 'demographic-gender':
          params.type = 'gender';
          
          // 백엔드 문제 해결 주석:
          // 1. SalesAnalysisRepository.java의 findSalesByGender 쿼리 확인
          //    - gender 컬럼에 실제로 'M', 'F' 값이 있는지 확인 필요
          //    - gender 컬럼에 null이 아닌 값이 있어야 함
          // 2. SalesAnalysisService.java의 analyzeSalesByGender 메서드 확인
          //    - 성별 코드 변환 맵(M->MALE, F->FEMALE)이 제대로 동작하는지 확인
          //    - 실제 DB 데이터에 맞게 코드 조정 필요

          console.log('성별 데이터 API 요청 시작:', JSON.stringify(params));
          try {
            response = await SalesAnalysisService.getByDemographic(params);
            console.log('성별 데이터 API 응답 성공');
            
            // 백엔드에서 받은 응답 구조 자세히 분석
            if (response && response.data) {
              console.log('응답 데이터 구조:', Object.keys(response.data));
              
              if (response.data.chartData) {
                console.log('차트 데이터 개수:', response.data.chartData.length);
                console.log('차트 데이터 첫 번째 항목:', JSON.stringify(response.data.chartData[0]));
              } else {
                console.warn('차트 데이터가 없습니다!');
              }
            } else {
              console.warn('응답에 데이터가 없습니다!');
            }
          } catch (err) {
            console.error('성별 데이터 API 오류:', err);
            throw err;
          }
          break;
        case 'category':
          response = await SalesAnalysisService.getByCategory(params);
          break;
        case 'weather':
          response = await SalesAnalysisService.getByWeather(params);
          break;
        default:
          throw new Error('알 수 없는 분석 유형');
      }
      
      if (!response.data || !response.data.chartData || response.data.chartData.length === 0) {
        const errorMessages = {
          'overview': '해당 기간에 매출 데이터가 없습니다.',
          'store': '해당 기간에 지점별 매출 데이터가 없습니다.',
          'date': '해당 기간에 날짜별 매출 데이터가 없습니다.',
          'time': '해당 기간에 시간대별 매출 데이터가 없습니다.',
          'demographic-age': '해당 기간에 연령대별 매출 데이터가 없습니다.',
          'demographic-gender': '해당 기간에 성별 매출 데이터가 없습니다.',
          'category': '해당 기간에 카테고리별 매출 데이터가 없습니다.',
          'weather': '해당 기간에 날씨별 매출 데이터가 없습니다.'
        };
        setChartErrors(prev => ({ ...prev, [type]: errorMessages[type] || '데이터가 없습니다.' }));
      } else {
        // 백엔드에서 받은 데이터 처리
        if (type === 'demographic-gender') {
          console.log('메인 컴포넌트에서 성별 데이터 처리:');
          if (response.data && response.data.chartData) {
            console.log('라벨 값 확인:', response.data.chartData.map(item => item.label).join(', '));
            console.log('value 값 확인:', response.data.chartData.map(item => item.value).join(', '));
          }
        }
        
        setAnalysisData(prevData => ({
          ...prevData,
          [type]: response.data
        }));
      }
    } catch (error) {
      console.error(`${type} 매출 분석 데이터 조회 실패:`, error);
      setChartErrors(prev => ({ ...prev, [type]: '데이터를 가져오는데 실패했습니다.' }));
    } finally {
      setChartLoading(prev => ({ ...prev, [type]: false }));
    }
  }, [dateRange, selectedStore]);

  // 모든 차트 데이터 조회
  const fetchAllAnalysisData = useCallback(() => {
    setLoading(true);
    
    // 모든 차트 타입에 대해 데이터 조회
    const chartTypes = ['overview', 'store', 'date', 'time', 'demographic-age', 'demographic-gender', 'category', 'weather'];
    
    Promise.all(chartTypes.map(type => fetchChartData(type)))
      .finally(() => {
        setLoading(false);
      });
  }, [fetchChartData]);

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
    if (selectedStore !== null) {
      fetchAllAnalysisData();
    }
  }, [fetchAllAnalysisData, selectedStore]);

  // 필터 적용 핸들러
  const handleApplyFilter = () => {
    fetchAllAnalysisData();
  };

  // 차트 컴포넌트 렌더링 함수
  const renderChartComponent = (type, title) => {
    const isLoading = chartLoading[type];
    const error = chartErrors[type];
    const data = analysisData[type];
    
    return (
      <Paper sx={{ p: 2, mb: 3, height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        
        {error && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {type === 'overview' && data && <SalesOverviewChart data={data} />}
            {type === 'store' && data && <StoreSalesChart data={data} />}
            {type === 'date' && data && <SalesOverviewChart data={data} />}
            {type === 'time' && data && <TimeAnalysisChart data={data} />}
            {type === 'demographic-age' && data && <AgeGroupSalesChart data={data} />}
            {type === 'demographic-gender' && data && (
              <DemographicSalesChart data={data} />
            )}
            {type === 'category' && data && <CategorySalesChart data={data} />}
            {type === 'weather' && data && <WeatherSalesChart data={data} />}
          </>
        )}
      </Paper>
    );
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
          analysisType={null}
          setAnalysisType={null}
          stores={stores}
          onApplyFilter={handleApplyFilter}
          showAnalysisTypeSelector={false}
        />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
            <Typography ml={2}>모든 차트 데이터를 로딩 중입니다...</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {renderChartComponent('overview', '매출 개요')}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderChartComponent('store', '지점별 매출')}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderChartComponent('date', '날짜별 매출')}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderChartComponent('time', '시간대별 매출')}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderChartComponent('demographic-age', '연령대별 매출')}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderChartComponent('demographic-gender', '성별 매출')}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderChartComponent('category', '카테고리별 매출')}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderChartComponent('weather', '날씨별 매출')}
            </Grid>
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default SalesAnalysis; 