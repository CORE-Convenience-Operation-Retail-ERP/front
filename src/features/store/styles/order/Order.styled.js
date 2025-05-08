import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 1rem;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 0.5rem;
    border: 1px solid #ccc;
    text-align: center;
  }
`;

export const OrderTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

export const OrderHead = styled.thead`
  background-color: #f3f4f6;
`;

export const OrderTh = styled.th`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  text-align: left;
`;

export const OrderTd = styled.td`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

export const HighlightId = styled.span`
  font-weight: bold;
  color: #2563eb;
`;
export const Btn = styled.button`
  padding: 8px 16px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  border: none;
    
  &:hover {
    opacity: 0.85;
  }
`;
