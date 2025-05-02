import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const FormWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
`;

export const Label = styled.label`
    font-weight: 600;
    margin-top: 10px;
    display: block;
    color: #333;

    &::after {
        content: '*';
        color: red;
        margin-left: 4px;
    }
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
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
`;

export const FileInput = styled.input`
    padding: 8px 0;
`;

export const SubmitButton = styled.button`
    margin-top: 16px;
    padding: 12px;
    background-color: #4096ff;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.1s ease;

    &:hover {
        background-color: #1a73e8;
    }

    &:active {
        transform: scale(0.98);
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

export const CustomDateInput = styled(DatePicker)`
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
    background-color: #fff;

    &:focus {
        border-color: #4096ff;
        outline: none;
        box-shadow: 0 0 0 2px rgba(64, 150, 255, 0.2);
    }

    &::placeholder {
        color: #aaa;
    }

    .react-datepicker__day--outside-month {
        color: #ccc !important; /* 비활성 날짜 흐리게 */
    }

    .react-datepicker__day--today {
        background-color: #e6f0ff;
        border-radius: 50%;
        color: #1a73e8;
        font-weight: bold;
    }

    .react-datepicker__day--selected {
        background-color: #4096ff;
        color: white;
        border-radius: 50%;
    }
`;

export const CalendarHeaderWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 8px;
`;

export const MonthYearRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 24px;
`;

export const MonthNav = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const YearNav = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const NavButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  color: #333;

  &:hover {
    color: #4096ff;
  }
`;

export const NavSelect = styled.select`
  font-size: 14px;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  color: #333;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  appearance: none;
  cursor: pointer;

  &:hover {
    border-color: #4096ff;
  }
`;
