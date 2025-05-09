import React from 'react';
import Pagination from '../common/Pagination';
import StoreSearchBar from '../../store/common/StoreSerchBar';
import * as XLSX from 'xlsx';
import { Wrapper, Table, DownloadButton } from '../../../features/store/styles/stock/StockList.styled';
import {SearchWrap} from "../../../features/store/styles/common/StoreSearchBar.styled";

function StockListCom({
                          stockList,
                          currentPage,
                          totalPages,
                          onPageChange,
                          filterOptions,
                          onSearchChange,
                      }) {
    // ✅ 엑셀 다운로드 핸들러
    const handleDownload = () => {
        if (stockList.length === 0) {
            alert('다운로드할 데이터가 없습니다.');
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(
            stockList.map(item => ({
                '상품명': item.productName,
                '바코드': item.barcode,
                '카테고리': item.categoryName,
                '매장 재고': item.warehouseQuantity,
                '창고 재고': item.storeQuantity,
                '총 재고': item.totalQuantity,
                '최근 입고일': item.lastInDate ? item.lastInDate.split('T')[0] : '-',
                '상태': item.status,
            }))
        );

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, '재고현황');

        const now = new Date();
        const formattedDate = now.toISOString().split('T')[0];
        XLSX.writeFile(workbook, `stock_list_${formattedDate}.xlsx`);
    };

    return (
        <Wrapper>
            <h2>재고 현황</h2>

            {/*  검색 필터 바 */}

            <SearchWrap>
                <StoreSearchBar
                    filterOptions={filterOptions}
                    onSearch={onSearchChange}
                />
                <DownloadButton onClick={handleDownload}>📥 엑셀 다운로드</DownloadButton>
            </SearchWrap>

            {/*  재고 테이블 */}
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
                    stockList.map(({ productName, barcode, categoryName, warehouseQuantity, storeQuantity, totalQuantity, latestInDate, promoStatus }, index) => (
                        <tr key={index}>
                            <td>{productName}</td>
                            <td>{barcode}</td>
                            <td>{categoryName}</td>
                            <td>{warehouseQuantity}</td>
                            <td>{storeQuantity}</td>
                            <td>{totalQuantity}</td>
                            <td>{latestInDate ? latestInDate.split('T')[0] : '-'}</td>
                            <td>{promoStatus}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                            📦 조회된 재고가 없습니다.
                        </td>
                    </tr>
                )}
                </tbody>
            </Table>

            {/* ✅ 페이지네이션 */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </Wrapper>
    );
}

export default StockListCom;