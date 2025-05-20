import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Chart.js 등록
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// 스타일 컴포넌트
const Container = styled.div`
  padding: 20px;
`;

const PageTitle = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

const PageSubtitle = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
  font-style: italic;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
`;

const SelectWrapper = styled.div`
  position: relative;
  min-width: 180px;
  width: 200px;
  flex: 0 0 auto;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 10px 15px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  appearance: none;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #6FC3ED;
  }
`;

const ArrowIcon = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
`;

const SearchInput = styled.input`
  padding: 10px 15px;
  border-radius: 4px;
  border: 1px solid #ddd;
  width: 100%;
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  background-color: #6FC3ED;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  flex: 0 0 auto;
  
  &:hover {
    background-color:rgb(14, 170, 247);
  }
`;

const AutocompleteContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
`;

const AutocompleteDropdown = styled.ul`
  position: absolute;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const AutocompleteItem = styled.li`
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  
  .product-name {
    font-weight: bold;
  }
  
  .barcode {
    color: #666;
    font-size: 0.9em;
  }
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow: hidden;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DetailButton = styled.button`
  background-color: #f0f0f0;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const StatusSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
`;

const StatusItem = styled.div`
  display: flex;
  padding: 10px;
  border-radius: 4px;
  background-color: ${props => {
    switch(props.$status) {
      case 'danger': return '#FFEAEA';
      case 'warning': return '#FFF6E6';
      case 'normal': return '#EDF8F4';
      default: return '#f9f9f9';
    }
  }};
`;

const StatusIcon = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 10px;
  margin-top: 5px;
  background-color: ${props => {
    switch(props.$status) {
      case 'danger': return '#FF5252';
      case 'warning': return '#FFC107';
      case 'normal': return '#4CAF50';
      default: return '#9E9E9E';
    }
  }};
`;

const StatusContent = styled.div`
  flex: 1;
`;

const StatusTitle = styled.div`
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
`;

const StatusDescription = styled.div`
  font-size: 14px;
  color: #666;
`;

const StatusCount = styled.div`
  font-weight: bold;
  font-size: 16px;
  display: flex;
  align-items: center;
  color: ${props => {
    switch(props.$status) {
      case 'danger': return '#FF5252';
      case 'warning': return '#FFC107';
      case 'normal': return '#4CAF50';
      default: return '#9E9E9E';
    }
  }};
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-bottom: 20px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const TableHeader = styled.th`
  text-align: center;
  padding: 12px 15px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
  white-space: nowrap;
  text-align: center;
`;

const StockStatus = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  background-color: ${props => {
    switch(props.$status) {
      case 'danger': return '#FFEAEA';
      case 'warning': return '#FFF6E6';
      case 'normal': return '#EDF8F4';
      default: return '#f9f9f9';
    }
  }};
  color: ${props => {
    switch(props.$status) {
      case 'danger': return '#D32F2F';
      case 'warning': return '#F57C00';
      case 'normal': return '#388E3C';
      default: return '#757575';
    }
  }};
`;

const StockBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  margin-top: 4px;
`;

const StockBarFill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${props => (props.$value / props.$max) * 100}%;
  background: ${props => {
    const percentage = (props.$value / props.$max) * 100;
    if (percentage < 10) return '#FF5252';
    if (percentage < 30) return '#FFC107';
    return '#4CAF50';
  }};
  transition: width 0.3s ease;
`;

const StockBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100px;
`;

const StockBarLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 20px;
`;

const PageButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.$active === "true" ? '#6FC3ED' : '#ddd'};
  background-color: ${props => props.$active === "true" ? '#6FC3ED' : 'white'};
  color: ${props => props.$active === "true" ? 'white' : '#333'};
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.$active === "true" ? '#6FC3ED' : '#f0f0f0'};
  }
`;

const NavButton = styled(PageButton)`
  width: auto;
  padding: 0 10px;
`;

const ChartContainer = styled.div`
  height: 300px;
  margin: 20px 0;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

// 본사 재고 관련 스타일 추가
const HeadquartersSection = styled.div`
  margin-bottom: 20px;
`;

