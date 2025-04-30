import { useState } from "react";
import axios from "../service/axiosInstance";

export default function useLogin() {
  const [error, setError] = useState(null);

  const login = async (loginId, loginPwd) => {
    try {
      const res = await axios.post("/api/auth/login", { loginId, loginPwd });
      console.log("로그인 API 응답:", res.data);
      
      // 토큰 추출 (다양한 응답 형식 처리)
      const token = res.data.token || res.data.accessToken;
      
      if (!token) {
        throw new Error("서버에서 토큰을 받지 못했습니다.");
      }
      
      // 토큰 저장
      localStorage.setItem("token", token);
      
      // 서버 응답 데이터와 token 통합하여 반환
      return {
        ...res.data,
        token: token
      };
    } catch (e) {
      const errorMessage = e.response?.data?.message || "로그인 실패";
      setError(errorMessage);
      console.error("로그인 에러:", errorMessage);
      throw e;
    }
  };

  return { login, error };
}