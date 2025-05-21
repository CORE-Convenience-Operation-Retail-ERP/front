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
import CustomCalendar from '../common/CustomCalendar';
import {PageTitle} from "../../../features/store/styles/common/PageLayout";

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
                                originalPhone,
                            }) {
    const phoneChanged = form.partPhone !== originalPhone;

    return (
        <FormWrap>
             <PageTitle>아르바이트 정보 수정</PageTitle>

            {form.partImg && <ImgPreview src={form.partImg} alt="프로필 이미지" />}

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
                <CustomCalendar
                    selected={form.birthDate ? new Date(form.birthDate) : null}
                    onChange={(date) => onDateChange('birthDate', date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="날짜 선택"
                />
            </InfoRow>

            <InfoRow>
                <Label>전화번호</Label>
                <Input name="partPhone" value={form.partPhone || ''} onChange={onChange} />
            </InfoRow>

            {phoneChanged && (
                <InfoRow>
                    <Label>인증번호</Label>
                    <Input type="text" value={code} onChange={onCodeChange} placeholder="인증번호 입력" />
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <ActionButton type="button" onClick={onSendCode}>인증번호 전송</ActionButton>
                        <ActionButton type="button" onClick={onVerifyCode} disabled={verified}>인증 확인</ActionButton>
                    </div>
                    {verified && (
                        <p style={{ color: 'green', marginTop: '0.3rem' }}>✅ 인증 완료</p>
                    )}
                </InfoRow>
            )}

            {/* 이하 동일 */}
            <InfoRow>
                <Label>직책</Label>
                <Select name="position" value={form.position} onChange={onChange}>
                    <option value="">직책 선택</option>
                    <option value="아르바이트">아르바이트</option>
                    <option value="매니저">매니저</option>
                    <option value="점장">점장</option>
                </Select>
            </InfoRow>

            <InfoRow>
                <Label>근무형태</Label>
                <Select name="workType" value={form.workType} onChange={onChange}>
                    <option value="">근무시간 선택</option>
                    <option value="평일주간">평일주간</option>
                    <option value="평일야간">평일야간</option>
                    <option value="주말주간">주말주간</option>
                    <option value="주말야간">주말야간</option>
                </Select>
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
                <Select name="accountBank" value={form.accountBank || ''} onChange={onChange}>
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
                <ActionButton onClick={onSubmit} disabled={phoneChanged && !verified}>
                    수정 완료
                </ActionButton>
            </ButtonGroup>
        </FormWrap>
    );
}

export default PartTimerUpdateCom;
