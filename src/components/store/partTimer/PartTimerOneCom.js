import React from 'react';
import {
    FormWrapper,
    Title,
    InputGroup,
    Label,
    ProfileImage,
    ActionButton, ReadonlyText
} from '../../../features/store/styles/partTimer/StorePatTimerForm.styled';

function PartTimerOneCom({ form, onEdit, onResign, onRejoin }) {
    console.log("form", form)
    return (
        <FormWrapper>
            <Title>직원 상세 정보</Title>

            {form.partImg && <ProfileImage src={form.partImg} alt="프로필 이미지" />}

            <InputGroup>
                <Label>이름</Label>
                <p>{form.partName}</p>
            </InputGroup>

            <InputGroup>
                <Label>직책</Label>
                <p>{form.position}</p>
            </InputGroup>

            <InputGroup>
                <Label>근무형태</Label>
                <p>{form.workType}</p>
            </InputGroup>

            <InputGroup>
                <Label>전화번호</Label>
                <p>{form.partPhone}</p>
            </InputGroup>

            <InputGroup>
                <Label>주소</Label>
                <p>{form.partAddress}</p>
            </InputGroup>
            <InputGroup>
            <Label>성별</Label>
            <p>
                {form.partGender === 1
                ? '남자'
                : form.partGender === 2
                ? '여자'
                : '-'}
            </p>
            </InputGroup>
            <InputGroup>
                <Label>입사일</Label>
                <p>{form.hireDate ? new Date(form.hireDate).toISOString().slice(0, 10) : '-'}</p>
            </InputGroup>

            <InputGroup>
                <Label>퇴사일</Label>
                <p>{form.resignDate ? new Date(form.resignDate).toISOString().slice(0, 10) : '-'}</p>
            </InputGroup>

            <InputGroup>
                <Label>급여형태</Label>
                <p>{form.salaryType === 0 ? '시급' : '월급'}</p>
            </InputGroup>

            <InputGroup>
                <Label>시급</Label>
                <p>{form.hourlyWage?.toLocaleString()} 원</p>
            </InputGroup>

            <InputGroup>
                <Label>은행</Label>
                <p>
                    {{
                        1: "국민",
                        2: "하나",
                        3: "신한"
                    }[form.accountBank] || "-"}
                </p>
            </InputGroup>

            <InputGroup>
                <Label>계좌번호</Label>
                <p>{form.accountNumber}</p>
            </InputGroup>

            <InputGroup>
                <Label>상태</Label>
                <p>{form.partStatus === 1 ? '재직 중' : '퇴사'}</p>
            </InputGroup>

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <ActionButton onClick={onEdit}>수정</ActionButton>
                {form.partStatus === 1 && (
                    <ActionButton danger onClick={onResign}>퇴사 처리</ActionButton>
                )}
                {form.partStatus === 0 && (
                    <ActionButton onClick={onRejoin}>재직 처리</ActionButton>
                )}
            </div>
        </FormWrapper>
    );
}

export default PartTimerOneCom;