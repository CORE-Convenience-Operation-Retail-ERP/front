import React, { useState } from "react";
import "./RegisterStyle.css";

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
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={onChange}
                required
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
            <div className="form-group checkbox-group">
              <input
                id="agree"
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={onChange}
                required
              />
              <label htmlFor="agree" className="checkbox-label">이용약관에 동의합니다</label>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !isEmailVerified} 
            className="submit-button"
          >
            {loading ? "처리 중..." : "회원가입"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterCom;
