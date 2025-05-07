import React, { useState } from "react";
import RegisterCom from "../../components/store/RegisterCom";
import axios from "../../service/axiosInstance";
import { useNavigate } from "react-router-dom";

const RegisterCon = () => {
  const [formData, setFormData] = useState({
    loginId: "",
    loginPwd: "",
    confirmPwd: "",
    name: "",
    birthDate: "",
    gender: "",
    phoneNo: "",
    address: "",
    empRole: "",
    agree: false
  });
  
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // 이메일이 변경되면 중복 확인 및 인증 상태 초기화
    if (name === "loginId") {
      setIsEmailChecked(false);
      setIsVerificationSent(false);
      setIsEmailVerified(false);
      setVerificationCode("");
    }
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  
  const checkEmail = async () => {
    if (!formData.loginId || !formData.loginId.includes('@')) {
      setError("유효한 이메일 주소를 입력해주세요.");
      return;
    }
    
    try {
      setLoading(true);
      
      // 이메일 중복 확인 API 호출
      const response = await axios.post("/api/auth/check-email", {
        loginId: formData.loginId
      });
      
      // 응답 확인 (available 필드가 true면 사용 가능)
      if (response.data && response.data.available === true) {
        setIsEmailChecked(true);
        setError(null);
        alert("사용 가능한 이메일입니다.");
      } else {
        setIsEmailChecked(false);
        setError("이미 사용 중인 이메일입니다. 다른 이메일을 입력해주세요.");
      }
      
    } catch (error) {
      console.error("이메일 중복 확인 실패:", error);
      setIsEmailChecked(false);
      
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("이메일 중복 확인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  // 인증 이메일 발송
  const sendVerificationEmail = async () => {
    if (!formData.loginId || !formData.loginId.includes('@')) {
      setError("유효한 이메일 주소를 입력해주세요.");
      return;
    }
    
    try {
      setLoading(true);
      
      // 인증 이메일 발송 API 호출
      const response = await axios.post("/api/auth/send-verification-email", {
        email: formData.loginId
      });
      
      if (response.data && response.data.success) {
        setIsVerificationSent(true);
        setError(null);
        alert("인증 이메일이 발송되었습니다. 이메일을 확인해주세요.");
      } else {
        setError(response.data.message || "인증 이메일 발송에 실패했습니다.");
      }
    } catch (error) {
      console.error("인증 이메일 발송 실패:", error);
      setError(error.response?.data?.message || "인증 이메일 발송 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };
  
  // 인증 코드 입력 핸들러
  const onVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };
  
  // 인증 코드 확인
  const verifyEmail = async () => {
    if (!verificationCode) {
      setError("인증 코드를 입력해주세요.");
      return;
    }
    
    try {
      setLoading(true);
      
      // 인증 코드 확인 API 호출
      const response = await axios.post("/api/auth/verify-email", {
        email: formData.loginId,
        code: verificationCode
      });
      
      if (response.data && response.data.success) {
        setIsEmailVerified(true);
        setError(null);
        alert("이메일 인증이 완료되었습니다.");
      } else {
        setError(response.data.message || "인증 코드가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("이메일 인증 실패:", error);
      setError(error.response?.data?.message || "이메일 인증 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };
  
  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // 간단한 유효성 검사
    if (formData.loginPwd !== formData.confirmPwd) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!formData.agree) {
      setError("이용약관에 동의해야 합니다.");
      return;
    }
    
    if (!isEmailChecked) {
      setError("이메일 중복 확인을 해주세요.");
      return;
    }
    
    if (!isEmailVerified) {
      setError("이메일 인증을 완료해주세요.");
      return;
    }
    
    if (!formData.birthDate || !formData.gender) {
      setError("생년월일과 성별 정보를 올바르게 입력해주세요.");
      return;
    }
    
    if (formData.empRole && !file) {
      setError(formData.empRole === "점주" ? "사업자등록증을 업로드해주세요." : "프로필 이미지를 업로드해주세요.");
      return;
    }

    try {
      setLoading(true);
      console.log("회원가입 데이터:", formData);
      
      // FormData 객체 생성
      const formDataToSend = new FormData();
      
      // 서버로 보낼 데이터 준비 (confirmPwd와 agree는 제외)
      const registerData = {
        loginId: formData.loginId,
        loginPwd: formData.loginPwd,
        name: formData.name,
        birthDate: formData.birthDate,
        gender: formData.gender,
        phoneNo: formData.phoneNo,
        address: formData.address,
        empRole: formData.empRole
      };
      
      // JSON 데이터 추가
      formDataToSend.append('data', new Blob([JSON.stringify(registerData)], {
        type: 'application/json'
      }));
      
      // 파일 추가
      if (file) {
        formDataToSend.append('file', file);
      }
      
      // 회원가입 API 호출
      const response = await axios.post("/api/auth/register", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log("회원가입 성공:", response.data);
      
      // 회원가입 성공 시 로그인 페이지로 이동
      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (error) {
      console.error("회원가입 실패:", error);
      setError(error.response?.data?.message || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterCom 
      formData={formData} 
      onChange={onChange} 
      onSubmit={onSubmit} 
      onFileChange={onFileChange} 
      onCheckEmail={checkEmail}
      isEmailChecked={isEmailChecked}
      error={error} 
      loading={loading} 
      verificationCode={verificationCode}
      onVerificationCodeChange={onVerificationCodeChange}
      sendVerificationEmail={sendVerificationEmail}
      verifyEmail={verifyEmail}
      isVerificationSent={isVerificationSent}
      isEmailVerified={isEmailVerified}
    />
  );
};

export default RegisterCon;