import React from 'react';
import styled from 'styled-components';

const StepperContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  padding: 10px 0;
  width: 100%;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  width: 45%;
`;

const StepCircle = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#4CAF50' : props.completed ? '#4CAF50' : '#e0e0e0'};
  color: ${props => props.active || props.completed ? 'white' : '#757575'};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  font-size: 16px;
`;

const StepLabel = styled.div`
  font-size: 14px;
  color: ${props => props.active ? '#4CAF50' : '#757575'};
  text-align: center;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
`;

const StepConnector = styled.div`
  position: absolute;
  top: 17px;
  height: 2px;
  background-color: ${props => props.completed ? '#4CAF50' : '#e0e0e0'};
  width: 100%;
  left: -50%;
  z-index: 0;
`;

const MobileStepperCom = ({ currentStep }) => {
  const steps = [
    { label: '매장 선택', step: 1 },
    { label: '문의 작성', step: 2 }
  ];

  return (
    <StepperContainer>
      {steps.map((step, index) => (
        <Step key={step.step}>
          {index > 0 && (
            <StepConnector completed={currentStep > index} />
          )}
          <StepCircle 
            active={currentStep === step.step} 
            completed={currentStep > step.step}
          >
            {currentStep > step.step ? '✓' : step.step}
          </StepCircle>
          <StepLabel active={currentStep === step.step}>
            {step.label}
          </StepLabel>
        </Step>
      ))}
    </StepperContainer>
  );
};

export default MobileStepperCom; 