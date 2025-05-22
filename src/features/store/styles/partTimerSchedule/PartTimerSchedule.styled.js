import styled from 'styled-components';

export const ScheduleWrapper = styled.div`
  padding: 20px;
  background-color: #fff;
`;
export const ModalWrapper = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 32px 40px;              
    background: white;
    border: 1px solid #ccc;
    z-index: 999;
    width: 400px;                
    min-height: 500px;             
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    border-radius: 8px;             
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
        color: #333;

        &:hover {
            background-color: #007eff;
            color: white;
        }

        &:disabled {
            background-color: #f2f2f2;
            color: #bbb;
            border-color: #ddd;
            cursor: not-allowed;
            opacity: 1;
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
      background-color: #007eff;
      color: white;
    }
  }
`;



