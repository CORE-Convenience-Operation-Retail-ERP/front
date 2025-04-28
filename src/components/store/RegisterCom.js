import React from "react";

const RegisterCom = ({ formData, onChange, onSubmit }) => {
  return (
    <div className="register-wrapper">
      <h2>회원가입</h2>
      <form onSubmit={onSubmit}>
        <label>이메일 (아이디)</label>
        <input
          type="email"
          name="loginId"
          value={formData.loginId}
          onChange={onChange}
          required
        />

        <label>비밀번호</label>
        <input
          type="password"
          name="loginPwd"
          value={formData.loginPwd}
          onChange={onChange}
          required
        />

        <label>비밀번호 확인</label>
        <input
          type="password"
          name="confirmPwd"
          value={formData.confirmPwd}
          onChange={onChange}
          required
        />

        <label>이름</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          required
        />

        <label>휴대폰 번호</label>
        <input
          type="tel"
          name="phoneNo"
          value={formData.phoneNo}
          placeholder="010-0000-0000"
          onChange={onChange}
        />

        <label>회원 유형</label>
        <select name="workType" value={formData.workType} onChange={onChange} required>
          <option value="">선택하세요</option>
          <option value="OWNER">점주</option>
          <option value="HQ">본사</option>
        </select>

        <label>
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={onChange}
            required
          />
          이용약관에 동의합니다
        </label>

        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default RegisterCom;
