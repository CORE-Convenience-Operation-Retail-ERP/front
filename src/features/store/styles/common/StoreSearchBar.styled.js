import styled from 'styled-components';

export const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
`;

export const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 200px;
`;

export const Select = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

export const Button = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;