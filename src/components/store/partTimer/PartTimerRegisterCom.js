import React from 'react';
import {
    FormWrap,
    Label,
    Input,
    Select,
    FileInput,
    SubmitButton
} from '../../../features/store/styles/partTimer/StorePatTimerRegister.styled';
import CustomCalendar from '../../../components/store/common/CustomCalendar';

function PartTimerRegisterCom({
                                  form,
                                  onChange,
                                  onDateChange,
                                  onSubmit,
                                  onSendCode,
                                  onVerifyCode,
                                  onCodeChange,
                                  code,
                                  verified
                              }) {
    return (
        <FormWrap>
            <Label>이름</Label>
            <Input name="partName" value={form.partName} onChange={onChange} placeholder="이름" />

            <Label>직책</Label>
            <Select name="position" value={form.position} onChange={onChange}>
                <option value="">직책 선택</option>
                <option value="아르바이트">아르바이트</option>
                <option value="매니저">매니저</option>
                <option value="점장">점장</option>
            </Select>

            <Label>근무 형태</Label>
            <Select name="workType" value={form.workType} onChange={onChange}>
                <option value="">근무시간 선택</option>
                <option value="평일주간">평일주간</option>
                <option value="평일야간">평일야간</option>
                <option value="주말주간">주말주간</option>
                <option value="주말야간">주말야간</option>
            </Select>

            <Label>성별</Label>
            <Select name="partGender" value={form.partGender} onChange={onChange}>
                <option value="">선택</option>
                <option value="0">남</option>
                <option value="1">여</option>
            </Select>

            <Label>전화번호</Label>
            <Input name="partPhone" value={form.partPhone} onChange={onChange} placeholder="010-1234-5678" />
            {!verified && <>
                <button type="button" onClick={onSendCode}>인증번호 전송</button>
                <Input value={code} onChange={onCodeChange} placeholder="인증번호 입력" />
                <button type="button" onClick={onVerifyCode}>인증 완료</button>
            </>}

            <Label>주소</Label>
            <Input name="partAddress" value={form.partAddress} onChange={onChange} placeholder="주소" />

            <Label>생년월일</Label>
            <CustomCalendar
                selected={form.birthDate}
                onChange={(date) => onDateChange('birthDate', date)}
                placeholder="생년월일 선택"
            />

            <Label>입사일</Label>
            <CustomCalendar
                selected={form.hireDate}
                onChange={(date) => onDateChange('hireDate', date)}
                placeholder="입사일 선택"
            />

            <Label>급여 형태</Label>
            <Select name="salaryType" value={form.salaryType} onChange={onChange}>
                <option value="">선택</option>
                <option value="0">시급</option>
                <option value="1">월급</option>
            </Select>

            <Label>시급</Label>
            <Input name="hourlyWage" value={form.hourlyWage} onChange={onChange} placeholder="시급" />

            <Label>은행</Label>
            <Select name="accountBank" value={form.accountBank || ''} onChange={onChange}>
                <option value="">선택</option>
                <option value={1}>국민</option>
                <option value={2}>하나</option>
                <option value={3}>신한</option>
            </Select>

            <Label>계좌번호</Label>
            <Input name="accountNumber" value={form.accountNumber} onChange={onChange} placeholder="계좌번호" />

            <Label>재직 상태</Label>
            <Select name="partStatus" value={form.partStatus} onChange={onChange}>
                <option value="">선택</option>
                <option value="1">재직</option>
                <option value="0">퇴사</option>
            </Select>

            <Label>사진 업로드</Label>
            <FileInput type="file" name="file" onChange={onChange} accept="image/*" />

            {form.partImg && <img src={form.partImg} alt="미리보기" width="100" />}

            <SubmitButton onClick={onSubmit}>등록</SubmitButton>
        </FormWrap>
    );
}

export default PartTimerRegisterCom;
