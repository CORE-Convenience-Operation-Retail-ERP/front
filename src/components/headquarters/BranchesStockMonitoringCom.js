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
    switch(props.status) {
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
    switch(props.status) {
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
    switch(props.status) {
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
  text-align: left;
  padding: 12px 15px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
  white-space: nowrap;
`;

const StockStatus = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  background-color: ${props => {
    switch(props.status) {
      case 'danger': return '#FFEAEA';
      case 'warning': return '#FFF6E6';
      case 'normal': return '#EDF8F4';
      default: return '#f9f9f9';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'danger': return '#D32F2F';
      case 'warning': return '#F57C00';
      case 'normal': return '#388E3C';
      default: return '#757575';
    }
  }};
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
  border: 1px solid ${props => props.active === "true" ? '#6FC3ED' : '#ddd'};
  background-color: ${props => props.active === "true" ? '#6FC3ED' : 'white'};
  color: ${props => props.active === "true" ? 'white' : '#333'};
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active === "true" ? '#6FC3ED' : '#f0f0f0'};
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

const BranchesStockMonitoringCom = ({ 
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
  
  // 재고 상태 결정 함수
  const getStockStatus = (stockQuantity, minQuantity) => {
    if (stockQuantity <= 0 || stockQuantity < minQuantity * 0.3) return 'danger';
    if (stockQuantity < minQuantity) return 'warning';
    return 'normal';
  };
  
  // 페이지 그룹 계산을 위한 함수 추가
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
      <PageTitle>지점 중심 재고 관리</PageTitle>
      <PageSubtitle>지점별 재고 현황을 모니터링하고 관리합니다</PageSubtitle>
      
      {/* 필터 섹션 */}
      <FilterSection>
        <SelectWrapper>
          <StyledSelect 
            value={filters.storeId || 'all'}
            onChange={handleBranchChange}
          >
            <option value="all">모든 지점</option>
            {branches.map(branch => (
              <option key={branch.storeId} value={branch.storeId}>{branch.storeName}</option>
            ))}
          </StyledSelect>
          <ArrowIcon>▼</ArrowIcon>
        </SelectWrapper>
        
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
      
      {/* 대시보드 그리드 */}
      <DashboardGrid>
        {/* 재고 개요 카드 */}
        <Card>
          <CardTitle>
            지점별 재고 현황 요약
            <DetailButton>자세히</DetailButton>
          </CardTitle>
          
          {stockSummary && (
            <StatusSection>
              <StatusItem status="danger">
                <StatusIcon status="danger" />
                <StatusContent>
                  <StatusTitle>긴급 재고</StatusTitle>
                  <StatusDescription>{stockStatusDescriptions.danger}</StatusDescription>
                </StatusContent>
                <StatusCount status="danger">
                  {stockSummary.dangerCount}개
                </StatusCount>
              </StatusItem>
              
              <StatusItem status="warning">
                <StatusIcon status="warning" />
                <StatusContent>
                  <StatusTitle>경고 재고</StatusTitle>
                  <StatusDescription>{stockStatusDescriptions.warning}</StatusDescription>
                </StatusContent>
                <StatusCount status="warning">
                  {stockSummary.warningCount}개
                </StatusCount>
              </StatusItem>
              
              <StatusItem status="normal">
                <StatusIcon status="normal" />
                <StatusContent>
                  <StatusTitle>정상 재고</StatusTitle>
                  <StatusDescription>{stockStatusDescriptions.normal}</StatusDescription>
                </StatusContent>
                <StatusCount status="normal">
                  {stockSummary.normalCount}개
                </StatusCount>
              </StatusItem>
            </StatusSection>
          )}
          
          <ChartContainer>
            {categoryStats.length > 0 ? (
              <Pie data={pieData} options={pieOptions} />
            ) : (
              <div style={{textAlign: 'center', paddingTop: '100px'}}>
                카테고리별 데이터가 없습니다.
              </div>
            )}
          </ChartContainer>
        </Card>
        
        {/* 지점별 재고 비교 */}
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
      </DashboardGrid>
      
      {/* 재고 목록 테이블 */}
      <Card style={{ position: 'relative' }}>
        <CardTitle>지점별 재고 상세 목록</CardTitle>
        
        {isLoading && <LoadingOverlay>데이터를 불러오는 중...</LoadingOverlay>}
        
        <TableContainer>
          <StyledTable>
            <thead>
              <tr>
                <TableHeader>지점</TableHeader>
                <TableHeader>상품명</TableHeader>
                <TableHeader>카테고리</TableHeader>
                <TableHeader>바코드</TableHeader>
                <TableHeader>매장 재고</TableHeader>
                <TableHeader>창고 재고</TableHeader>
                <TableHeader>총 재고</TableHeader>
                <TableHeader>최근 입고일</TableHeader>
                <TableHeader>상태</TableHeader>
              </tr>
            </thead>
            <tbody>
              {stockList.content.length > 0 ? (
                stockList.content.map((item, index) => {
                  const stockStatus = getStockStatus(item.storeQuantity, 10); // 10은 임시 최소값
                  return (
                    <tr key={index}>
                      <TableCell>{item.storeName}</TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.categoryName}</TableCell>
                      <TableCell>{item.barcode}</TableCell>
                      <TableCell>{item.storeQuantity}</TableCell>
                      <TableCell>{item.warehouseQuantity}</TableCell>
                      <TableCell>{item.totalQuantity}</TableCell>
                      <TableCell>{item.latestInDate ? new Date(item.latestInDate).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        <StockStatus status={stockStatus}>
                          {stockStatus === 'danger' ? '긴급' : 
                          stockStatus === 'warning' ? '경고' : '정상'}
                        </StockStatus>
                      </TableCell>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <TableCell colSpan={9} style={{textAlign: 'center', padding: '30px 0'}}>
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
                      active={(page === stockList.number).toString()}
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

export default BranchesStockMonitoringCom; 