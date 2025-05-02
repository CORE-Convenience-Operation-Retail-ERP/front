import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    FormWrap,
    InfoRow,
    Label,
    Input,
    Select,
    ImgPreview,
    ButtonGroup,
    ActionButton,
  } from '../../../features/store/styles/partTimer/StorePartTimerOne.styled';

function PartTimerUpdateCom({ form, onChange, onDateChange, onSubmit }){
return(
<FormWrap>
      <h2>아르바이트 정보 수정</h2>

      {form.partImg && (
        <ImgPreview src={form.partImg} alt="프로필 이미지" />
      )}
        <InfoRow>
        <Label>사진 변경</Label>
        <Input type="file" name="file" onChange={onChange} />
        </InfoRow>
        
        <InfoRow>
        <Label>이름</Label>
        <Input name="partName" value={form.partName || ''} readOnly />
        </InfoRow>
        
        <InfoRow>
        <Label>생년월일</Label>
            <DatePicker
                selected={form.birthDate ? new Date(form.birthDate) : null} 
                onChange={(date) => onDateChange('birthDate', date)}        
                dateFormat="yyyy-MM-dd"
                placeholderText="날짜 선택"
            />
        </InfoRow>

        
        <InfoRow>
        <Label>직책</Label>
        <Input name="position" value={form.position || ''} onChange={onChange} />
        </InfoRow>

        <InfoRow>
        <Label>근무형태</Label>
        <Input name="workType" value={form.workType || ''} onChange={onChange} />
        </InfoRow>

        <InfoRow>
        <Label>전화번호</Label>
        <Input name="partPhone" value={form.partPhone || ''} onChange={onChange} />
        </InfoRow>

        <InfoRow>
        <Label>주소</Label>
        <Input name="partAddress" value={form.partAddress || ''} onChange={onChange} />
        </InfoRow>

        <InfoRow>
        <Label>급여형태</Label>
        <Select name="salaryType" value={form.salaryType} onChange={onChange}>
          <option value={0}>시급</option>
          <option value={1}>월급</option>
        </Select>
        </InfoRow>

        <InfoRow>
        <Label>시급</Label>
        <Input name="hourlyWage" value={form.hourlyWage || ''} onChange={onChange} />
        </InfoRow>

        <InfoRow>
        <Label>은행</Label>
        <Select name="accountBank" value={form.accountBank || ''} onChange={onChange} >
        <option value={1}>국민</option>
        <option value={2}>하나</option>
        <option value={3}>신한</option>
        </Select>
        </InfoRow>

        <InfoRow>
        <Label>계좌번호</Label>
        <Input name="accountNumber" value={form.accountNumber || ''} onChange={onChange} />
        </InfoRow>

        <InfoRow>
        <Label>상태</Label>
        <Select name="partStatus" value={form.partStatus} onChange={onChange}>
          <option value={1}>재직</option>
          <option value={2}>휴직</option>
        </Select>
        </InfoRow>

        <ButtonGroup>
        <ActionButton onClick={onSubmit}>수정 완료</ActionButton>
      </ButtonGroup>
    </FormWrap>
  )
}
export default PartTimerUpdateCom