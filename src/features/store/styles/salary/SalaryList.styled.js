import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

export const Thead = styled.thead`
  background-color: #f3f4f6;
`;

export const Tbody = styled.tbody`
  tr:hover {
    background-color: #f9fafb;
  }
`;

export const Tr = styled.tr`
  border-bottom: 1px solid #e5e7eb;
`;

export const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
`;

export const Td = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: #4b5563;
  vertical-align: middle;
`;

export const ButtonGroup = styled.div`
  margin-top: 12px;
  margin-bottom: 16px;
  display: flex;
  gap: 10px;
`;

export const ViewToggleButton = styled.button`
  padding: 8px 16px;
  background-color: ${({ active }) => (active ? '#3b82f6' : '#e5e7eb')};
  color: ${({ active }) => (active ? 'white' : '#374151')};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: ${({ active }) => (active ? '#2563eb' : '#d1d5db')};
  }
`;
