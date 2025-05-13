import React, { useState } from 'react';
import Pagination from '../common/Pagination';
import * as XLSX from 'xlsx';
import StoreSearchBar from '../common/StoreSearchBar';
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
                          onSubChildChange,
                          onApplyCheck,
                          onApplyChecks,
                          onApplyAllPendingChecks,
                          onRollbackCheck
                      }) {
    const [selectedIds, setSelectedIds] = useState([]);

    const toggleSelect = (checkId) => {
        setSelectedIds(prev =>
            prev.includes(checkId)
                ? prev.filter(id => id !== checkId)
                : [...prev, checkId]
        );
    };


    const handleDownload = () => {
        if (!stockList.length) return alert('데이터가 없습니다.');
        const sheet = XLSX.utils.json_to_sheet(stockList.map(item => ({
            상품명: item.productName,
            바코드: item.barcode,
            카테고리: item.categoryName,
            매장재고: item.storeQuantity,
            창고재고: item.warehouseQuantity,
            총재고: item.totalQuantity,
            실수량: item.realQuantity ?? '-',
            오차: item.difference > 0
                ? `+${item.difference}`
                : item.difference ?? '-',
            최근입고일: item.latestInDate?.split('T')[0] || '-',
            상태: item.promoStatus
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, sheet, '재고현황');
        XLSX.writeFile(wb, `stock_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const navigateToInventoryCheck = () => {
        window.location.href = '/store/inventory/check/register';
    };

    const renderDifference = (realQuantity, totalQuantity, isApplied) => {
        const isRealDefined = realQuantity !== null && realQuantity !== undefined;

        if (!isRealDefined || totalQuantity == null) return '-';

        if (isApplied) return <span style={{ color: 'gray' }}>0</span>;

        const diff = realQuantity - totalQuantity;
        const style = { color: diff > 0 ? 'blue' : diff < 0 ? 'red' : 'black' };
        return <span style={style}>{diff > 0 ? `+${diff}` : diff}</span>;
    };



    return (
        <Wrapper>
            <h2>재고 현황</h2>

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

                <DownloadButton onClick={handleDownload}>📥 엑셀 다운로드</DownloadButton>
                <DownloadButton onClick={navigateToInventoryCheck}>📋 실사 등록</DownloadButton>
                <DownloadButton onClick={() => onApplyChecks(selectedIds)}>✅ 선택 항목 반영</DownloadButton>
                <DownloadButton onClick={onApplyAllPendingChecks}>🚀 전체 실사 반영</DownloadButton>
            </FilterRow>

            <StoreSearchBar
                filterOptions={[
                    { key: 'productName', label: '상품명', type: 'text', placeholder: '상품명 입력' },
                    { key: 'barcode', label: '바코드', type: 'text', placeholder: '바코드 입력' }
                ]}
                onSearch={onSearch}
            />

            {isLoading ? (
                <Spinner />
            ) : (
                <Table>
                    <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={selectedIds.length === stockList.filter(r => r.checkId).length}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        const ids = stockList.filter(item => item.checkId).map(item => item.checkId);
                                        setSelectedIds(ids);
                                    } else {
                                        setSelectedIds([]);
                                    }
                                }}
                            />
                        </th>
                        <th>상품명</th>
                        <th>바코드</th>
                        <th>카테고리</th>
                        <th>매장 재고</th>
                        <th>창고 재고</th>
                        <th>총 재고</th>
                        <th>실 수량</th>
                        <th>오차</th>
                        <th>최근 입고일</th>
                        <th>상태</th>
                    </tr>
                    </thead>
                    <tbody>
                    {stockList.length ? stockList.map((r, i) => (
                        <tr key={i}>
                            <td>
                                {r.checkId && (
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(r.checkId)}
                                        onChange={() => toggleSelect(r.checkId)}
                                    />
                                )}
                            </td>
                            <td>{r.productName}</td>
                            <td>{r.barcode}</td>
                            <td>{r.categoryName}</td>
                            <td>{r.storeQuantity}</td>
                            <td>{r.warehouseQuantity}</td>
                            <td>{r.totalQuantity}</td>
                            <td>{r.realQuantity ?? '-'}</td>
                            <td>{renderDifference(r.realQuantity, r.totalQuantity, r.isApplied)}</td>
                            <td>{r.latestInDate?.split('T')[0] || '-'}</td>
                            <td>
                                {r.isApplied ? (
                                    <button onClick={() => onRollbackCheck(r.checkId)}>롤백</button>
                                ) : (
                                    <button onClick={() => onApplyCheck(r.checkId)}>실사 반영</button>
                                )}
                            </td>

                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={11} style={{ textAlign: 'center', padding: 20 }}>
                                조회된 데이터가 없습니다.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </Wrapper>
    );
}

export default StockListCom;