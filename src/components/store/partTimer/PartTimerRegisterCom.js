import {
    FormWrapper,
    Title,
    InputGroup,
    Label,
    Input,
    Select,
    FileInput,
    PhoneRow,
    OutlineButton,
    VerifiedMessage,
    ProfileImage,
    ActionButton
} from '../../../features/store/styles/partTimer/StorePatTimerForm.styled';
import CustomCalendar from '../../../components/store/common/CustomCalendar';
import { ButtonRow } from '../../../features/store/styles/common/Button.styled';
import AddressSearchCustom from '../common/AddressSearchCustom';
function PartTimerRegisterCom({
    form,
    onChange,
    onDateChange,
    onSubmit,
    onOpenQrAuth,
    verified,
    inputRefs = {},
    onBack
}) {

    return (
        <FormWrapper>
            <Title>직원 등록</Title>

            <InputGroup>
                <Label required>이름</Label>
                <Input
                    name="partName"
                    ref={inputRefs.partName}
                    value={form.partName}
                    onChange={onChange}
                    placeholder="이름"
                />
            </InputGroup>

            <InputGroup>
                <Label required>직책</Label>
                <Select name="position" ref={inputRefs.position} value={form.position} onChange={onChange}>
                    <option value="">직책 선택</option>
                    <option value="아르바이트">아르바이트</option>
                    <option value="매니저">매니저</option>
                    <option value="점장">점장</option>
                </Select>
            </InputGroup>

            <InputGroup>
                <Label required>근무 형태</Label>
                <Select name="workType" ref={inputRefs.workType} value={form.workType} onChange={onChange}>
                    <option value="">근무시간 선택</option>
                    <option value="평일주간">평일주간</option>
                    <option value="평일야간">평일야간</option>
                    <option value="주말주간">주말주간</option>
                    <option value="주말야간">주말야간</option>
                </Select>
            </InputGroup>

            <InputGroup>
                <Label required>성별</Label>
                <Select name="partGender" ref={inputRefs.partGender} value={form.partGender} onChange={onChange}>
                    <option value="">선택</option>
                    <option value="1">남</option>
                    <option value="2">여</option>
                </Select>
            </InputGroup>

            <InputGroup>
                <Label required>전화번호</Label>
                <PhoneRow>
                    <Input
                        name="partPhone"
                        ref={inputRefs.partPhone}
                        value={form.partPhone}
                        onChange={onChange}
                        placeholder="010-1234-5678"
                    />
                    <OutlineButton type="button" onClick={onOpenQrAuth}>
                        기기 인증하기
                    </OutlineButton>
                </PhoneRow>
            </InputGroup>

            {verified && (
                <InputGroup>
                    <VerifiedMessage>✅ 기기 인증 완료</VerifiedMessage>
                </InputGroup>
            )}
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
                <Label required>생년월일</Label>
                <CustomCalendar
                    selected={form.birthDate}
                    ref={inputRefs.birthDate}
                    onChange={(date) => onDateChange('birthDate', date)}
                    placeholder="생년월일 선택"
                />
            </InputGroup>

            <InputGroup>
                <Label required>입사일</Label>
                <CustomCalendar
                    selected={form.hireDate}
                    ref={inputRefs.hireDate}
                    onChange={(date) => onDateChange('hireDate', date)}
                    placeholder="입사일 선택"
                />
            </InputGroup>

            <InputGroup>
                <Label required>급여 형태</Label>
                <Select name="salaryType" ref={inputRefs.salaryType} value={form.salaryType} onChange={onChange}>
                    <option value="">선택</option>
                    <option value="0">시급</option>
                    <option value="1">월급</option>
                </Select>
            </InputGroup>

            <InputGroup>
                <Label required>시급</Label>
                <Input
                    name="hourlyWage"
                    value={form.hourlyWage}
                    onChange={onChange}
                    placeholder="시급"
                />
            </InputGroup>

            <InputGroup>
                <Label required>은행</Label>
                <Select name="accountBank" ref={inputRefs.accountBank} value={form.accountBank} onChange={onChange}>
                    <option value="">선택</option>
                    <option value={1}>국민</option>
                    <option value={2}>하나</option>
                    <option value={3}>신한</option>
                </Select>
            </InputGroup>

            <InputGroup>
                <Label required>계좌번호</Label>
                <Input
                    name="accountNumber"
                    ref={inputRefs.accountNumber}
                    value={form.accountNumber}
                    onChange={onChange}
                    placeholder="계좌번호"
                />
            </InputGroup>

            <InputGroup>
                <Label required>재직 상태</Label>
                <Select name="partStatus" value={form.partStatus} onChange={onChange}>
                    <option value="">선택</option>
                    <option value="1">재직</option>
                    <option value="0">퇴사</option>
                </Select>
            </InputGroup>

            <InputGroup>
                <Label required>사진 업로드</Label>
                <FileInput type="file" name="file" onChange={onChange} accept="image/*" />
                {form.partImg && <ProfileImage src={form.partImg} alt="미리보기" />}
            </InputGroup>

        <ButtonRow>
            <ActionButton type="button" onClick={onBack}>뒤로가기</ActionButton>
            <ActionButton type="button" onClick={onSubmit}>등록</ActionButton>
        </ButtonRow>
        </FormWrapper>
    );
}

export default PartTimerRegisterCom;
