import React, { useState } from "react";
import RegisterCom from "../../components/store/RegisterCom";

const RegisterCon = () => {
  const [formData, setFormData] = useState({
    loginId: "",
    loginPwd: "",
    confirmPwd: "",
    name: "",
    phoneNo: "",
    workType: "",
    agree: false,
  });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // 간단한 유효성 검사
    if (formData.loginPwd !== formData.confirmPwd) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!formData.agree) {
      alert("이용약관에 동의해야 합니다.");
      return;
    }

    // TODO: 여기서 서버로 회원가입 POST 요청 보내기
    console.log("회원가입 데이터:", formData);
  };

  return <RegisterCom formData={formData} onChange={onChange} onSubmit={onSubmit} />;
};

export default RegisterCon;