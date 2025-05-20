import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f9fa;
  text-align: center;
  padding: 20px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const ErrorTitle = styled.h1`
  font-size: 2.5rem;
  color: #343a40;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  font-size: 1.2rem;
  color: #6c757d;
  margin-bottom: 2rem;
  max-width: 600px;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  color: #495057;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#007bff' : '#e9ecef'};
  color: ${props => props.primary ? 'white' : '#495057'};
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: ${props => props.primary ? '#0069d9' : '#dee2e6'};
    transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const InfoText = styled.p`
  font-size: 0.9rem;
  color: #868e96;
  margin-top: 1rem;
`;

const ErrorDetails = styled.details`
  margin-top: 1rem;
  max-width: 600px;
  text-align: left;
  
  summary {
    cursor: pointer;
    color: #495057;
    font-weight: bold;
    margin-bottom: 0.5rem;
    transition: color 0.3s;
    
    &:hover {
      color: #007bff;
    }
  }
  
  pre {
    background-color: #f1f3f5;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 0.9rem;
    color: #495057;
  }
`;

const ErrorPage = ({ 
  message = "죄송합니다. 페이지를 찾을 수 없습니다.",
  code,
  details,
  icon = "⚠️",
  customHeader = null
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // URL의 state에서 추가 정보 가져오기
  const stateMessage = location.state?.message;
  const stateDetails = location.state?.details;
  const stateIcon = location.state?.icon;
  
  // props 또는 location.state에서 오류 정보 가져오기
  const errorMessage = message || stateMessage || "죄송합니다. 페이지를 찾을 수 없습니다.";
  const errorDetails = details || stateDetails;
  const errorIcon = icon || stateIcon || "⚠️";

  const handleGoBack = () => {
    // 이전 페이지로 이동 
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleGoHome = () => {
    // 홈으로 이동
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'ROLE_ADMIN') {
      navigate('/headquarters/dashboard');
    } else if (userRole === 'ROLE_MANAGER') {
      navigate('/store/home');
    } else {
      navigate('/login');
    }
  };

  return (
    <ErrorContainer>
      {customHeader ? (
        customHeader
      ) : (
        <>
          <ErrorIcon>{errorIcon}</ErrorIcon>
          <ErrorTitle>오류가 발생했습니다</ErrorTitle>
        </>
      )}
      
      <ErrorMessage>{errorMessage}</ErrorMessage>
      
      <InfoText>
        문제가 계속되면 관리자에게 문의해주세요.
      </InfoText>
      
      {errorDetails && (
        <ErrorDetails>
          <summary>자세한 오류 정보</summary>
          <pre>{typeof errorDetails === 'object' ? JSON.stringify(errorDetails, null, 2) : errorDetails}</pre>
        </ErrorDetails>
      )}
      
      <ButtonContainer>
        <Button onClick={handleGoBack}>
          이전 페이지로 돌아가기
        </Button>
        <Button primary onClick={handleGoHome}>
          홈으로 이동
        </Button>
      </ButtonContainer>
    </ErrorContainer>
  );
};

export default ErrorPage; 