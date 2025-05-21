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
      
      // 모든 응답 데이터를 로컬스토리지에 저장
      if (res.data.empId) localStorage.setItem("empId", res.data.empId);
      if (res.data.deptId) localStorage.setItem("deptId", res.data.deptId);
      if (res.data.empName) localStorage.setItem("empName", res.data.empName);
      if (res.data.deptName) localStorage.setItem("deptName", res.data.deptName);
      if (res.data.role) localStorage.setItem("role", res.data.role);
      
      // 매장 정보 저장 (null일 수 있으므로 존재 여부 확인)
      if (res.data.storeId !== undefined) {
        localStorage.setItem("storeId", res.data.storeId);
      }
      if (res.data.storeName !== undefined) {
        localStorage.setItem("storeName", res.data.storeName);
      }
      
      // 디버깅용 로그
      console.log("로컬 스토리지에 저장된 데이터:", {
        token: localStorage.getItem("token"),
        empId: localStorage.getItem("empId"),
        deptId: localStorage.getItem("deptId"),
        empName: localStorage.getItem("empName"),
        deptName: localStorage.getItem("deptName"),
        role: localStorage.getItem("role"),
        storeId: localStorage.getItem("storeId"),
        storeName: localStorage.getItem("storeName")
      });
      
      // 서버 응답 데이터와 token 통합하여 반환
      return {
        ...res.data,
        token: token
      };
    } catch (e) {
      const errorMessage = e.response?.data?.message || "아이디,비밀번호를 다시 확인해주세요.";
      setError(errorMessage);
      console.error("로그인 에러:", errorMessage);
      throw e;
    }
  };

  return { login, error, setError };
}