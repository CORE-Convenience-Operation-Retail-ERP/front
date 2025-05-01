import styled from 'styled-components';

export const FormWrap = styled.div`
  max-width: 700px;
  margin: 40px auto;
  padding: 32px;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.06);
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-of-type {
    border-bottom: none;
  }
`;

export const Label = styled.div`
  font-weight: bold;
  color: #555;
  width: 30%;
`;

export const Value = styled.div`
  width: 70%;
  text-align: right;
  color: #333;
  word-break: break-all;
`;

export const ImgPreview = styled.img`
  display: block;
  margin: 0 auto 24px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ddd;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
  gap: 12px;
`;

export const ActionButton = styled.button`
  padding: 10px 20px;
  font-size: 15px;
  border: none;
  border-radius: 6px;
  background-color: ${props => props.danger ? '#dc3545' : '#007bff'};
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.danger ? '#c82333' : '#0056b3'};
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #fff;
`;
