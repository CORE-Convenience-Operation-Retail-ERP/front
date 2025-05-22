// 서버 내부 에러페이지
import React from 'react';
import ErrorPage from './ErrorPage';
import { ErrorPageContainer, HeaderText, IconCircle, MessageText } from './ErrorPageStyles';
import serverErrorImg from '../../assets/error/servererror.png';

const ServerErrorPage = () => {
  return (
    <ErrorPage
      message="서버 오류가 발생했습니다."
      code="500"
      customHeader={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src={serverErrorImg} 
            alt="500 Server Error 아이콘" 
            style={{ width: 400, height: 400, objectFit: 'contain' }} 
          />
          <ErrorPageContainer
            bgColor="#f7fbff"
            borderColor="#1976d2"
            textColor="#1565c0"
          >
            <HeaderText color="#1565c0">
              서버 오류
            </HeaderText>
            <MessageText
              color="#1976d2"
              borderColor="#e3f2fd"
            >
              서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
            </MessageText>
          </ErrorPageContainer>
        </div>
      }
    />
  );
};

export default ServerErrorPage; 