const StockProgressContainer = styled.div`
  margin: 15px 0;
`;

const StockProgressItem = styled.div`
  margin-bottom: 15px;
`;

const StockProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  
  .name {
    font-weight: bold;
  }
  
  .value {
    color: ${props => {
      const percentage = (props.current / props.total) * 100;
      if (percentage < 10) return '#FF5252';
      if (percentage < 30) return '#FFC107';
      return '#4CAF50';
    }};
  }
`;

const StockProgressBar = styled.div`
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => (props.current / props.total) * 100}%;
    background-color: ${props => {
      const percentage = (props.current / props.total) * 100;
      if (percentage < 10) return '#FF5252';
      if (percentage < 30) return '#FFC107';
      return '#4CAF50';
    }};
    border-radius: 4px;
    transition: width 0.3s ease;
  }
`;

// 기존 상하반전 막대그래프 관련 스타일 컴포넌트 교체
const BarChartWrapper = styled.div`
  padding: 20px 10px;
  margin-bottom: 20px;
`;

const VerticalBarContainer = styled.div`
  display: flex;
  height: 300px;
  justify-content: space-around;
  margin-top: 30px;
  margin-bottom: 60px;
  position: relative;
  background-color: #f9f9f9;
  background-image: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.03) 1px,
    transparent 1px
  );
  background-size: 100% 30px;
  border-bottom: 2px solid #e0e0e0;
  border-left: 1px solid #e0e0e0;
`;

const StockItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: ${props => props.$totalItems > 8 ? '8%' : '10%'};
  height: 100%;
`;

const VerticalBar = styled.div`
  position: absolute;
  bottom: 0;
  width: 25px;
  height: ${props => (props.$value / props.$max) * 100}%;
  max-height: 100%;
  background: ${props => {
    const percentage = (props.$value / props.$max) * 100;
    if (percentage < 10) return 'linear-gradient(to top, #FF5252, #ff7b7b)';
    if (percentage < 30) return 'linear-gradient(to top, #FFC107, #ffe082)';
    return 'linear-gradient(to top, #4CAF50, #81c784)';
  }};
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
  cursor: pointer;
  z-index: 2;
  
  &:hover {
    filter: brightness(1.1);
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
`;

const BarLabel = styled.div`
  position: absolute;
  top: -25px;
  font-weight: bold;
  font-size: 14px;
  color: #333;
`;

const BarValue = styled.div`
  position: absolute;
  bottom: -25px;
  font-size: 12px;
  color: #666;
`;

const ProductName = styled.div`
  position: absolute;
  bottom: -45px;
  width: 100px;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  left: 50%;
  transform: translateX(-50%);
`;

const StockLegend = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 60px;
  gap: 20px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  margin-right: 5px;
  border-radius: 2px;
  background: ${props => props.color};
`;

// 상태 표시를 위한 새로운 스타일 컴포넌트
const StatusText = styled.span`
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 12px;
  color: white;
  background-color: ${props => {
    switch(props.$status) {
      case 'danger': return '#FF5252';
      case 'warning': return '#FFC107';
      case 'normal': return '#4CAF50';
      default: return '#9E9E9E';
    }
  }};
