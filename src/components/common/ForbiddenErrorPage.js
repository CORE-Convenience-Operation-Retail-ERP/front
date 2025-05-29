import React, { useEffect } from 'react';
import ErrorPage from './ErrorPage';
import { ErrorPageContainer, HeaderText, IconCircle, MessageText } from './ErrorPageStyles';
import forbiddenImg from '../../assets/error/forbidden.png';
import { useNavigate } from 'react-router-dom';

// 접근 제한 에러페이지
const ForbiddenErrorPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(-1);
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <ErrorPage
      message="해당 페이지에 접근할 권한이 없습니다."
      code="403"
      customHeader={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src={forbiddenImg} 
            alt="403 Forbidden 아이콘" 
            style={{ width: 350, height: 350, objectFit: 'contain' }} 
          />
          <ErrorPageContainer
            bgColor="#f7faff"
            borderColor="#3f51b5"
            textColor="#283593"
          >
            <HeaderText color="#283593">
              접근 제한
            </HeaderText>
            <MessageText
              color="#3f51b5"
              borderColor="#e8eaf6"
            >
              현재 계정으로는 이 페이지를 볼 수 없습니다.
            </MessageText>
          </ErrorPageContainer>
        </div>
      }
    />
  );
};

export default ForbiddenErrorPage; 