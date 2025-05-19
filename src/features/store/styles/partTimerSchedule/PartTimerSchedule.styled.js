import styled from 'styled-components';

export const ScheduleWrapper = styled.div`
  padding: 20px;
  background-color: #fff;
`;
export  const ModalWrapper = styled.div`
  position: absolute;
  top: 30%;
  left: 35%;
  padding: 20px;
  background: white;
  border: 1px solid #ccc;
  z-index: 999;
  width: 300px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`;


export const CalendarNav = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;

  button {
    padding: 8px 16px;
    background-color: #f2f2f2;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: #e0e0e0;
    }
  }
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;

  button {
    padding: 0.5rem 1rem;
    &.active {
      background-color: #03bd9e;
      color: white;
    }
  }
`;



