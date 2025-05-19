import React from 'react';
import ErrorPage from './ErrorPage';
import { ErrorPageContainer, HeaderText, IconCircle, MessageText } from './ErrorPageStyles';

const ServerErrorPage = () => {
  return (
    <ErrorPage
      message="서버 내부 오류가 발생했습니다."
      code="500"
      customHeader={
        <ErrorPageContainer
          bgColor="#FFF4F4"
          borderColor="#F44336"
          textColor="#D32F2F"
        >
          <HeaderText color="#D32F2F">
            <IconCircle
              bgColor="rgba(244, 67, 54, 0.1)"
              color="#D32F2F"
              borderColor="rgba(244, 67, 54, 0.3)"
            >
              500
            </IconCircle>
            서버 오류
          </HeaderText>
          <MessageText
            color="#F44336"
            borderColor="#FFEBEE"
          >
            요청을 처리하는 동안 서버에 문제가 발생했습니다.
          </MessageText>
        </ErrorPageContainer>
      }
      details="잠시 후 다시 시도하시거나 관리자에게 문의해주세요."
    />
  );
};

export default ServerErrorPage; 