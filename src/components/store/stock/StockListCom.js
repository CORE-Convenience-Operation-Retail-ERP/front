import React from 'react';
import Pagination from '../common/Pagination';
import * as XLSX from 'xlsx';
import StoreSearchBar from '../../../components/store/common/StoreSearchBar';
import {
  Wrapper,
  FilterRow,
  CategorySelect,
  DownloadButton,
  Table,
  Spinner
} from '../../../features/store/styles/stock/StockList.styled';

function StockListCom({
  stockList,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
  parentCategories,
  childCategories,
  grandChildCategories,
  filters,
  onParentChange,
  onChildChange,
  onSubChildChange
}) {
  const handleDownload = () => {
    if (!stockList.length) return alert('데이터가 없습니다.');
    const sheet = XLSX.utils.json_to_sheet(
      stockList.map(item => ({
        상품명: item.productName,
        바코드: item.barcode,
        카테고리: item.categoryName,
        매장재고: item.storeQuantity,
        창고재고: item.warehouseQuantity,
        총재고: item.totalQuantity,
        최근입고일: item.latestInDate?.split('T')[0] || '-',
        상태: item.promoStatus
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, '재고현황');
    XLSX.writeFile(wb, `stock_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <Wrapper>
      <h2>재고 현황</h2>
      
        {/* 카테고리 필터 */}
        <FilterRow>
        <CategorySelect value={filters.parentCategoryId} onChange={e => onParentChange(e.target.value)}>
          <option value="">대분류</option>
          {parentCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </CategorySelect>
        <CategorySelect value={filters.categoryId} onChange={e => onChildChange(e.target.value)}>
          <option value="">중분류</option>
          {childCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </CategorySelect>
        <CategorySelect value={filters.subCategoryId} onChange={e => onSubChildChange(e.target.value)}>
          <option value="">소분류</option>
          {grandChildCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </CategorySelect>
        <DownloadButton onClick={handleDownload}>📥 엑셀</DownloadButton>
      </FilterRow>

      {/* 상품명/바코드 검색 */}
      <StoreSearchBar
        filterOptions={[
          { key: 'productName', label: '상품명', type: 'text', placeholder: '상품명 입력' },
          { key: 'barcode', label: '바코드', type: 'text', placeholder: '바코드 입력' }
        ]}
        onSearch={onSearch}
      />
    
      {/* 재고 테이블 */}
      {isLoading ? <Spinner /> : (
        <Table>
          <thead>
            <tr><th>상품명</th><th>바코드</th><th>카테고리</th><th>매장 재고</th><th>창고 재고</th><th>총 재고</th><th>최근 입고일</th><th>상태</th></tr>
          </thead>
          <tbody>
            {stockList.length ? stockList.map((r, i) => (
              <tr key={i}><td>{r.productName}</td><td>{r.barcode}</td><td>{r.categoryName}</td><td>{r.storeQuantity}</td><td>{r.warehouseQuantity}</td><td>{r.totalQuantity}</td><td>{r.latestInDate?.split('T')[0] || '-'}</td><td>{r.promoStatus}</td></tr>
            )) : <tr><td colSpan={8} style={{ textAlign: 'center', padding: 20 }}>조회된 데이터가 없습니다.</td></tr>}
          </tbody>
        </Table>
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </Wrapper>
  );
}

export default StockListCom;