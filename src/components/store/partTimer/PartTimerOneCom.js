import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
    FormWrap,
    InfoRow,
    Label,
    Value,
    ImgPreview,
    ButtonGroup,
    ActionButton
  } from '../../../features/store/styles/partTimer/StorePartTimerOne.styled';

function PartTimerOneCom({ form, onEdit, onResign , onRejoin }){
  const navigate = useNavigate();

    return(
        <FormWrap>
        <h2>아르바이트 상세 정보</h2>
  
        {/* 프로필 이미지 */}
        {form.partImg && (
            <ImgPreview src={form.partImg} alt="프로필" />
        )}
  
        <InfoRow>
          <Label>이름</Label>
          <Value>{form.partName}</Value>
        </InfoRow>
  
        <InfoRow>
          <Label>직책</Label>
          <Value>{form.position}</Value>
        </InfoRow>
  
        <InfoRow>
          <Label>근무형태</Label>
          <Value>{form.workType}</Value>
        </InfoRow>
  
        <InfoRow>
          <Label>전화번호</Label>
          <Value>{form.partPhone}</Value>
        </InfoRow>
  
        <InfoRow>
          <Label>주소</Label>
          <Value>{form.partAddress}</Value>
        </InfoRow>
  
        <InfoRow>
          <Label>성별</Label>
          <Value>{form.partGender === 0 ? '남' : '여'}</Value>
        </InfoRow>
  
        <InfoRow>
          <Label>입사일</Label>
          <Value>{form.hireDate ? format(new Date(form.hireDate), 'yyyy-MM-dd HH:mm') : '-'}</Value>
        </InfoRow>
  
        <InfoRow>
          <Label>퇴사일</Label>
          <Value>{form.resignDate ? format(new Date(form.resignDate), 'yyyy-MM-dd HH:mm') : '-'}</Value>
        </InfoRow>
  
        <InfoRow>
          <Label>급여형태</Label>
          <Value>{form.salaryType === 0 ? '시급' : '월급'}</Value>
        </InfoRow>
  
        <InfoRow>
          <Label>시급</Label>
          <Value>{form.hourlyWage?.toLocaleString()} 원</Value>
        </InfoRow>
  
        <InfoRow>
          <Label>은행</Label>
          <Value>{form.accountBank}</Value>
        </InfoRow>
  
        <InfoRow>
          <Label>계좌번호</Label>
          <Value>{form.accountNumber}</Value>
        </InfoRow>
  
        <InfoRow>
          <Label>상태</Label>
          <Value>{form.partStatus === 1 ? '재직' : '퇴사'}</Value>
        </InfoRow>
  
        <ButtonGroup>
  <ActionButton onClick={onEdit}>수정</ActionButton>

      {form.partStatus === 1 && (
        <ActionButton danger onClick={onResign}>퇴사 처리</ActionButton>
      )}

      {form.partStatus === 0 && (
        <ActionButton onClick={onRejoin}>재직 처리</ActionButton> 
      )}

  <ActionButton onClick={() => navigate(-1)}>목록으로</ActionButton>
</ButtonGroup>
      </FormWrap>
    );
  }
export default PartTimerOneCom