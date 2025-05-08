import React from 'react';
import Pagination from '../common/Pagination';
import {
    Wrapper,
    SearchBar,
    Table
  } from '../../../features/store/styles/stock/StockList.styled';

function StockListCom({
  stockList,
  searchParams,
  onSearchChange,
  currentPage,
  totalPages,
  onPageChange,
}) {
  return (
    <Wrapper>
      <h2>재고 현황</h2>

      <SearchBar>
        <input
          type="text"
          placeholder="상품명"
          value={searchParams.productName}
          onChange={(e) => onSearchChange('productName', e.target.value)}
        />
        <input
          type="text"
          placeholder="바코드"
          value={searchParams.barcode}
          onChange={(e) => onSearchChange('barcode', e.target.value)}
        />
        <select
          value={searchParams.categoryId || ''}
          onChange={(e) =>
            onSearchChange('categoryId', e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">전체 카테고리</option>
          <option value="1">음료</option>
          <option value="2">스낵</option>
          <option value="3">가공식품</option>
          {/* 실제 카테고리 ID에 맞게 조정 */}
        </select>
      </SearchBar>

      <Table>
        <thead>
          <tr>
            <th>상품명</th>
            <th>바코드</th>
            <th>카테고리</th>
            <th>매장 재고</th>
            <th>창고 재고</th>
            <th>총 재고</th>
            <th>최근 입고일</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {stockList.length > 0 ? (
            stockList.map((item, index) => (
              <tr key={index}>
                <td>{item.productName}</td>
                <td>{item.barcode}</td>
                <td>{item.categoryName}</td>
                <td>{item.storeQuantity}</td>
                <td>{item.warehouseQuantity}</td>
                <td>{item.totalQuantity}</td>
                <td>{item.lastInDate ? item.lastInDate.split('T')[0] : '-'}</td>
                <td>{item.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">조회된 재고가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </Wrapper>
  );
}

export default StockListCom;