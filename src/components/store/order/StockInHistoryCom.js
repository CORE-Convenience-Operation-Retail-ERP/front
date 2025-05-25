import React from 'react';
import { Table } from '../../../features/store/styles/common/Table.styled';
import Pagination from '../common/Pagination';
import StoreSearchBar from '../common/StoreSearchBar';
import { PageTitle, PageWrapper } from '../../../features/store/styles/common/PageLayout';

/**
 * props:
 * - data: 입고 이력 목록
 * - pageInfo: 페이지 정보 (page, totalPages)
 * - onSearch: 필터링 함수
 * - onPageChange: 페이지 변경 핸들러
 * - searchBarKey: StoreSearchBar 리렌더용 key
 * - isLoading: 로딩 상태
 * - productMap: { [productId]: { unitPrice } } 형태의 단가 맵
 */
export default function StockInHistoryCom({
  data,
  pageInfo,
  onPageChange,
  onSearch,
  searchBarKey,
  productMap = {},
}) {
  const filterOptions = [
    { key: 'dateRange', label: '입고 기간', type: 'date-range' },
    { key: 'productName', label: '상품명', type: 'text' },
    { key: 'barcode', label: '바코드', type: 'text' },
    { key: 'partTimerName', label: '입고 담당자', type: 'text' }
  ];

  return (
    <PageWrapper>
      <PageTitle>┃ 입고 현황</PageTitle>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', margin: '8px 0 16px' }}>
        <StoreSearchBar
          key={searchBarKey}
          filterOptions={filterOptions}
          onSearch={onSearch}
        />
      </div>

      <Table>
        <thead>
          <tr>
            <th>입고일시</th>
            <th>발주번호</th>
            <th>담당자</th>
            <th>상품명</th>
            <th>바코드</th>
            <th>원가</th>
            <th>수량</th>
            <th>총액</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => {
            const totalAmount = r.unitPrice * r.inQuantity;

            return (
              <tr key={r.historyId}>
                <td>{new Date(r.inDate).toLocaleString()}</td>
                <td>{r.orderId ?? '-'}</td>
                <td>{r.partTimerName ?? '-'}</td>
                <td>{r.productName}</td>
                <td>{r.barcode ?? '-'}</td>
                <td>{r.unitPrice}</td>
                <td>{r.inQuantity}</td>
                <td>{totalAmount.toLocaleString()}원</td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Pagination
        currentPage={pageInfo.page}
        totalPages={pageInfo.totalPages}
        onPageChange={onPageChange}
      />
    </PageWrapper>
  );
}
