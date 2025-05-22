// 404 Not Found 에러페이지
import React from 'react';
import ErrorPage from './ErrorPage';
import { ErrorPageContainer, HeaderText, IconCircle, MessageText } from './ErrorPageStyles';
import notfoundImg from '../../assets/error/notfound.png';

const NotFoundErrorPage = () => {
  return (
    <ErrorPage
      message="요청하신 페이지를 찾을 수 없습니다."
      code="404"
      customHeader={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src={notfoundImg} 
            alt="404 Not Found 아이콘" 
            style={{ width: 400, height: 400, objectFit: 'contain' }} 
          />
          <ErrorPageContainer
            bgColor="#f7fbff"
            borderColor="#1976d2"
            textColor="#1565c0"
          >
            <HeaderText color="#1565c0">
              페이지 없음
            </HeaderText>
            <MessageText
              color="#1976d2"
              borderColor="#e3f2fd"
            >
              페이지가 이동되었거나 삭제되었을 수 있습니다.
            </MessageText>
          </ErrorPageContainer>
        </div>
      }
    />
  );
};

export default NotFoundErrorPage; 