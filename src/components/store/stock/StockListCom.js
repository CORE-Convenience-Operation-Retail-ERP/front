import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import axios from '../../../service/axiosInstance';

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
import SelectBox from '../../../features/store/styles/common/SelectBox';
import {IconButton, PrimaryButton} from '../../../features/store/styles/common/Button.styled';
import {AiOutlineDownload} from "react-icons/ai";
import {BsFiletypeXml} from "react-icons/bs";
import {MdPostAdd, MdRestore} from "react-icons/md";
import {BiWrench} from "react-icons/bi";

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
                          onApplyChecks,
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

    const handleDownload = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/stock/download/excel', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'blob'
            });

            // 파일 다운로드
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            
            // 파일명 설정 (현재 날짜 포함)
            const now = new Date();
            const dateStr = now.toISOString().split('T')[0];
            link.setAttribute('download', `재고현황_${dateStr}.xlsx`);
            
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            alert('엑셀 파일이 다운로드되었습니다.');
        } catch (error) {
            console.error('엑셀 다운로드 실패:', error);
            alert('엑셀 다운로드에 실패했습니다.');
        }
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
                    <PageTitle>| 재고 현황</PageTitle>
                </FilterActionRow>
            </PageSection>
            <SearchBarRow style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
                marginBottom: "5px",
            }}>
                {/* 왼쪽: 카테고리 필터 */}
                <div style={{ minWidth: 320, display: "flex", justifyContent: "flex-start", marginRight: "-0.5rem" }}>
                    <FilterGroup>
                        <SelectBox
                            value={filters.parentCategoryId}
                            onChange={e => onParentChange(e.target.value)}
                            options={parentCategories.map(c => ({ value: c.id, label: c.name }))}
                            placeholder="대분류"
                        />
                        <SelectBox
                            value={filters.categoryId}
                            onChange={e => onChildChange(e.target.value)}
                            options={childCategories.map(c => ({ value: c.id, label: c.name }))}
                            placeholder="중분류"
                        />
                        <SelectBox
                            value={filters.subCategoryId}
                            onChange={e => onSubChildChange(e.target.value)}
                            options={grandChildCategories.map(c => ({ value: c.id, label: c.name }))}
                            placeholder="소분류"
                        />
                    </FilterGroup>
                </div>
                {/* 가운데: 검색바 */}
                <div style={{ flex: 1, display: "flex", justifyContent: "center", maginLeft: "2rem", marginTop: "1rem" }}>
                    <StoreSearchBar
                        filterOptions={[
                            { key: 'productName', label: '상품명', type: 'text', placeholder: '상품명 입력' },
                            { key: 'barcode', label: '바코드', type: 'text', placeholder: '바코드 입력' }
                        ]}
                        onSearch={onSearch}
                    />
                </div>
                {/* 오른쪽: 액션 버튼 */}
                <div style={{ minWidth: 380, display: "flex", justifyContent: "flex-end" }}>
                    <ActionGroup>
                        <IconButton onClick={handleDownload}>
                            Excel
                            <BsFiletypeXml />
                        </IconButton>

                        <IconButton onClick={() => window.location.href = '/store/inventory/check/register'}>
                            재고 등록
                            <MdPostAdd />
                        </IconButton>

                        <IconButton onClick={() => {
                            if (selectedIds.length > 0) {
                                onApplyChecks(selectedIds);
                                setSelectedIds([]);
                            } else {
                                onApplyChecks();
                            }
                        }}>
                            반영
                            <BiWrench />
                        </IconButton>

                        <IconButton onClick={() => {
                            if (selectedIds.length > 0) {
                                onRollbackChecks(selectedIds);
                                setSelectedIds([]);
                            } else {
                                onRollbackChecks();
                            }
                        }}>
                            복원
                            <MdRestore />
                        </IconButton>
                    </ActionGroup>
                </div>
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
                            <th>진열 재고</th>
                            <th>창고 재고</th>
                            <th>매장 재고</th>
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
                                <td>{r.checkItemId ? (
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            padding: '4px 10px',
                                            borderRadius: '12px',
                                            backgroundColor: r.isApplied ? '#dbeafe' : '#f3f4f6',
                                            color: r.isApplied ? '#1d4ed8' : '#6b7280',
                                            fontWeight: 'bold',
                                            fontSize: '12px'
                                        }}
                                    >
                                        {r.isApplied ? '복원 가능' : '반영 가능'}
                                    </span>
                                ) : null}</td>
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
