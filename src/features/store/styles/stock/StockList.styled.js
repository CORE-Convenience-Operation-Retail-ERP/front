// StockList.styled.js (리팩토링)

import styled, { keyframes } from 'styled-components';

// 전체 감싸는 래퍼
export const Wrapper = styled.div`
    padding: 24px;
    background-color: #fdfdfd;
`;

// 필터/버튼 행
export const FilterRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
`;

// 셀렉트 박스 스타일
export const CategorySelect = styled.select`
    padding: 8px 12px;
    font-size: 15px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: white;
    min-width: 140px;

    &:focus {
        outline: none;
        border-color: #007Eff;
    }
`;

// 공통 버튼 스타일
export const DownloadButton = styled.button`
    padding: 8px 14px;
    font-size: 14px;
    background-color: #007Eff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    white-space: nowrap;

    &:hover {
        background-color: #0056b3;
    }
`;

// 테이블 스타일
export const Table = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 14px;
    background-color: white;
    box-shadow: 0 0 4px rgba(0,0,0,0.05);

    th, td {
        border-bottom: 1px solid #eaeaea;
        padding: 14px 10px;
        text-align: center;
    }

    thead {
        background-color: #f5f7fa;
        font-weight: bold;
        border-bottom: 2px solid #dcdcdc;
    }

    tbody tr:hover {
        background-color: #f9fbff;
    }

    td {
        word-break: keep-all;
    }

    td:first-child, th:first-child {
        padding-left: 12px;
    }

    td:last-child, th:last-child {
        padding-right: 12px;
    }
`;

// 스피너 애니메이션
const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

// 스피너
export const Spinner = styled.div`
    margin: 40px auto;
    width: 48px;
    height: 48px;
    border: 6px solid #eee;
    border-top: 6px solid #007bff;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
`;

// 상단 필터 + 버튼 묶음
export const FilterActionRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 12px;
`;

// 좌측 카테고리 필터
export const FilterGroup = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
`;

// 우측 버튼 그룹
export const ActionGroup = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

// 카테고리 아래 검색창
export const SearchBarRow = styled.div`
  margin-bottom: 24px;
`;

