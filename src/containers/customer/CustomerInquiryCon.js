import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';

import MobileStepperCom from '../../components/customer/MobileStepperCom';
import StoreSelectorCom from '../../components/customer/StoreSelectorCom';
import CombinedInquiryFormCom from '../../components/customer/CombinedInquiryFormCom';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
`;

const wobble = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(5deg); }
  100% { transform: rotate(0deg); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const Header = styled.header`
  background-color: #6FC3ED;
  color: white;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  margin: 0;
`;

const Content = styled.main`
  flex: 1;
  padding: 15px;
  position: relative;
`;

const Footer = styled.footer`
  background-color: #f5f5f5;
  color: #666;
  text-align: center;
  padding: 15px;
  font-size: 0.8rem;
  border-top: 1px solid #e0e0e0;
`;

// 간단한 캐릭터 스타일
const Character = styled.div`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${wobble} 3s ease-in-out infinite;
  
  @media (max-width: 500px) {
    right: 10px;
    width: 30px;
    height: 30px;
  }
`;

const CharacterIcon = styled.div`
  font-size: 24px;
  
  @media (max-width: 500px) {
    font-size: 20px;
  }
`;

// 화면 하단에 표시될 도움말 캐릭터
const HelperCharacter = styled.div`
  position: fixed;
  bottom: 70px;
  right: 20px;
  width: 60px;
  height: 60px;
  background-color: #6FC3ED;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  animation: ${bounce} 2s ease infinite;
  z-index: 100;
  
  &:hover {
    transform: scale(1.1);
  }
  
  @media (max-width: 500px) {
    width: 50px;
    height: 50px;
    font-size: 16px;
    right: 15px;
    bottom: 65px;
  }
`;

const HelpTooltip = styled.div`
  position: absolute;
  right: 70px;
  bottom: 30px;
  background-color: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  max-width: 220px;
  font-size: 14px;
  color: #333;
  animation: ${fadeIn} 0.3s ease;
  
  &:after {
    content: '';
    position: absolute;
    right: -10px;
    bottom: 15px;
    border-width: 10px 0 10px 10px;
    border-style: solid;
    border-color: transparent transparent transparent white;
  }
`;

// 감사 페이지 관련 스타일
const ThankYouContainer = styled.div`
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out;
`;

const CheckIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #6FC3ED;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 20px;
  font-size: 40px;
  animation: ${bounce} 1.5s ease infinite;
`;

const ThankYouTitle = styled.h2`
  font-size: 1.8rem;
  color: #6FC3ED;
  margin-bottom: 20px;
`;

const ThankYouCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 25px;
`;

const ThankYouText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 15px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 20px 0;
`;

const ThankYouInfo = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 5px 0;
`;

const NewInquiryButton = styled.button`
  background-color: #6FC3ED;
  color: white;
  border: none;
  padding: 12px 20px;
  width: 100%;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #6FC3ED;
  }
`;

const ErrorContainer = styled.div`
  background-color: #ffebee;
  border-left: 4px solid #f44336;
  padding: 12px 16px;
  margin: 20px 0;
  border-radius: 4px;
`;

const ErrorTitle = styled.h3`
  color: #d32f2f;
  margin: 0 0 8px 0;
  font-size: 1rem;
`;

const ErrorMessage = styled.p`
  color: #d32f2f;
  margin: 0;
  font-size: 0.9rem;
`;

// 애니메이션 효과가 있는 환영 메시지
const WelcomeMessage = styled.div`
  background-color: #EDF7FE;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.8s ease;
  
  p {
    color: #333;
    margin: 5px 0;
  }
  
  strong {
    color: #6FC3ED;
  }
