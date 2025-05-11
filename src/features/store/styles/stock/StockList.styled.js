import styled, { keyframes } from 'styled-components';

export const Wrapper = styled.div`
  padding: 20px;
`;

// 필터 행: 대/중/소분류 + 검색/다운로드 버튼 배치
export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
`;

// 공통 셀렉트 스타일 (카테고리용)
export const CategorySelect = styled.select`
  padding: 6px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  min-width: 140px;
`;

// 엑셀 다운로드 버튼
export const DownloadButton = styled.button`
  padding: 6px 16px;
  font-size: 14px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: #45a049;
  }
`;

// 재고 테이블
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th, td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
  }

  thead {
    background-color: #f4f4f4;
    font-weight: bold;
  }

  tbody tr:hover {
    background-color: #fafafa;
  }

  td {
    word-break: break-word;
  }
`;

// 로딩 스피너 애니메이션
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// 로딩 스피너 컴포넌트
export const Spinner = styled.div`
  margin: 40px auto;
  width: 48px;
  height: 48px;
  border: 6px solid #eee;
  border-top: 6px solid #4caf50;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;
