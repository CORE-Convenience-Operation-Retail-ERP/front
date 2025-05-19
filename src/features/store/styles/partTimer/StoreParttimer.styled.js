import styled from "styled-components";

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    color: #333;
    background-color: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

export const Thead = styled.thead`
    background-color: #f4f6f8;
`;

export const Th = styled.th`
    padding: 12px 16px;
    border-bottom: 1px solid #ddd;
    text-align: left;
    font-weight: 600;
    font-size: 13px;
    color: #555;
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #f9fbff;
    }
`;

export const Td = styled.td`
    padding: 12px 16px;
    border-bottom: 1px solid #eee;
    vertical-align: middle;
`;

export const ClickableTd = styled(Td)`
    cursor: pointer;
    font-weight: bold;
    color: #333;

    &:hover {
        color: #1a73e8;
        text-decoration: underline;    
    }
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #4096ff;
`;

export const ActionButton = styled.button`
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: #0056b3;
  }
`;