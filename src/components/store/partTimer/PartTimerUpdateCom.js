import React from 'react';
import {
    FormWrapper,
    Title,
    InputGroup,
    Label,
    Input,
    Select,
    ActionButton,
    OutlineButton,
    PhoneRow,
    VerifiedMessage,
    ProfileImage
} from '../../../features/store/styles/partTimer/StorePatTimerForm.styled';

import AddressSearchCustom from '../common/AddressSearchCustom';
import CustomCalendar from '../common/CustomCalendar';
import {ButtonRow} from "../../../features/store/styles/common/Button.styled";

function PartTimerUpdateCom({
                                form,
                                onChange,
                                onDateChange,
                                onSubmit,
                                code,
                                onCodeChange,
                                onSendCode,
                                onVerifyCode,
                                verified,
                                originalPhone
                            }) {
    const phoneChanged = form.partPhone !== originalPhone;


    return (
        <FormWrapper>
            <Title>아르바이트 정보 수정</Title>

            {form.partImg && <ProfileImage src={form.partImg} alt="프로필 이미지" />}

            <InputGroup>
                <Label>사진 변경</Label>
                <Input type="file" name="file" onChange={onChange} />
            </InputGroup>

            <InputGroup>
                <Label>이름</Label>
                <Input name="partName" value={form.partName || ''} readOnly />
            </InputGroup>

            <InputGroup>
                <Label>생년월일</Label>
                <CustomCalendar
                    selected={form.birthDate ? new Date(form.birthDate) : null}
                    onChange={(date) => onDateChange('birthDate', date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="날짜 선택"
                />
            </InputGroup>

            <InputGroup>
                <Label>전화번호</Label>
                <Input name="partPhone" value={form.partPhone || ''} onChange={onChange} />
            </InputGroup>

            {phoneChanged && (
                <>
                    <InputGroup>
                        <Label>인증번호</Label>
                        <PhoneRow>
                            <Input
                                type="text"
                                value={code}
                                onChange={onCodeChange}
                                placeholder="인증번호 입력"
                            />
                            <OutlineButton type="button" onClick={onSendCode}>전송</OutlineButton>
                            <OutlineButton type="button" onClick={onVerifyCode} disabled={verified}>확인</OutlineButton>
                        </PhoneRow>
                        {verified && <VerifiedMessage>✅ 인증 완료</VerifiedMessage>}
                    </InputGroup>
                </>
            )}

            <InputGroup>
                <Label>직책</Label>
                <Select name="position" value={form.position} onChange={onChange}>
                    <option value="">직책 선택</option>
                    <option value="아르바이트">아르바이트</option>
                    <option value="매니저">매니저</option>
                    <option value="점장">점장</option>
                </Select>
            </InputGroup>

            <InputGroup>
                <Label>근무형태</Label>
                <Select name="workType" value={form.workType} onChange={onChange}>
                    <option value="">근무시간 선택</option>
                    <option value="평일주간">평일주간</option>
                    <option value="평일야간">평일야간</option>
                    <option value="주말주간">주말주간</option>
                    <option value="주말야간">주말야간</option>
                </Select>
            </InputGroup>

            <InputGroup>
                <Label required>주소</Label>
                <AddressSearchCustom
                    value={form.partAddress}
                    onChange={onChange}
                    detailAddress={form.partAddressDetail}
                    onDetailAddressChange={(val) =>
                        onChange({ target: { name: 'partAddressDetail', value: val } })
                    }
                    onSelect={({ fullAddress }) =>
                        onChange({ target: { name: 'partAddress', value: fullAddress } })
                    }
                />
            </InputGroup>

            <InputGroup>
                <Label>급여형태</Label>
                <Select name="salaryType" value={form.salaryType} onChange={onChange}>
                    <option value={0}>시급</option>
                    <option value={1}>월급</option>
                </Select>
            </InputGroup>

            <InputGroup>
                <Label>시급</Label>
                <Input name="hourlyWage" value={form.hourlyWage || ''} onChange={onChange} />
            </InputGroup>

            <InputGroup>
                <Label>은행</Label>
                <Select name="accountBank" value={form.accountBank || ''} onChange={onChange}>
                    <option value={1}>국민</option>
                    <option value={2}>하나</option>
                    <option value={3}>신한</option>
                </Select>
            </InputGroup>

            <InputGroup>
                <Label>계좌번호</Label>
                <Input name="accountNumber" value={form.accountNumber || ''} onChange={onChange} />
            </InputGroup>

            <InputGroup>
                <Label>상태</Label>
                <Select name="partStatus" value={form.partStatus} onChange={onChange}>
                    <option value={1}>재직</option>
                    <option value={2}>휴직</option>
                </Select>
            </InputGroup>

            <ButtonRow>
                <ActionButton type="button" onClick={() => window.history.back()}>
                    뒤로가기
                </ActionButton>
                <ActionButton onClick={onSubmit} disabled={phoneChanged && !verified}>
                    수정 완료
                </ActionButton>
            </ButtonRow>
        </FormWrapper>
    );
}

export default PartTimerUpdateCom;