import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

import Pagination from '../common/Pagination';
import StoreSearchBar from '../common/StoreSearchBar';

import {
    FilterActionRow,
    FilterGroup,
    ActionGroup,
    SearchBarRow,
    PageWrapper,
    PageTitle,
    PageSection,
    TableWrapper
} from '../../../features/store/styles/common/PageLayout';
import { Table } from '../../../features/store/styles/common/Table.styled';
import { CategorySelect } from '../../../features/store/styles/stock/StockList.styled';
import { PrimaryButton } from '../../../features/store/styles/common/Button.styled';

function StockListCom({
                          stockList,
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
                          onRollbackCheck,
                          onRollbackChecks,
                      }) {
    const [selectedIds, setSelectedIds] = useState([]);

    const selectable = useMemo(
        () => stockList.filter(r => r.checkItemId).map(r => r.checkItemId),
        [stockList]
    );

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    const toggleAll = (checked) => {
        setSelectedIds(checked ? selectable : []);
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
            오차: item.difference > 0 ? `+${item.difference}` : item.difference ?? '-',
            최근입고일: item.latestInDate?.split('T')[0] || '-',
            상태: item.promoStatus,
            실사상태: item.isApplied ? '반영됨' : '미반영'
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, sheet, '재고현황');
        XLSX.writeFile(wb, `stock_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const renderDifference = (real, total, applied) => {
        if (real == null || total == null) return '-';
        if (applied) return <span style={{ color: 'gray' }}>0</span>;
        const d = real - total;
        return <span style={{ color: d > 0 ? 'blue' : d < 0 ? 'red' : 'black' }}>{d > 0 ? `+${d}` : d}</span>;
    };

    const navigate = useNavigate();

    const handleNameClick = (productId) => {
        navigate(`/store/stock/detail/${productId}`);
    };

    return (
        <PageWrapper>
            <PageSection>
                <FilterActionRow>
            <PageTitle>재고 현황</PageTitle>
                    <FilterGroup style={{ marginLeft: '25rem' }}>
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
                    </FilterGroup>

                    <ActionGroup>
                        <PrimaryButton onClick={handleDownload}>엑셀 다운로드</PrimaryButton>
                        <PrimaryButton onClick={() => window.location.href = '/store/inventory/check/register'}>실사 등록</PrimaryButton>
                        <PrimaryButton onClick={() => {
                            if (selectedIds.length > 0) {
                                onApplyChecks(selectedIds);
                                setSelectedIds([]);
                            } else {
                                onApplyChecks();
                            }
                        }}>실사 반영(선택/전체)</PrimaryButton>
                        <PrimaryButton onClick={() => {
                            if (selectedIds.length > 0) {
                                onRollbackChecks(selectedIds);
                                setSelectedIds([]);
                            } else {
                                onRollbackChecks();
                            }
                        }}>실사 복원(선택/전체)</PrimaryButton>
                    </ActionGroup>
                </FilterActionRow>
            </PageSection>
            <SearchBarRow style={{ marginLeft: '33.5rem', marginTop: '-3rem' }}>
                <StoreSearchBar
                    filterOptions={[
                        { key: 'productName', label: '상품명', type: 'text', placeholder: '상품명 입력' },
                        { key: 'barcode', label: '바코드', type: 'text', placeholder: '바코드 입력' }
                    ]}
                    onSearch={onSearch}
                />
            </SearchBarRow>


            <TableWrapper>
                {stockList.length === 0 ? (
                    <Table>
                        <tbody>
                        <tr>
                            <td colSpan={11} style={{ textAlign: 'center', padding: 20 }}>
                                조회된 데이터가 없습니다.
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                ) : (
                    <Table>
                        <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === selectable.length && selectable.length > 0}
                                    onChange={e => toggleAll(e.target.checked)}
                                />
                            </th>
                            <th>상품명</th>
                            <th>바코드</th>
                            <th>카테고리</th>
                            <th>매장 재고</th>
                            <th>창고 재고</th>
                            <th>총 재고</th>
                            <th>실수량</th>
                            <th>오차</th>
                            <th>최근 입고일</th>
                            <th>상태</th>
                        </tr>
                        </thead>
                        <tbody>
                        {stockList.map((r, i) => (
                            <tr key={i}>
                                <td>
                                    <input
                                        type="checkbox"
                                        disabled={!r.checkItemId}
                                        checked={selectedIds.includes(r.checkItemId)}
                                        onChange={() => toggleSelect(r.checkItemId)}
                                    />
                                </td>
                                <td
                                    style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
                                    title="상세 보기"
                                    onClick={() => handleNameClick(r.productId)}
                                >
                                    {r.productName}
                                </td>
                                <td>{r.barcode}</td>
                                <td>{r.categoryName}</td>
                                <td>{r.storeQuantity}</td>
                                <td>{r.warehouseQuantity}</td>
                                <td>{r.totalQuantity}</td>
                                <td>{r.realQuantity ?? '-'}</td>
                                <td>{renderDifference(r.realQuantity, r.totalQuantity, r.isApplied)}</td>
                                <td>{r.latestInDate?.split('T')[0] || '-'}</td>
                                <td>
                                    {r.checkItemId ? (
                                        r.isApplied ? (
                                            <PrimaryButton onClick={() => onRollbackCheck(r.checkItemId)}>복원</PrimaryButton>
                                        ) : (
                                            <PrimaryButton onClick={() => onApplyCheck(r.checkItemId)}>반영</PrimaryButton>
                                        )
                                    ) : null}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                )}
            </TableWrapper>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </PageWrapper>
    );
}

export default StockListCom;
