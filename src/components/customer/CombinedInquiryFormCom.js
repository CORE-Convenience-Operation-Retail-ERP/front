import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1rem;
  margin-bottom: 8px;
  color: #333;
`;

const Input = styled.input`
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const TextArea = styled.textarea`
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const TypesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const TypeCard = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid ${props => props.$selected ? '#4CAF50' : 'transparent'};
  background-color: ${props => props.$selected ? '#f1f8e9' : 'white'};
  
  &:hover {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`;

const TypeIcon = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  border-radius: 50%;
  background-color: ${props => {
    switch(props.type) {
      case 1: return '#ff5252'; // 컴플레인 - 빨강
      case 2: return '#4CAF50'; // 칭찬 - 초록
      case 3: return '#2196F3'; // 건의/문의 - 파랑
      default: return '#e0e0e0';
    }
  }};
  color: white;
  font-size: 1rem;
`;

const TypeInfo = styled.div`
  flex: 1;
`;

const TypeName = styled.h3`
  font-size: 1rem;
  margin: 0 0 3px 0;
  color: #333;
`;

const TypeDescription = styled.p`
  font-size: 0.8rem;
  color: #666;
  margin: 0;
`;

const StoreInfoBox = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
`;

const StoreName = styled.p`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
`;

const StoreAddress = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 20px;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const BackButton = styled(Button)`
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #4CAF50;
  color: white;
  border: none;
  
  &:hover {
    background-color: #45a049;
  }
`;

const ErrorText = styled.p`
  color: #d32f2f;
  font-size: 0.85rem;
  margin-top: 5px;
`;

const CombinedInquiryFormCom = ({ store, onSubmit, onBack, isSubmitting }) => {
  const [inquiryType, setInquiryType] = useState(null);
  const [formData, setFormData] = useState({
    inqPhone: '',
    inqContent: ''
  });
  const [errors, setErrors] = useState({});
  
  const inquiryTypes = [
    { 
      id: 1, 
      name: '컴플레인', 
      icon: '!',
      description: '서비스나 제품에 대한 불만 사항을 접수합니다.' 
    },
    { 
      id: 2, 
      name: '칭찬', 
      icon: '★',
      description: '직원이나 서비스에 대한 칭찬을 남깁니다.' 
    },
    { 
      id: 3, 
      name: '건의/문의', 
      icon: '?',
      description: '매장에 대한 건의사항이나 일반 문의를 접수합니다.' 
    }
  ];

  const handleInquiryTypeSelect = (typeId) => {
    setInquiryType(typeId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'inqPhone') {
      // 전화번호 자동 하이픈 추가
      const phoneNumber = value.replace(/-/g, '');
      let formattedNumber = '';
      
      if (phoneNumber.length <= 3) {
        formattedNumber = phoneNumber;
      } else if (phoneNumber.length <= 7) {
        formattedNumber = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
      } else {
        formattedNumber = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
      }
      
      setFormData({ ...formData, [name]: formattedNumber });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!inquiryType) {
      newErrors.inquiryType = '문의 유형을 선택해주세요';
    }
    
    if (!formData.inqPhone || formData.inqPhone.trim() === '') {
      newErrors.inqPhone = '연락처를 입력해주세요';
    } else if (!/^[0-9]{10,11}$/.test(formData.inqPhone.replace(/-/g, ''))) {
      newErrors.inqPhone = '올바른 연락처 형식을 입력해주세요';
    }
    
    if (!formData.inqContent || formData.inqContent.trim() === '') {
      newErrors.inqContent = '문의 내용을 입력해주세요';
    } else if (formData.inqContent.length < 10) {
      newErrors.inqContent = '문의 내용은 최소 10자 이상 입력해주세요';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        inquiryType
      });
    }
  };

  const getInquiryTypeName = (type) => {
    switch(type) {
      case 1: return '컴플레인';
      case 2: return '칭찬';
      case 3: return '건의/문의';
      default: return '';
    }
  };

  return (
    <Container>
      <Title>문의 작성</Title>
      
      <StoreInfoBox>
        <StoreName>{store.storeName}</StoreName>
        <StoreAddress>{store.storeAddr}</StoreAddress>
      </StoreInfoBox>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>문의 유형</Label>
          <TypesContainer>
            {inquiryTypes.map((type) => (
              <TypeCard
                key={type.id}
                $selected={inquiryType === type.id}
                onClick={() => handleInquiryTypeSelect(type.id)}
              >
                <TypeIcon type={type.id}>{type.icon}</TypeIcon>
                <TypeInfo>
                  <TypeName>{type.name}</TypeName>
                  <TypeDescription>{type.description}</TypeDescription>
                </TypeInfo>
              </TypeCard>
            ))}
          </TypesContainer>
          {errors.inquiryType && <ErrorText>{errors.inquiryType}</ErrorText>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="inqPhone">연락처</Label>
          <Input
            type="text"
            id="inqPhone"
            name="inqPhone"
            placeholder="010-0000-0000"
            value={formData.inqPhone || ''}
            onChange={handleInputChange}
          />
          {errors.inqPhone && <ErrorText>{errors.inqPhone}</ErrorText>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="inqContent">문의 내용</Label>
          <TextArea
            id="inqContent"
            name="inqContent"
            placeholder="문의 내용을 입력해주세요..."
            value={formData.inqContent || ''}
            onChange={handleInputChange}
          />
          {errors.inqContent && <ErrorText>{errors.inqContent}</ErrorText>}
        </FormGroup>
        
        <ButtonContainer>
          <BackButton type="button" onClick={onBack} disabled={isSubmitting}>
            이전
          </BackButton>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? '제출 중...' : '제출하기'}
          </SubmitButton>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default CombinedInquiryFormCom; 