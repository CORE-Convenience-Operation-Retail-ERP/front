import styled, { keyframes } from 'styled-components';

// 공통 애니메이션
export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

// 공통 컨테이너 스타일
export const ErrorPageContainer = styled.div`
  font-family: 'Pretendard', sans-serif;
  background-color: ${props => props.bgColor || '#f7fbff'};
  border-left: 4px solid ${props => props.borderColor || '#1976d2'};
  color: ${props => props.textColor || '#1565c0'};
  padding: 20px 25px;
  border-radius: 4px;
  position: relative;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  max-width: 500px;
  width: 100%;
  animation: ${fadeInUp} 0.5s ease-out;
`;

// 헤더 텍스트 스타일
export const HeaderText = styled.div`
  font-size: 1.8rem;
  font-weight: 600;
  color: ${props => props.color || '#1565c0'};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
`;

// 아이콘 원 스타일
export const IconCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.bgColor || 'rgba(25, 118, 210, 0.1)'};
  margin-right: 12px;
  color: ${props => props.color || '#1565c0'};
  font-weight: bold;
  border: 2px solid ${props => props.borderColor || 'rgba(25, 118, 210, 0.3)'};
`;

// 메시지 텍스트 스타일
export const MessageText = styled.div`
  font-size: 1.1rem;
  color: ${props => props.color || '#1976d2'};
  margin-top: 12px;
  margin-left: 8px;
  padding-left: 12px;
  border-left: 2px solid ${props => props.borderColor || '#e3f2fd'};
`; 