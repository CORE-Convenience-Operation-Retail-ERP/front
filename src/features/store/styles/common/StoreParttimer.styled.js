import styled from 'styled-components';

export const FormWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
`;

export const Label = styled.label`
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
`;

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
`;

export const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
`;

export const FileInput = styled.input`
  padding: 6px 0;
  font-size: 14px;
`;

export const SubmitButton = styled.button`
  margin-top: 20px;
  padding: 12px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export const DateInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  cursor: pointer;
`;