`;

const IntegratedStockMonitoringCom = ({ 
  headquarters = [], // 본사 재고 데이터
  branches = [], 
  categories = [], 
  stockSummary = null, 
  categoryStats = [], 
  branchComparison = [], 
  stockList = { content: [], totalPages: 0, number: 0 }, 
  filters = {},
  onFilterChange,
  isLoading = false
}) => {
  // 필터 상태
  const [searchInput, setSearchInput] = useState('');
  const [autocompleteItems, setAutocompleteItems] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [viewMode, setViewMode] = useState('integrated'); // 'integrated', 'headquarters', 'branches'
  
  // 그래프 페이징을 위한 상태 추가
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 13;
  
  // 데이터 구조 확인을 위한 로그
  useEffect(() => {
    console.log('데이터 확인 - headquarters 전체:', headquarters);
    
    // 본사 재고 데이터 필드 상세 로깅
    if (headquarters && headquarters.length > 0) {
      const item0 = headquarters[0];
      console.log('첫번째 항목 모든 필드:', Object.keys(item0));
      console.log('첫번째 항목 모든 값:', Object.entries(item0).map(([k, v]) => `${k}: ${v}`).join(', '));
      
      headquarters.forEach((item, index) => {
        console.log(`본사 재고 아이템 ${index} 상세:`, {
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          warehouseQuantity: item.warehouseQuantity,
          totalQuantity: item.totalQuantity,
          hq_total_quantity: item.hq_total_quantity, // 추가 필드 확인
          total_quantity: item.total_quantity, // 추가 필드 확인
          hqTotalQuantity: item.hqTotalQuantity, // 추가 필드 확인
          allFields: Object.keys(item).join(', ')
        });
      });
    }
    
    console.log('데이터 확인 - stockList:', stockList);
  }, [headquarters, stockList]);
  
  // 데이터 구조 디버깅용 콘솔 로그
  useEffect(() => {
    if (viewMode === 'branches' && stockList.content.length > 0) {
      console.log('지점 재고 데이터 구조 확인:', stockList.content);
      
      // 특별히 warehouseQuantity 관련 필드를 모두 확인
      const fields = new Set();
      stockList.content.forEach(item => {
        Object.keys(item).forEach(key => {
          if (key.toLowerCase().includes('warehouse') || key.toLowerCase().includes('stock') || key.toLowerCase().includes('quantity')) {
            fields.add(key);
          }
        });
      });
      
      console.log('재고 관련 필드 목록:', Array.from(fields));
    }
    
    if (viewMode === 'headquarters' && headquarters.length > 0) {
      console.log('본사 재고 데이터 구조 확인:', headquarters[0]);
      
      // 본사 재고 필드 확인
      if (headquarters[0]) {
        const fields = Object.keys(headquarters[0]);
        console.log('본사 재고 필드 목록:', fields);
      }
    }
  }, [viewMode, stockList.content, headquarters]);
  
  // 자동완성 목록 생성
  useEffect(() => {
    if (searchInput.trim().length > 0 && stockList.content && stockList.content.length > 0) {
      // 상품명으로 검색
      const nameMatches = stockList.content
        .filter(item => item.productName.toLowerCase().includes(searchInput.toLowerCase()))
        .map(item => ({
          productName: item.productName,
          barcode: item.barcode
        }));
        
      // 바코드로 검색 (숫자만 입력된 경우)
      const barcodeMatches = /^\d+$/.test(searchInput)
        ? stockList.content
            .filter(item => item.barcode && item.barcode.toString().includes(searchInput))
            .map(item => ({
              productName: item.productName,
              barcode: item.barcode
            }))
        : [];
        
      // 결과 합치기 및 중복 제거
      const allMatches = [...nameMatches, ...barcodeMatches];
      const uniqueMatches = allMatches.filter((item, index, self) =>
        index === self.findIndex(t => t.productName === item.productName && t.barcode === item.barcode)
      ).slice(0, 10); // 최대 10개 표시
      
      setAutocompleteItems(uniqueMatches);
      setShowAutocomplete(uniqueMatches.length > 0);
    } else {
      setShowAutocomplete(false);
    }
  }, [searchInput, stockList.content]);
  
  // 필터 변경 핸들러
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    // 필요한 경우 API 호출을 위한 필터 변경도 추가
    onFilterChange({ viewMode: mode });
  };
  
  const handleBranchChange = (e) => {
    const storeId = e.target.value === 'all' ? null : parseInt(e.target.value, 10);
    onFilterChange({ storeId });
  };
  
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value === 'all' ? null : parseInt(e.target.value, 10);
    onFilterChange({ categoryId });
  };
  
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };
  
  const handleSearch = () => {
    if (searchInput.trim() === '') return;
    
    // 상품명, 바코드 여부 확인
    if (/^\d+$/.test(searchInput)) {
      // 숫자만 있으면 바코드로 검색
      onFilterChange({ barcode: parseInt(searchInput, 10), productName: null });
    } else {
      // 그 외에는 상품명으로 검색
      onFilterChange({ productName: searchInput, barcode: null });
    }
    setShowAutocomplete(false);
  };
  
  const handleAutocompleteItemClick = (item) => {
    // 바코드가 있으면 바코드로 검색, 없으면 상품명으로 검색
    if (item.barcode) {
      onFilterChange({ barcode: item.barcode, productName: null });
    } else {
      onFilterChange({ productName: item.productName, barcode: null });
    }
    
    // 선택한 항목을 검색창에 표시
    setSearchInput(item.productName);
    setShowAutocomplete(false);
  };
  
  const handlePageChange = (page) => {
    onFilterChange({ page });
  };
  
  // 엔터 키로 검색 실행
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  // 외부 클릭 시 자동완성 닫기
  const autocompleteRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setShowAutocomplete(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // 그래프 페이지 변경 핸들러 추가
  const handleGraphPageChange = (direction) => {
    if (direction === 'next' && (currentPage + 1) * itemsPerPage < headquarters.length) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  // 현재 페이지의 데이터 계산
  const getCurrentPageItems = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, headquarters.length);
    return headquarters.slice(startIndex, endIndex);
  };
  
  // 총 페이지 수 계산 - 동적으로 계산하여 모든 상품이 표시되도록 함
  const totalGraphPages = Math.ceil(headquarters.length / itemsPerPage);
  
  // 차트 데이터 준비
  const pieData = {
    labels: categoryStats.map(item => item.categoryName),
    datasets: [
      {
        data: categoryStats.map(item => item.percentage),
        backgroundColor: [
          '#0088FE', '#FF8042', '#FFBB28', '#00C49F',
          '#8884D8', '#82CA9D', '#FAA278', '#4CD2E8',
          '#E288B9', '#8BAA36'
        ],
        borderColor: ['#FFFFFF'],
        borderWidth: 2,
      },
    ],
  };
  
  const barData = {
    labels: branchComparison.map(item => item.name),
    datasets: [
      {
        label: '정상재고',
        data: branchComparison.map(item => item.정상재고),
        backgroundColor: '#4CAF50',
      },
      {
        label: '경고재고',
        data: branchComparison.map(item => item.경고재고),
        backgroundColor: '#FFC107',
      },
      {
        label: '긴급재고',
        data: branchComparison.map(item => item.긴급재고),
        backgroundColor: '#FF5252',
      },
    ],
  };
  
  const barOptions = {
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };
  
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value.toFixed(1)}%`;
          }
        }
      }
    },
  };

  // 재고 상태에 대한 설명
  const stockStatusDescriptions = {
    danger: '재고 부족으로 판매가 중단될 위험이 있는 상품',
    warning: '재고가 최소 기준치 미만으로 주문이 필요한 상품',
    normal: '적정 수준의 재고를 보유한 상품'
  };
  
  // 재고 상태 결정 함수 수정
  const getStockStatus = (item) => {
    console.log("재고 상태 계산 아이템:", item);
    
    // 본사인 경우 (quantity 기준으로 판단)
    if (item.isHeadquarters || item.storeName === '본사' || item.storeName === null) {
      // 본사 데이터의 경우 창고 재고(quantity) 필드 확인
      const quantity = (item.quantity !== undefined) ? item.quantity : (item.warehouseQuantity || 0);
      console.log("본사 재고 - 창고 재고량:", quantity);
      const minQuantity = 1000; // 본사 기준량
      
      if (quantity <= 0 || quantity < minQuantity * 0.1) return 'danger';
      if (quantity < minQuantity * 0.3) return 'warning';
      return 'normal';
    } 
    // 지점인 경우 총 재고(매장+창고) 기준으로 판단
    else {
      // 지점은 매장+창고 전체 재고로 판단
      const totalQuantity = item.totalQuantity || 0;
      console.log("지점 재고 - 총 재고량:", totalQuantity);
      const minQuantity = item.minStock || 100; // 지점 기준량
      
      if (totalQuantity <= 0 || totalQuantity < minQuantity * 0.1) return 'danger';
      if (totalQuantity < minQuantity * 0.3) return 'warning';
      return 'normal';
    }
  };
  
  // 페이지 그룹 계산을 위한 함수
  const getPageGroup = (currentPage, totalPages) => {
    const pagePerGroup = 5; // 페이지 그룹당 표시할 페이지 수
    const currentGroup = Math.floor(currentPage / pagePerGroup);
    
    const startPage = currentGroup * pagePerGroup;
    const endPage = Math.min(startPage + pagePerGroup - 1, totalPages - 1);
    
    return {
      startPage,
      endPage,
      hasNext: endPage < totalPages - 1,
      hasPrev: startPage > 0
    };
  };

  return (
    <Container>
      <PageTitle>상품 중심 통합 재고 관리</PageTitle>
      <PageSubtitle>상품별 통합 재고 현황을 모니터링하고 관리합니다</PageSubtitle>
      
      {/* 뷰 모드 전환 탭 */}
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <button 
          style={{ 
            padding: '10px 15px', 
            background: viewMode === 'integrated' ? '#6FC3ED' : '#f5f5f5',
            color: viewMode === 'integrated' ? 'white' : '#333',
            border: 'none', 
            borderRadius: '4px 0 0 4px',
            cursor: 'pointer',
            fontWeight: viewMode === 'integrated' ? 'bold' : 'normal'
          }}
          onClick={() => handleViewModeChange('integrated')}
        >
          통합 재고 현황
        </button>
        <button 
          style={{ 
            padding: '10px 15px', 
            background: viewMode === 'headquarters' ? '#6FC3ED' : '#f5f5f5', 
            color: viewMode === 'headquarters' ? 'white' : '#333',
            border: 'none',
            cursor: 'pointer',
            fontWeight: viewMode === 'headquarters' ? 'bold' : 'normal'
          }}
          onClick={() => handleViewModeChange('headquarters')}
        >
          본사 재고
        </button>
        <button 
          style={{ 
            padding: '10px 15px', 
            background: viewMode === 'branches' ? '#6FC3ED' : '#f5f5f5', 
            color: viewMode === 'branches' ? 'white' : '#333',
            border: 'none',
            borderRadius: '0 4px 4px 0',
            cursor: 'pointer',
            fontWeight: viewMode === 'branches' ? 'bold' : 'normal'
          }}
          onClick={() => handleViewModeChange('branches')}
        >
          지점별 재고
        </button>
      </div>
      
      {/* 필터 섹션 수정: 카테고리 필터를 먼저 배치 */}
      <FilterSection>
        <SelectWrapper>
          <StyledSelect 
            value={filters.categoryId || 'all'}
            onChange={handleCategoryChange}
          >
            <option value="all">모든 카테고리</option>
            {categories.map(category => (
              <option key={category.categoryId} value={category.categoryId}>{category.categoryName}</option>
            ))}
          </StyledSelect>
          <ArrowIcon>▼</ArrowIcon>
        </SelectWrapper>
        
        <SelectWrapper>
          <StyledSelect 
            value={filters.storeId || 'all'}
            onChange={handleBranchChange}
            disabled={viewMode === 'headquarters'}
          >
            <option value="all">모든 지점</option>
            {branches.map(branch => (
              <option key={branch.storeId} value={branch.storeId}>{branch.storeName}</option>
            ))}
          </StyledSelect>
          <ArrowIcon>▼</ArrowIcon>
        </SelectWrapper>
        
        <AutocompleteContainer ref={autocompleteRef}>
          <SearchInput 
            placeholder="상품명 또는 바코드 검색..." 
            value={searchInput}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            onFocus={() => searchInput.trim().length > 0 && setShowAutocomplete(autocompleteItems.length > 0)}
          />
          
          {showAutocomplete && (
            <AutocompleteDropdown>
              {autocompleteItems.map((item, index) => (
                <AutocompleteItem 
                  key={index} 
                  onClick={() => handleAutocompleteItemClick(item)}
                >
                  <span className="product-name">{item.productName}</span>
                  <span className="barcode">{item.barcode}</span>
                </AutocompleteItem>
              ))}
            </AutocompleteDropdown>
          )}
        </AutocompleteContainer>
        
        <SearchButton onClick={handleSearch}>
          검색하기
        </SearchButton>
      </FilterSection>
      
      {/* 본사 재고 현황 섹션 - 본사 전용 또는 통합 모드일 때만 표시 */}
      {(viewMode === 'headquarters' || viewMode === 'integrated') && (
        <HeadquartersSection>
          <Card>
            <CardTitle>
              본사 재고 현황
              <DetailButton>자세히</DetailButton>
            </CardTitle>
            
            {headquarters.length > 0 ? (
              <BarChartWrapper>
                {console.log('막대 그래프용 본사 재고 데이터:', headquarters)}
                
                {/* 페이지 네비게이션 버튼 추가 */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  alignItems: 'center'
                }}>
                  <button 
                    onClick={() => handleGraphPageChange('prev')}
                    disabled={currentPage === 0}
                    style={{ 
                      padding: '8px 15px',
                      background: currentPage === 0 ? '#f0f0f0' : '#6FC3ED',
                      color: currentPage === 0 ? '#999' : 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: currentPage === 0 ? 'default' : 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    ◀ 이전
                  </button>
                  
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {currentPage + 1} / {totalGraphPages} 페이지 ({headquarters.length}개 항목 중 {currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage, headquarters.length)}개 표시)
                  </div>
                  
                  <button 
                    onClick={() => handleGraphPageChange('next')}
                    disabled={(currentPage + 1) * itemsPerPage >= headquarters.length}
                    style={{ 
                      padding: '8px 15px',
                      background: (currentPage + 1) * itemsPerPage >= headquarters.length ? '#f0f0f0' : '#6FC3ED',
                      color: (currentPage + 1) * itemsPerPage >= headquarters.length ? '#999' : 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: (currentPage + 1) * itemsPerPage >= headquarters.length ? 'default' : 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    다음 ▶
                  </button>
                </div>
                
                <VerticalBarContainer>
                  {getCurrentPageItems().map((item, index) => {
                    // item에서 적절한 필드 선택 (quantity - 창고 재고)
                    console.log(`막대 그래프 아이템 ${index}:`, item);
                    // 창고 재고(quantity)를 사용
                    const quantity = (item.quantity !== undefined) ? item.quantity : (item.warehouseQuantity || 0);
                    const stockStatus = getStockStatus(item);
                    const displayName = item.productName || '상품명 없음';
                    const percentage = Math.round((quantity/1000)*100);
                    
                    return (
                      <StockItem key={index} $totalItems={Math.min(getCurrentPageItems().length, 12)}>
                        <BarLabel>{quantity}</BarLabel>
                        <VerticalBar 
                          $value={quantity} 
                          $max={1000}
                          title={`${displayName}: ${quantity}/1000 (${percentage}%)`}
                        />
                        <ProductName title={displayName}>
                          {displayName.length > 10 ? `${displayName.substring(0, 10)}...` : displayName}
                        </ProductName>
                      </StockItem>
                    );
                  })}
                </VerticalBarContainer>
                
                <StockLegend>
                  <LegendItem>
                    <LegendColor color="linear-gradient(to top, #4CAF50, #81c784)" />
                    <span>적정 (30% 이상)</span>
                  </LegendItem>
                  <LegendItem>
                    <LegendColor color="linear-gradient(to top, #FFC107, #ffe082)" />
                    <span>부족 (10~30%)</span>
                  </LegendItem>
                  <LegendItem>
                    <LegendColor color="linear-gradient(to top, #FF5252, #ff7b7b)" />
                    <span>위험 (10% 미만)</span>
                  </LegendItem>
                </StockLegend>
              </BarChartWrapper>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                본사 재고 데이터가 없습니다.
              </div>
            )}
          </Card>
        </HeadquartersSection>
      )}
      
      {/* 대시보드 그리드 - 지점 모드 또는 통합 모드일 때만 표시 */}
      {(viewMode === 'branches' || viewMode === 'integrated') && (
        <DashboardGrid>
          {/* 카테고리별 재고 비율 차트는 통합 모드에서만 표시 */}
          {viewMode === 'integrated' && (
            <Card style={{ gridColumn: 'span 2' }}>
              <CardTitle>
                카테고리별 재고 비율
                <DetailButton>자세히</DetailButton>
              </CardTitle>
              <ChartContainer style={{ height: '400px' }}>
                {categoryStats.length > 0 ? (
                  <Pie data={pieData} options={pieOptions} />
                ) : (
                  <div style={{textAlign: 'center', paddingTop: '100px'}}>
                    카테고리별 데이터가 없습니다.
                  </div>
                )}
              </ChartContainer>
            </Card>
          )}
          
          {/* 지점 재고 현황 요약 - 통합 모드일 때는 숨기기 */}
          {viewMode !== 'integrated' && (
            <Card>
              <CardTitle>
                지점 재고 현황 요약
                <DetailButton>자세히</DetailButton>
              </CardTitle>
              
              {stockSummary && (
                <StatusSection>
                  <StatusItem $status="danger">
                    <StatusIcon $status="danger" />
                    <StatusContent>
                      <StatusTitle>위험 재고</StatusTitle>
                      <StatusDescription>{stockStatusDescriptions.danger}</StatusDescription>
                    </StatusContent>
                    <StatusCount $status="danger">
                      {stockSummary.dangerCount}개
                    </StatusCount>
                  </StatusItem>
                  
                  <StatusItem $status="warning">
                    <StatusIcon $status="warning" />
                    <StatusContent>
                      <StatusTitle>부족 재고</StatusTitle>
                      <StatusDescription>{stockStatusDescriptions.warning}</StatusDescription>
                    </StatusContent>
                    <StatusCount $status="warning">
                      {stockSummary.warningCount}개
                    </StatusCount>
                  </StatusItem>
                  
                  <StatusItem $status="normal">
                    <StatusIcon $status="normal" />
                    <StatusContent>
                      <StatusTitle>적정 재고</StatusTitle>
                      <StatusDescription>{stockStatusDescriptions.normal}</StatusDescription>
                    </StatusContent>
                    <StatusCount $status="normal">
                      {stockSummary.normalCount}개
                    </StatusCount>
                  </StatusItem>
                </StatusSection>
              )}
            </Card>
          )}
          
          {/* 지점별 재고 비교 */}
          {viewMode !== 'integrated' && (
            <Card>
              <CardTitle>
                지점별 재고 비교
                <DetailButton>자세히</DetailButton>
              </CardTitle>
              
              <ChartContainer style={{ height: '400px' }}>
                {branchComparison.length > 0 ? (
                  <Bar data={barData} options={barOptions} />
                ) : (
                  <div style={{textAlign: 'center', paddingTop: '100px'}}>
                    지점 비교 데이터가 없습니다.
                  </div>
                )}
              </ChartContainer>
            </Card>
          )}
        </DashboardGrid>
      )}
      
      {/* 재고 목록 테이블 */}
      <Card style={{ position: 'relative' }}>
        <CardTitle>상품별 재고 상세 목록</CardTitle>
        
        {isLoading && <LoadingOverlay>데이터를 불러오는 중...</LoadingOverlay>}
        
        <TableContainer>
          <StyledTable>
            <thead>
              <tr>
                <TableHeader>상품명</TableHeader>
                <TableHeader>카테고리</TableHeader>
                <TableHeader>위치</TableHeader>
                <TableHeader>바코드</TableHeader>
                {/* 본사/지점 재고 컬럼 명확하게 구분 */}
                {viewMode === 'headquarters' ? (
                  <TableHeader>본사 창고 재고</TableHeader>
                ) : viewMode === 'branches' ? (
                  <>
                    <TableHeader>매장 재고</TableHeader>
                    <TableHeader>지점 창고 재고</TableHeader>
                  </>
                ) : (
                  <>
                    <TableHeader>매장 재고</TableHeader>
                    <TableHeader>창고 재고</TableHeader>
                  </>
                )}
                <TableHeader>총 재고</TableHeader>
                <TableHeader>최근 입고일</TableHeader>
                <TableHeader>상태</TableHeader>
              </tr>
            </thead>
            <tbody>
              {stockList.content.length > 0 ? (
                stockList.content.map((item, index) => {
                  const stockStatus = getStockStatus(item);
                  const isHQ = item.isHeadquarters || item.storeName === '본사' || item.storeName === null;
                  
                  return (
                    <tr key={index}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.categoryName}</TableCell>
                      <TableCell>{item.storeName || '본사'}</TableCell>
                      <TableCell>{item.barcode}</TableCell>
                      {/* 본사/지점에 따라 재고 컬럼 표시 방식 조정 */}
                      {viewMode === 'headquarters' ? (
                        // 본사 재고일 경우 (창고 재고만 표시)
                        <TableCell>
                          {/* 본사의 창고 재고는 quantity 필드에 있어야 함 */}
                          {(item.quantity !== undefined) ? item.quantity : (item.warehouseQuantity || 0)}
                        </TableCell>
                      ) : (
                        <>
                          <TableCell>
                            {isHQ 
                              ? ((item.totalQuantity !== undefined && item.quantity !== undefined) 
                                 ? item.totalQuantity - item.quantity 
                                 : (item.totalQuantity !== undefined && item.warehouseQuantity !== undefined)
                                   ? item.totalQuantity - item.warehouseQuantity 
                                   : 0) 
                              : ((item.storeQuantity !== undefined && item.storeQuantity !== null) 
                                 ? item.storeQuantity 
                                 : (item.totalQuantity !== undefined && item.warehouseQuantity !== undefined)
                                   ? item.totalQuantity - item.warehouseQuantity 
                                   : 0)}
                          </TableCell>
                          <TableCell>
                            {isHQ 
                              ? ((item.quantity !== undefined) ? item.quantity : (item.warehouseQuantity || 0)) 
                              : (item.warehouseQuantity || 0)}
                          </TableCell>
                        </>
                      )}
                      <TableCell>
                        {/* 총 재고는 DB의 total_quantity 값(1000)을 표시하도록 다양한 필드명 시도 */}
                        {isHQ 
                          ? (
                              item.totalQuantity !== undefined ? item.totalQuantity : 
                              item.total_quantity !== undefined ? item.total_quantity :
                              item.hqTotalQuantity !== undefined ? item.hqTotalQuantity :
                              item.hq_total_quantity !== undefined ? item.hq_total_quantity :
                              1000 // 기본값으로 1000 사용
                            )
                          : (item.totalQuantity || 0)}
                      </TableCell>
                      <TableCell>{item.latestInDate ? new Date(item.latestInDate).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        <StatusText $status={stockStatus}>
                          {stockStatus === 'normal' ? '적정' : 
                           stockStatus === 'warning' ? '부족' : '위험'}
                        </StatusText>
                      </TableCell>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <TableCell colSpan={viewMode === 'headquarters' ? 8 : 9} style={{textAlign: 'center', padding: '30px 0'}}>
                    재고 데이터가 없습니다.
                  </TableCell>
                </tr>
              )}
            </tbody>
          </StyledTable>
        </TableContainer>
        
        {/* 페이지네이션 */}
        {stockList.totalPages > 1 && (
          <Pagination>
            {(() => {
              const { startPage, endPage, hasNext, hasPrev } = getPageGroup(stockList.number, stockList.totalPages);
              
              return (
                <>
                  {hasPrev && (
                    <NavButton
                      onClick={() => handlePageChange(startPage - 1)}
                    >
                      &lt;
                    </NavButton>
                  )}
                  
                  {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
                    <PageButton
                      key={page}
                      $active={(page === stockList.number).toString()}
                      onClick={() => handlePageChange(page)}
                    >
                      {page + 1}
                    </PageButton>
                  ))}
                  
                  {hasNext && (
                    <NavButton
                      onClick={() => handlePageChange(endPage + 1)}
                    >
                      &gt;
                    </NavButton>
                  )}
                </>
              );
            })()}
          </Pagination>
        )}
      </Card>
    </Container>
  );
};

export default IntegratedStockMonitoringCom; 