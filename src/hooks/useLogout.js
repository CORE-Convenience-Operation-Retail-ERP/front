import webSocketService from '../service/WebSocketService';

export default function useLogout() {
  return () => {
    console.log('[useLogout] 로그아웃 시작');
    
    // 1. 웹소켓 연결 해제
    try {
      if (webSocketService && webSocketService.disconnect) {
        console.log('[useLogout] 웹소켓 연결 해제');
        webSocketService.disconnect();
      }
    } catch (error) {
      console.warn('[useLogout] 웹소켓 해제 중 오류:', error);
    }
    
    // 2. 모든 localStorage 데이터 정리
    const keysToRemove = [
      'token',
      'empId', 
      'deptId',
      'empName',
      'deptName', 
      'role',
      'storeId',
      'storeName',
      'loginUser',
      'branchName',
      'userRole',
      'name',
      'admin_notifications',
      'admin_unread_notifications',
      'chat_unread_by_room'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('[useLogout] localStorage 정리 완료');
    
    // 3. 로그인 페이지로 리다이렉션
    window.location.href = "/login";
  };
}