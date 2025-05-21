import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

export const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 500px;
  max-width: 90%;
  padding: 32px 24px;
`;

export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #111827;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
`;

export const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  max-width: 260px;
  width: 100%;
  box-sizing: border-box;
  background: #f9fafb;
  color: #22223b;
  text-align: ${props => props.align || 'left'};
  transition: box-shadow 0.18s, border-color 0.18s;
  &::placeholder {
    color: #b0b8c1;
    font-size: 15px;
  }
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.13);
    background: #fff;
  }
  &:hover {
    border-color: #a5b4fc;
    box-shadow: 0 1px 4px rgba(37,99,235,0.07);
  }
`;

export const Select = styled.select`
  padding: 10px 36px 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  max-width: 260px;
  width: 100%;
  box-sizing: border-box;
  background: #f9fafb url("data:image/svg+xml,%3Csvg width='16' height='16' fill='gray' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E") no-repeat right 12px center/18px 18px;
  color: #22223b;
  appearance: none;
  transition: box-shadow 0.18s, border-color 0.18s;
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.13);
    background: #fff;
  }
  &:hover {
    border-color: #a5b4fc;
    box-shadow: 0 1px 4px rgba(37,99,235,0.07);
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
`;

export const SubmitButton = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 10px 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background-color: #1d4ed8;
  }
`;

export const CancelButton = styled.button`
  background-color: #e5e7eb;
  color: #374151;
  padding: 10px 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background-color: #d1d5db;
  }
`;
