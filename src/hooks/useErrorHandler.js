import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 오류를 처리하기 위한 커스텀 훅
 * 다양한 유형의 오류를 처리하고 적절한 메시지를 표시합니다.
 * 
 * @returns {Object} 오류 처리 함수와 상태
 */
const useErrorHandler = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  /**
   * API 오류 처리
   * @param {Error} error - 발생한 오류 객체
   * @param {boolean} redirect - 오류 페이지로 리디렉션 여부
   */
  const handleError = useCallback((error, redirect = false) => {
    console.error('오류 발생:', error);
    
    let errorMessage = '알 수 없는 오류가 발생했습니다.';
    let errorCode = 'UNKNOWN_ERROR';
    
    // 에러 응답이 있는 경우 (API 오류)
    if (error.response) {
      const { status, data } = error.response;
      
      // 상태 코드별 처리
      switch (status) {
        case 400: // Bad Request
          errorMessage = data.message || '잘못된 요청입니다.';
          errorCode = 'BAD_REQUEST';
          break;
        case 401: // Unauthorized
          errorMessage = '인증이 만료되었습니다. 다시 로그인해 주세요.';
          errorCode = 'UNAUTHORIZED';
          // 로그인 페이지로 리디렉션
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          navigate('/login', { state: { message: errorMessage } });
          return;
        case 403: // Forbidden
          errorMessage = '접근 권한이 없습니다.';
          errorCode = 'FORBIDDEN';
          break;
        case 404: // Not Found
          errorMessage = '요청한 리소스를 찾을 수 없습니다.';
          errorCode = 'NOT_FOUND';
          break;
        case 500: // Internal Server Error
          errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
          errorCode = 'SERVER_ERROR';
          break;
        default:
          errorMessage = `오류가 발생했습니다: ${status}`;
          errorCode = `ERROR_${status}`;
      }
    } 
    // 요청은 보냈지만 응답이 없는 경우 (네트워크 오류)
    else if (error.request) {
      errorMessage = '서버에 연결할 수 없습니다. 네트워크 연결을 확인해 주세요.';
      errorCode = 'NETWORK_ERROR';
    } 
    // 기타 오류
    else {
      // JavaScript 오류 처리
      if (error instanceof TypeError) {
        errorMessage = '데이터 형식이 잘못되었습니다.';
        errorCode = 'TYPE_ERROR';
      } else if (error instanceof SyntaxError) {
        errorMessage = '구문 오류가 발생했습니다.';
        errorCode = 'SYNTAX_ERROR';
      } else if (error instanceof ReferenceError) {
        errorMessage = '참조 오류가 발생했습니다.';
        errorCode = 'REFERENCE_ERROR';
      } else {
        errorMessage = error.message || '알 수 없는 오류가 발생했습니다.';
        errorCode = 'JS_ERROR';
      }
    }
    
    // 상태 업데이트
    setError({ message: errorMessage, code: errorCode });
    
    // 에러 페이지로 리디렉션
    if (redirect) {
      navigate('/error', { 
        state: { 
          message: errorMessage,
          code: errorCode 
        } 
      });
    }
    
    return { message: errorMessage, code: errorCode };
  }, [navigate]);
  
  /**
   * 오류 상태 초기화
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return {
    error,
    handleError,
    clearError
  };
};

export default useErrorHandler; 