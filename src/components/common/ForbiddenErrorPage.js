import React from 'react';
import ErrorPage from './ErrorPage';
import styled, { keyframes } from 'styled-components';
import { ErrorPageContainer, HeaderText, IconCircle, MessageText } from './ErrorPageStyles';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(30, 172, 181, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(30, 172, 181, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(30, 172, 181, 0);
  }
`;

const StatusIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #1EACB5;
  position: absolute;
  top: 25px;
  left: -8px;
  animation: ${pulse} 2s infinite;
`;

const ForbiddenErrorPage = () => {
  return (
    <ErrorPage
      message="해당 페이지에 접근할 권한이 없습니다."
      code="403"
      customHeader={
        <ErrorPageContainer 
          bgColor="#f5fbfc" 
          borderColor="#1EACB5" 
          textColor="#015D70"
        >
          <StatusIndicator />
          <HeaderText color="#015D70">
            <IconCircle 
              bgColor="rgba(30, 172, 181, 0.1)" 
              color="#015D70" 
              borderColor="rgba(30, 172, 181, 0.3)"
            >
              403
            </IconCircle>
            접근 제한
          </HeaderText>
          <MessageText 
            color="#1976d2" 
            borderColor="#e0f2f3"
          >
            현재 계정으로는 이 페이지를 볼 수 없습니다.
          </MessageText>
        </ErrorPageContainer>
      }
      details="접근 권한을 확인하시거나 관리자에게 권한 요청을 해주세요."
    />
  );
};

export default ForbiddenErrorPage; 