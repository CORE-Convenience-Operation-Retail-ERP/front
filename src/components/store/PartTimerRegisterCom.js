import React from 'react';
import { FormWrap, Label, Input, Select, DateInput, FileInput, SubmitButton } from '../../features/store/styles/common/StoreParttimer.styled';

function PartTimerRegisterCom({ form, onChange, onDateChange, onSubmit }){
    return(
        <FormWrap>
            <Label>이름</Label>
            <Input name="partName" value={form.partName} onChange={onChange} />

            <Label>직책</Label>
            <Select name="position" value={form.position} onChange={onChange}>
                <option value="">직책 선택</option>
                <option value="알바">알바</option>
                <option value="점장">점장</option>
            </Select>

            <Label>근무 형태</Label>
            <Input name="workType" value={form.workType} onChange={onChange} />

            <Label>성별</Label>
            <Select name="partGender" value={form.partGender} onChange={onChange}>
                <option value="">선택</option>
                <option value="0">남</option>
                <option value="1">여</option>
            </Select>

            <Label>전화번호</Label>
            <Input name="partPhone" value={form.partPhone} onChange={onChange} />

            <Label>주소</Label>
            <Input name="partAddress" value={form.partAddress} onChange={onChange} />

            <Label>생년월일</Label>
            <DateInput
                selected={form.birthDate}
                onChange={(date) => onDateChange('birthDate', date)}
                dateFormat="yyyy-MM-dd"
            />

            <Label>입사일</Label>
            <DateInput
                selected={form.hireDate}
                onChange={(date) => onDateChange('hireDate', date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                dateFormat="yyyy-MM-dd HH:mm"
            />

            <Label>급여 형태</Label>
            <Select name="salaryType" value={form.salaryType} onChange={onChange}>
                <option value="">선택</option>
                <option value="0">시급</option>
                <option value="1">월급</option>
            </Select>

            <Label>시급</Label>
            <Input name="hourlyWage" value={form.hourlyWage} onChange={onChange} />

            <Label>은행</Label>
            <Input name="accountBank" value={form.accountBank} onChange={onChange} />

            <Label>계좌번호</Label>
            <Input name="accountNumber" value={form.accountNumber} onChange={onChange} />

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