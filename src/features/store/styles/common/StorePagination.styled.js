import styled from 'styled-components';

export const PaginationWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

export const PageButton = styled.button`
  padding: 6px 12px;
  margin: 0 4px;
  border: none;
  background-color: #eee;
  color: #333;
  cursor: pointer;
  border-radius: 4px;

  &:disabled {
    background-color: #ddd;
    color: #aaa;
    cursor: not-allowed;
  }
`;

export const PageNumber = styled.button`
  padding: 6px 12px;
  margin: 0 2px;
  border: none;
  border-radius: 4px;
  background-color: ${({ $active }) => ($active ? '#007bff' : '#f0f0f0')};
  color: ${({ $active }) => ($active ? '#fff' : '#333')};
  font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
  cursor: pointer;

  &:hover {
    background-color: ${({ $active }) => ($active ? '#007bff' : '#ddd')};
  }
`;
