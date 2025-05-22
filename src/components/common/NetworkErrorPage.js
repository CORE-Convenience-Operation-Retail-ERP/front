import React from 'react';
import ErrorPage from './ErrorPage';
import styled, { keyframes } from 'styled-components';
import { ErrorPageContainer, HeaderText, MessageText, blink } from './ErrorPageStyles';
import networkImg from '../../assets/error/network.png';

const NetworkErrorPage = () => {
  return (
    <ErrorPage
      message="네트워크 연결에 문제가 발생했습니다."
      code="NETWORK_ERROR"
      customHeader={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src={networkImg} 
            alt="네트워크 오류 아이콘" 
            style={{ width: 300, height: 300, objectFit: 'contain' }} 
          />
          <ErrorPageContainer
            bgColor="#f7faff"
            borderColor="#3f51b5"
            textColor="#283593"
          >
            <HeaderText color="#283593">
              네트워크 오류
            </HeaderText>
            <MessageText
              color="#3f51b5"
              borderColor="#e8eaf6"
            >
              인터넷 연결을 확인하거나 잠시 후 다시 시도해주세요.
            </MessageText>
          </ErrorPageContainer>
        </div>
      }
    />
  );
};

export default NetworkErrorPage; 