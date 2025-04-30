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

export const CriteriaSelect = styled.select`
    width: 120px;
    height: 36px;
    padding: 0 8px;
    padding-left: 20px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: white;
    

    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='gray' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5H7z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1px center;
    background-size: 30px;
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

export const ValueSelect = styled.select`
    width: 200px;
    height: 36px;
    padding: 0 12px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: white;
    text-align-last: center;

    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    /* 🔽 화살표 아이콘 경로 및 스타일 */
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='gray' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5H7z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1px center;  /* ✅ 아이콘을 오른쪽에 정렬 */
    background-size: 30px;

    &:focus {
        outline: none;
        border-color: #007bff;
    }
`;