`;

const CustomerInquiryCon = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inquiryNumber, setInquiryNumber] = useState('');
  const [submittedDate, setSubmittedDate] = useState('');
  const [apiError, setApiError] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  
  const handleStoreSelect = (store) => {
    setSelectedStore(store);
  };
  
  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };
  
  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setApiError(null);
    
    try {
      // API 요청 데이터 구성
      const inquiryData = {
        storeId: selectedStore.storeId,
        inqPhone: formData.inqPhone,
        inqContent: formData.inqContent,
        inqType: formData.inquiryType,
        inqStatus: 2 // 기본값: 대기(2)
      };
      
      // 백엔드 서버 URL을 명시적으로 지정하고 withCredentials 옵션 추가
      const response = await axios.post('http://localhost:8080/api/customer/inquiry', inquiryData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        withCredentials: true // 쿠키와 인증 정보 전송
      });
      
      // 성공 시 감사 페이지 표시
      if (response.status === 200) {
        // 문의번호와 ID 설정
        setInquiryNumber(response.data.inquiryId ? response.data.inquiryId.toString().padStart(6, '0') : 
                         Math.floor(Math.random() * 1000000).toString().padStart(6, '0'));
        setSubmittedDate(new Date().toLocaleString('ko-KR'));
        setIsSubmitted(true);
      }
    } catch (error) {
      // 에러 처리 개선
      console.error('문의 제출 중 오류가 발생했습니다:', error);
      
      // 서버에서 받은 오류 메시지 표시
      if (error.response && error.response.data) {
        setApiError(error.response.data.message || '문의 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
      } else {
        setApiError('서버 연결에 실패했습니다. 인터넷 연결을 확인하거나 나중에 다시 시도해주세요.');
      }
      
      setIsSubmitting(false);
    }
  };
  
  const handleReset = () => {
    setCurrentStep(1);
    setSelectedStore(null);
    setIsSubmitted(false);
    setIsSubmitting(false);
    setApiError(null);
  };
  
  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };
  
  // 현재 단계에 따라 컴포넌트 렌더링
  const renderContent = () => {
    // 제출 완료 후 감사 페이지 표시
    if (isSubmitted) {
      return (
        <ThankYouContainer>
          <CheckIcon>✓</CheckIcon>
          <ThankYouTitle>문의가 성공적으로 접수되었습니다!</ThankYouTitle>
          
          <ThankYouCard>
            <ThankYouText>
              소중한 의견을 보내주셔서 감사합니다.<br/>고객님의 문의사항을 빠르게 확인하고 처리하도록 하겠습니다.
            </ThankYouText>
            <ThankYouText>
              고객센터에서 추가 정보가 필요한 경우,<br/>입력하신 연락처로 연락드릴 수 있습니다.
            </ThankYouText>
            
            <Divider />
            
            <ThankYouInfo>
              <strong>문의번호:</strong> {inquiryNumber}
            </ThankYouInfo>
            <ThankYouInfo>
              <strong>접수일시:</strong> {submittedDate}
            </ThankYouInfo>
          </ThankYouCard>
          
          <NewInquiryButton onClick={handleReset}>
            새 문의 작성하기
          </NewInquiryButton>
        </ThankYouContainer>
      );
    }
  
    // 일반 문의 프로세스
    switch (currentStep) {
      case 1:
        return (
          <>
            <WelcomeMessage>
              <p><strong>매장에 문의할 내용</strong>이 있으신가요?</p>
              <p>궁금한 점이나 의견을 남겨주시면 <br/> 빠르게 답변해 드리겠습니다.</p>
            </WelcomeMessage>
            <StoreSelectorCom
              onStoreSelect={handleStoreSelect}
              onNext={handleNext}
            />
          </>
        );
      case 2:
        return (
          <>
            {apiError && (
              <ErrorContainer>
                <ErrorTitle>오류가 발생했습니다</ErrorTitle>
                <ErrorMessage>{apiError}</ErrorMessage>
              </ErrorContainer>
            )}
            <CombinedInquiryFormCom
              store={selectedStore}
              onSubmit={handleSubmit}
              onBack={handleBack}
              isSubmitting={isSubmitting}
            />
          </>
        );
      default:
        return null;
    }
  };
  
  // 현재 단계에 따른 도움말 메시지
  const getHelpMessage = () => {
    switch (currentStep) {
      case 1:
        return "원하시는 매장을 선택해주세요. 검색창에 매장명이나 주소를 입력하시면 빠르게 찾을 수 있습니다.";
      case 2:
        return "문의 유형을 선택하고 연락처와 내용을 입력해주세요. 불편한 점이나 칭찬, 건의사항 모두 환영합니다.";
      default:
        return "무엇을 도와드릴까요?";
    }
  };
  
  return (
    <Container>
      <Header>
        <HeaderTitle>매장 문의하기</HeaderTitle>
      </Header>
      
      <Content>
        {!isSubmitted && <MobileStepperCom currentStep={currentStep} />}
        {renderContent()}
      </Content>
      
      {!isSubmitted && (
        <HelperCharacter onClick={toggleHelp}>
          도움말
        </HelperCharacter>
      )}
      
      {showHelp && (
        <HelpTooltip>
          {getHelpMessage()}
        </HelpTooltip>
      )}
      
      <Footer>
        &copy; {new Date().getFullYear()} 코어마케팅 All Rights Reserved.
      </Footer>
    </Container>
  );
};

export default CustomerInquiryCon; 