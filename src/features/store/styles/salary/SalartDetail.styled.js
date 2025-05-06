import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

export const Th = styled.th`
  padding: 10px;
  background-color: #f9fafb;
  text-align: left;
  color: #374151;
`;

export const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
  color: #4b5563;
`;

export const ChartWrapper = styled.div`
  width: 100%;
  height: 300px;
  margin-bottom: 1.5rem;
`;

const ChartContainer = styled.div`
  margin-top: 2rem; // 제목과 그래프 사이 여백
  .chart-title {
    margin-bottom: 1.5rem;
    font-weight: bold;
    font-size: 1.2rem;
  }
`;