import React from 'react';
import ErrorPage from './ErrorPage';
import styled, { keyframes } from 'styled-components';
import { ErrorPageContainer, HeaderText, MessageText, blink } from './ErrorPageStyles';

const SignalIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-right: 12px;
  position: relative;
`;

const SignalBar = styled.div`
  width: 4px;
  height: ${props => props.height || '10px'};
  background-color: ${props => props.active ? '#3f51b5' : 'rgba(63, 81, 181, 0.3)'};
  margin: 0 2px;
  border-radius: 1px;
  animation: ${props => props.active ? blink : 'none'} 1.5s infinite;
`;

const NetworkErrorPage = () => {
  return (
    <ErrorPage
      message="네트워크 연결에 문제가 발생했습니다."
      code="NETWORK_ERROR"
      customHeader={
        <ErrorPageContainer
          bgColor="#f7faff"
          borderColor="#3f51b5"
          textColor="#283593"
        >
          <HeaderText color="#283593">
            <SignalIcon>
              <SignalBar height="8px" />
              <SignalBar height="12px" />
              <SignalBar height="16px" active />
              <SignalBar height="20px" />
              <SignalBar height="24px" />
            </SignalIcon>
            네트워크 오류
          </HeaderText>
          <MessageText
            color="#3f51b5"
            borderColor="#e8eaf6"
          >
            서버와의 연결이 원활하지 않습니다.
          </MessageText>
        </ErrorPageContainer>
      }
      details="인터넷 연결을 확인하거나 잠시 후 다시 시도해주세요."
    />
  );
};

export default NetworkErrorPage; 