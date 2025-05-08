import React, { useState } from "react";
import "./RegisterStyle.css";
import AddressSearch from "../common/AddressSearch";
import { 
    Box, 
    Typography, 
    Checkbox, 
    FormControlLabel, 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Paper
} from '@mui/material';

const RegisterCom = ({ 
  formData, 
  onChange, 
  onSubmit, 
  error, 
  loading, 
  onFileChange, 
  onCheckEmail, 
  isEmailChecked,
  verificationCode,
  onVerificationCodeChange,
  sendVerificationEmail,
  verifyEmail,
  isVerificationSent,
  isEmailVerified
}) => {
  const [birthAndGender, setBirthAndGender] = useState("");
  const [openTerms, setOpenTerms] = useState(false);
  const [openPrivacy, setOpenPrivacy] = useState(false);
  
  const handleBirthAndGenderChange = (e) => {
    const value = e.target.value;
    setBirthAndGender(value);
    
    // 주민번호 앞 6자리(생년월일)와 뒤 1자리(성별) 추출
    if (value.length >= 7) {
      const birthDate = value.substring(0, 6);
      const gender = value.substring(6, 7);
      
      // 상위 컴포넌트에 데이터 전달
      onChange({
        target: { name: "birthDate", value: birthDate }
      });
      
      onChange({
        target: { name: "gender", value: gender }
      });
    }
  };
  
  // 전화번호 자동 하이픈(-) 추가
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/-/g, ''); // 기존 하이픈 제거
    let formattedValue = value;
    
    if (value.length > 3 && value.length <= 7) {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 7) {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }
    
    onChange({
      target: { name: "phoneNo", value: formattedValue }
    });
  };

  const handleAddressSelect = (address) => {
    // 주소 선택 시 추가 정보 저장
    onChange({
      target: { name: "zipCode", value: address.zipCode }
    });
    onChange({
      target: { name: "roadAddress", value: address.roadAddress }
    });
  };
  
  const handleOpenTerms = () => setOpenTerms(true);
  const handleCloseTerms = () => setOpenTerms(false);
  const handleOpenPrivacy = () => setOpenPrivacy(true);
  const handleClosePrivacy = () => setOpenPrivacy(false);

  const termsContent = `
제1조 (목적)
이 약관은 CORE ERP(이하 "회사")가 제공하는 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "서비스"란 회사가 제공하는 모든 서비스를 의미합니다.
2. "회원"이란 회사와 서비스 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.

제3조 (서비스의 제공)
1. 회사는 회원에게 아래와 같은 서비스를 제공합니다:
   - ERP 시스템 이용
   - 매장 관리 서비스
   - 재고 관리 서비스
   - 기타 회사가 정하는 서비스

제4조 (서비스 이용)
1. 서비스 이용은 회사의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴, 1일 24시간을 원칙으로 합니다.
2. 회사는 시스템 정기점검, 증설 및 교체를 위해 서비스를 일시 중단할 수 있으며, 예정된 작업으로 인한 서비스 일시 중단은 서비스 홈페이지를 통해 사전에 공지합니다.

제5조 (회원의 의무)
1. 회원은 관계법령, 이 약관의 규정, 이용안내 및 주의사항 등 회사가 통지하는 사항을 준수하여야 합니다.
2. 회원은 회사의 명시적인 동의가 없는 한 서비스의 이용권한을 타인에게 양도, 증여할 수 없습니다.
  `;

  const privacyContent = `
개인정보 수집 및 이용에 관한 사항

1. 수집하는 개인정보 항목
   - 필수항목: 이메일, 비밀번호, 이름, 생년월일, 성별, 휴대폰번호, 주소
   - 선택항목: 프로필 이미지, 사업자등록증

2. 개인정보의 수집 및 이용목적
   - 회원 가입 및 관리
   - 서비스 제공 및 운영
   - 고객 상담 및 불만처리
   - 마케팅 및 광고에의 활용

3. 개인정보의 보유 및 이용기간
   - 회원 탈퇴 시까지 (단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 해당 기간 동안 보관)

4. 동의를 거부할 권리 및 동의 거부에 따른 불이익
   - 개인정보 수집 및 이용에 대한 동의를 거부할 수 있으며, 동의 거부 시 회원가입이 제한됩니다.
  `;

  return (
    <div className="register-container">
      <div className="register-form-container">
        <div className="logo-container">
          <img src="/core_logo.png" alt="CORE 로고" className="core-logo" />
        </div>
        
        <h1 className="register-title">회원가입</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={onSubmit} encType="multipart/form-data" className="register-form">
          <div className="form-section">
            <h3 className="section-title">계정 정보</h3>
            
            <div className="form-group">
              <label htmlFor="loginId">이메일 (아이디)</label>
              <div className="input-with-button">
                <input
                  id="loginId"
                  type="email"
                  name="loginId"
                  value={formData.loginId}
                  onChange={onChange}
                  required
                  placeholder="example@email.com"
                  disabled={isEmailChecked}
                  className="form-input"
                />
                <button 
                  type="button" 
                  className="check-button"
                  onClick={onCheckEmail}
                  disabled={!formData.loginId || loading || isEmailChecked}
                >
                  {isEmailChecked ? "확인완료" : "중복확인"}
                </button>
              </div>
              
              {isEmailChecked && !isVerificationSent && !isEmailVerified && (
                <div className="verification-section">
                  <button 
                    type="button"
                    className="verification-button primary-button"
                    onClick={sendVerificationEmail}
                    disabled={loading}
                  >
                    {loading ? "발송 중..." : "인증 메일 발송"}
                  </button>
                </div>
              )}
              
              {isVerificationSent && !isEmailVerified && (
                <div className="verification-code-section">
                  <div className="input-with-button">
                    <input
                      type="text"
                      placeholder="인증 코드 6자리 입력"
                      value={verificationCode}
                      onChange={onVerificationCodeChange}
                      maxLength="6"
                      className="form-input"
                    />
                    <button 
                      type="button"
                      className="verification-button primary-button"
                      onClick={verifyEmail}
                      disabled={loading || !verificationCode}
                    >
                      {loading ? "확인 중..." : "인증 확인"}
                    </button>
                  </div>
                  <button 
                    type="button"
                    className="resend-button secondary-button"
                    onClick={sendVerificationEmail}
                    disabled={loading}
                  >
                    {loading ? "발송 중..." : "인증 메일 재발송"}
                  </button>
                </div>
              )}
              
              {isEmailVerified && (
                <div className="verification-success">
                  <span className="success-icon">✓</span>
                  <span className="success-message">이메일 인증이 완료되었습니다.</span>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="loginPwd">비밀번호</label>
              <input
                id="loginPwd"
                type="password"
                name="loginPwd"
                value={formData.loginPwd}
                onChange={onChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPwd">비밀번호 확인</label>
              <input
                id="confirmPwd"
                type="password"
                name="confirmPwd"
                value={formData.confirmPwd}
                onChange={onChange}
                required
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3 className="section-title">개인 정보</h3>
            
            <div className="form-group">
              <label htmlFor="name">이름</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="birthAndGender">주민등록번호 (앞 6자리 + 뒷자리 1자리)</label>
              <input
                id="birthAndGender"
                type="text"
                name="birthAndGender"
                value={birthAndGender}
                onChange={handleBirthAndGenderChange}
                placeholder="예: 9001011 (900101-1)"
                maxLength="7"
                required
              />
              <small className="input-help">주민번호 앞 6자리와 뒷자리 첫번째 숫자만 입력하세요</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="phoneNo">휴대폰 번호</label>
              <input
                id="phoneNo"
                type="tel"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handlePhoneChange}
                placeholder="010-0000-0000"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">주소</label>
              <AddressSearch
                value={formData.address}
                onChange={onChange}
                onSelect={handleAddressSelect}
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3 className="section-title">회원 유형</h3>
            <div className="form-group">
              <select
                name="empRole"
                value={formData.empRole}
                onChange={onChange}
                required
                className="form-select"
              >
                <option value="">선택하세요</option>
                <option value="점주">점주</option>
                <option value="본사">본사</option>
              </select>
            </div>
            
            {formData.empRole && (
              <div className="form-group file-upload">
                <label>
                  {formData.empRole === "점주" ? "사업자등록증 업로드" : "프로필 이미지 업로드"}
                </label>
                <input
                  type="file"
                  name="file"
                  onChange={onFileChange}
                  required
                  className="file-input"
                />
              </div>
            )}
          </div>
          
          <div className="form-section agreement-section">
            <Typography variant="h6" sx={{ mb: 2 }}>이용약관 동의</Typography>
            
            <Paper sx={{ p: 2, mb: 2, maxHeight: '200px', overflow: 'auto' }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {termsContent}
              </Typography>
            </Paper>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agreeTerms}
                  onChange={(e) => onChange({
                    target: { name: 'agreeTerms', value: e.target.checked }
                  })}
                />
              }
              label="이용약관에 동의합니다"
            />

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>개인정보 수집 및 이용 동의</Typography>
            
            <Paper sx={{ p: 2, mb: 2, maxHeight: '200px', overflow: 'auto' }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {privacyContent}
              </Typography>
            </Paper>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agreePrivacy}
                  onChange={(e) => onChange({
                    target: { name: 'agreePrivacy', value: e.target.checked }
                  })}
                />
              }
              label="개인정보 수집 및 이용에 동의합니다"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !isEmailVerified || !formData.agreeTerms || !formData.agreePrivacy} 
            className="submit-button"
          >
            {loading ? "처리 중..." : "회원가입"}
          </button>
        </form>
      </div>

      {/* 이용약관 상세보기 다이얼로그 */}
      <Dialog
        open={openTerms}
        onClose={handleCloseTerms}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>이용약관</DialogTitle>
        <DialogContent>
          <Typography sx={{ whiteSpace: 'pre-line' }}>
            {termsContent}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTerms}>닫기</Button>
        </DialogActions>
      </Dialog>

      {/* 개인정보 처리방침 상세보기 다이얼로그 */}
      <Dialog
        open={openPrivacy}
        onClose={handleClosePrivacy}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>개인정보 수집 및 이용</DialogTitle>
        <DialogContent>
          <Typography sx={{ whiteSpace: 'pre-line' }}>
            {privacyContent}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePrivacy}>닫기</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RegisterCom;
