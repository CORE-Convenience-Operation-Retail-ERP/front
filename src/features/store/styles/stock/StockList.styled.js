import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 20px;
`;

export const SearchBar = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;

  input, select {
    padding: 6px 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

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

export const DownloadButton = styled.button`
  margin: 16px 0;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #45a049;
  }
`;
