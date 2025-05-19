import React from 'react';
import ErrorPage from './ErrorPage';
import { ErrorPageContainer, HeaderText, IconCircle, MessageText } from './ErrorPageStyles';

const NotFoundErrorPage = () => {
  return (
    <ErrorPage
      message="요청하신 페이지를 찾을 수 없습니다."
      code="404"
      customHeader={
        <ErrorPageContainer
          bgColor="#f7fbff"
          borderColor="#1976d2"
          textColor="#1565c0"
        >
          <HeaderText color="#1565c0">
            <IconCircle
              bgColor="rgba(25, 118, 210, 0.1)"
              color="#1565c0"
              borderColor="rgba(25, 118, 210, 0.3)"
            >
              404
            </IconCircle>
            페이지 없음
          </HeaderText>
          <MessageText
            color="#1976d2"
            borderColor="#e3f2fd"
          >
            페이지가 이동되었거나 삭제되었을 수 있습니다.
          </MessageText>
        </ErrorPageContainer>
      }
      details="URL을 다시 확인하시거나 메인 페이지로 이동해주세요."
    />
  );
};

export default NotFoundErrorPage; 