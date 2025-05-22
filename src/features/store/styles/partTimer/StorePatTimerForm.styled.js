import styled from 'styled-components';

export const FormWrapper = styled.div`
  max-width: 600px;
  margin: 60px auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Title = styled.h2`
    text-align: center;
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 40px;
    color: #111;
`;

export const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 16px;
`;

export const Label = styled.label`
    font-size: 15px;
    font-weight: 600;
    color: #333;
    display: block;

    ${({ required }) => required && `
    &::after {
      content: '*';
      color: red;
      margin-left: 4px;
    }
  `}
`;

export const Input = styled.input`
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;

    &:focus {
        border-color: #4096ff;
        outline: none;
        box-shadow: 0 0 0 2px rgba(64, 150, 255, 0.2);
    }
`;

export const Select = styled.select`
    width: 100%;
    padding: 10px 40px 10px 12px;  // 🔍 오른쪽에 공간 확보
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
    appearance: none;
    background-color: #fff;
    background-image: url("data:image/svg+xml,%3Csvg fill='none' stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 18px;

    &:focus {
        border-color: #4096ff;
        outline: none;
        box-shadow: 0 0 0 2px rgba(64, 150, 255, 0.2);
    }
`;

export const PhoneRow = styled.div`
    display: flex;
    gap: 8px;
`;

export const ActionButton = styled.button`
  width: 100%;
  padding: 14px;
  font-size: 15px;
  font-weight: 600;
  background-color: #000;
  color: #fff;
  border: none;
  cursor: pointer;
  margin-top: 32px;
  border-radius: 6px;

  &:hover {
    background-color: #222;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const OutlineButton = styled.button`
    padding: 10px 18px;
    font-size: 14px;
    font-weight: 500;
    border: 1.5px solid #222;
    background-color: #fff;
    color: #222;
    border-radius: 6px;
    cursor: pointer;
    height: 42px;
    white-space: nowrap;
    line-height: 1.4;
    transition: all 0.2s ease;

    &:hover {
        background-color: #f5f5f5;
    }

    &:active {
        background-color: #eee;
        transform: scale(0.98);
    }
`;


export const VerifiedMessage = styled.p`
  color: green;
  font-size: 13px;
  margin-top: 6px;
`;

export const ProfileImage = styled.img`
  display: block;
  width: 100px;
  height: 100px;
  margin: 0 auto 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ccc;
`;

export const FileInput = styled.input`
  padding: 8px 0;
`;

export const SubmitButton = styled.button`
    margin-top: 16px;
    padding: 14px;
    background-color: #000;
    color: #fff;
    font-weight: bold;
    font-size: 15px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.1s ease;

    &:hover {
        background-color: #222; // 밝은 검정으로 살짝 강조
    }

    &:active {
        transform: scale(0.98);
    }

    &:disabled {
        background-color: #999;
        cursor: not-allowed;
    }
`;

export const ReadonlyText = styled.p`
  font-size: 15px;
  padding: 12px 14px;
  background-color: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #1f2937;
`;