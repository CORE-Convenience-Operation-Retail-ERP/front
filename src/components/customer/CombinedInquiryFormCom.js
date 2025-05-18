import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { containsProfanity, findProfanities } from '../../utils/ProfanityFilter';

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
    border-color: #6FC3ED;
    box-shadow: 0 0 0 2px rgba(111, 195, 237, 0.2);
  }
`;

/**
 * 텍스트 영역 스타일 컴포넌트
 * - 기본 스타일은 이전과 동일하게 유지
 * - 비속어 감지 시 경고 스타일 추가
 */
const TextArea = styled.textarea`
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  width: 100%; /* 너비 100%로 설정 */
  box-sizing: border-box; /* 패딩과 테두리를 너비에 포함 */
  line-height: 1.5;
  
  &:focus {
    outline: none;
    border-color: #6FC3ED;
    box-shadow: 0 0 0 2px rgba(111, 195, 237, 0.2);
  }
  
  ${props => props.$hasProfanity && `
    border-color: #ff9800;
    background-color: #fff8e1;
  `}
`;

/**
 * 하이라이트 오버레이 컴포넌트
 * - TextArea와 정확히 동일한 크기와 위치에 배치
 * - 비속어 하이라이트 스타일 정의
 */
const TextAreaOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none; /* 클릭 이벤트를 실제 텍스트 영역에 전달 */
  padding: 12px 15px;
  font-size: 1rem;
  white-space: pre-wrap;
  overflow: hidden;
  color: transparent;
  line-height: 1.5;
  
  .profanity-highlight {
    background-color: rgba(255, 87, 34, 0.25);
    border-radius: 2px;
    border-bottom: 2px solid #ff5722;
    padding: 0 1px;
    margin: 0 -1px;
    animation: pulsate 2s ease-in-out infinite;
  }
  
  @keyframes pulsate {
    0%, 100% { 
      background-color: rgba(255, 87, 34, 0.25);
    }
    50% { 
      background-color: rgba(255, 87, 34, 0.5);
    }
  }
`;

/**
 * 텍스트 영역 컨테이너
 * - TextArea와 TextAreaOverlay를 포함하는 상대적 위치 컨테이너
 * - 이전 너비를 유지하기 위해 display: block과 width: 100% 설정
 */
const TextAreaContainer = styled.div`
  position: relative;
  display: block;
  width: 100%;
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
  border: 2px solid ${props => props.$selected ? '#6FC3ED' : 'transparent'};
  background-color: ${props => props.$selected ? '#EDF7FE' : 'white'};
  
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
      case 2: return '#6FC3ED'; // 칭찬 - 파랑
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
  background-color: #6FC3ED;
  color: white;
  border: none;
  
  &:hover {
    background-color: #5fb0da;
  }
`;

const ErrorText = styled.p`
  color: #d32f2f;
  font-size: 0.85rem;
  margin-top: 5px;
`;

const WarningText = styled(ErrorText)`
  color: #f57c00;
  background-color: #fff3e0;
  padding: 8px 12px;
  border-radius: 4px;
  border-left: 3px solid #f57c00;
  font-weight: 500;
  animation: fadeIn 0.3s ease-in;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ProfanityHighlightMessage = styled.div`
  margin-top: 4px;
  font-size: 0.8rem;
  color: #f57c00;
  display: flex;
  align-items: center;
  animation: fadeIn 0.5s ease-in;
  
  span {
    margin-right: 5px;
  }
`;

const ProfanityCount = styled.span`
  display: inline-block;
  background-color: #ff5722;
  color: white;
  border-radius: 12px;
  padding: 2px 6px;
  font-size: 0.7rem;
  margin-left: 4px;
  min-width: 16px;
  text-align: center;
`;

const CombinedInquiryFormCom = ({ store, onSubmit, onBack, isSubmitting }) => {
  const [inquiryType, setInquiryType] = useState(null);
  const [formData, setFormData] = useState({
    inqPhone: '',
    inqContent: ''
  });
  const [errors, setErrors] = useState({});
  const [profanityWarning, setProfanityWarning] = useState(false);
  const [foundProfanities, setFoundProfanities] = useState([]);
  const [highlightedText, setHighlightedText] = useState('');
  const textAreaRef = useRef(null);
  const overlayRef = useRef(null);
  
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

  /**
   * 텍스트 영역과 오버레이 동기화
   * - 스크롤 시 오버레이도 같이 스크롤되도록 함
   * - 크기 변경 시에도 오버레이 위치 업데이트
   */
  useEffect(() => {
    if (textAreaRef.current && overlayRef.current) {
      const scrollSync = () => {
        if (!textAreaRef.current || !overlayRef.current) return;
        overlayRef.current.scrollTop = textAreaRef.current.scrollTop;
        overlayRef.current.scrollLeft = textAreaRef.current.scrollLeft;
      };
      const resizeObserver = new ResizeObserver(() => {
        scrollSync();
      });
      textAreaRef.current.addEventListener('scroll', scrollSync);
      resizeObserver.observe(textAreaRef.current);
      return () => {
        if (textAreaRef.current) {
          textAreaRef.current.removeEventListener('scroll', scrollSync);
        }
        resizeObserver.disconnect();
      };
    }
  }, []);

  // 욕설 하이라이트 처리 함수
  const processTextForHighlight = (text) => {
    if (!text) return '';
    
    // 욕설 위치 파악
    const profanities = findProfanities(text);
    setFoundProfanities(profanities);
    
    if (profanities.length === 0) {
      setHighlightedText(text);
      return text;
    }
    
    // 하이라이트된 HTML 생성
    let result = '';
    let lastIndex = 0;
    
    for (const { index, length } of profanities) {
      // 욕설 이전 텍스트 추가
      if (index > lastIndex) {
        result += escapeHtml(text.substring(lastIndex, index));
      }
      
      // 욕설 하이라이트 처리
      const profanityText = escapeHtml(text.substring(index, index + length));
      result += `<span class="profanity-highlight">${profanityText}</span>`;
      
      lastIndex = index + length;
    }
    
    // 남은 텍스트 추가
    if (lastIndex < text.length) {
      result += escapeHtml(text.substring(lastIndex));
    }
    
    setHighlightedText(result);
    return text;
  };
  
  // HTML 이스케이프 함수
  const escapeHtml = (text) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\n/g, '<br>');
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
    } else if (name === 'inqContent') {
      // 욕설 검사 및 하이라이트 처리
      const processedText = processTextForHighlight(value);
      const hasProfanity = foundProfanities.length > 0;
      setProfanityWarning(hasProfanity);
      
      // 입력 값 업데이트
      setFormData({ ...formData, [name]: processedText });
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
    } else if (foundProfanities.length > 0) {
      newErrors.inqContent = '부적절한 표현이 포함되어 있습니다. 다시 작성해주세요.';
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
          <TextAreaContainer>
            <TextArea
              ref={textAreaRef}
              id="inqContent"
              name="inqContent"
              placeholder="문의 내용을 입력해주세요..."
              value={formData.inqContent || ''}
              onChange={handleInputChange}
              $hasProfanity={profanityWarning}
            />
            <TextAreaOverlay 
              ref={overlayRef}
              dangerouslySetInnerHTML={{ __html: highlightedText.replace(/\n/g, '<br>') }}
            />
          </TextAreaContainer>
          
          {profanityWarning && 
            <>
              <WarningText>
                <span role="img" aria-label="warning">⚠️</span> 부적절한 표현이 감지되었습니다. 수정 후 제출해주세요.
              </WarningText>
              <ProfanityHighlightMessage>
                <span role="img" aria-label="info">ℹ️</span>
                부적절한 표현
                <ProfanityCount>{foundProfanities.length}</ProfanityCount>
                개가 하이라이트 되었습니다
              </ProfanityHighlightMessage>
            </>
          }
          {errors.inqContent && <ErrorText>{errors.inqContent}</ErrorText>}
        </FormGroup>
        
        <ButtonContainer>
          <BackButton type="button" onClick={onBack} disabled={isSubmitting}>
            이전
          </BackButton>
          <SubmitButton type="submit" disabled={isSubmitting || profanityWarning}>
            {isSubmitting ? '제출 중...' : '제출하기'}
          </SubmitButton>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

export default CombinedInquiryFormCom; 