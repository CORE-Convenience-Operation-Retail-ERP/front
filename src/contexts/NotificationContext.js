import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import webSocketService from '../service/WebSocketService';
import axiosInstance from '../service/axiosInstance';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  // 로그인 상태 확인 함수
  const isLoggedIn = useCallback(() => {
    const token = localStorage.getItem('token');
    const empId = localStorage.getItem('empId');
    return !!(token && empId);
  }, []);

  // 로그인 상태 변화 감지
  useEffect(() => {
    const checkLoginStatus = () => {
      const currentLoginStatus = isLoggedIn();
      if (currentLoginStatus !== isUserLoggedIn) {
        console.log('[NotificationContext] 로그인 상태 변화 감지:', currentLoginStatus);
        setIsUserLoggedIn(currentLoginStatus);
        
        // 로그아웃된 경우 알림 상태 초기화
        if (!currentLoginStatus) {
          console.log('[NotificationContext] 로그아웃 감지 - 알림 상태 초기화');
          setNotifications([]);
        }
      }
    };

    // 초기 상태 설정
    checkLoginStatus();

    // localStorage 변화 감지 (storage 이벤트는 다른 탭에서만 발생하므로 polling 사용)
    const interval = setInterval(checkLoginStatus, 1000);

    return () => clearInterval(interval);
  }, [isLoggedIn, isUserLoggedIn]);

  // 전체 알림 fetch
  const fetchInitial = useCallback(async () => {
    // 로그인하지 않은 경우 API 호출하지 않음
    if (!isLoggedIn()) {
      console.log('[NotificationContext] 로그인하지 않은 상태 - 알림 fetch 건너뜀');
      return;
    }

    try {
      const res = await axiosInstance.get('/api/notifications'); // 전체 알림 API로 변경
      let all = [];
      if (res.data) {
        all = res.data;
      }
      setNotifications([...all]);
    } catch (error) {
      console.error('[NotificationContext] 알림 fetch 실패:', error);
      // 에러가 발생해도 빈 배열로 설정하여 앱이 계속 동작하도록 함
      setNotifications([]);
    }
  }, [isLoggedIn]);

  // 실시간 알림 구독
  useEffect(() => {
    // 로그인하지 않은 경우 웹소켓 구독하지 않음
    if (!isUserLoggedIn) {
      console.log('[NotificationContext] 로그인하지 않은 상태 - 웹소켓 구독 건너뜀');
      return;
    }

    const handleRealtime = (notification) => {
      console.log('[NotificationContext] 실시간 알림 수신:', notification);
      setNotifications(prev => {
        if (
          prev.some(n =>
            n.content === notification.content &&
            n.userId === notification.userId &&
            n.eventType === notification.eventType &&
            n.createdAt === notification.createdAt
          )
        ) return prev;
        return [notification, ...prev];
      });
    };

    // 웹소켓 연결 상태 확인 및 재연결 시도
    const ensureWebSocketConnection = () => {
      if (!webSocketService.isConnected()) {
        console.log('[NotificationContext] 웹소켓 연결이 끊어짐 - 재연결 시도');
        webSocketService.autoConnect();
      }
    };

    // 초기 연결 상태 확인
    ensureWebSocketConnection();

    // 주기적으로 연결 상태 확인 (30초마다)
    const connectionCheckInterval = setInterval(ensureWebSocketConnection, 30000);

    // 개인 알림 구독
    const myEmpId = parseInt(localStorage.getItem('empId'), 10);
    if (myEmpId) {
      webSocketService.subscribe('/topic/notifications/admin', (notification) => {
        if (notification.userId === myEmpId) {
          console.log('[NotificationContext] 개인 알림 수신:', notification);
          handleRealtime(notification);
        }
      });
    }

    // 부서 알림 구독 (3~10번 부서 모두)
    const myDeptId = parseInt(localStorage.getItem('deptId'), 10);
    let deptDestination;
    if (myDeptId >= 3 && myDeptId <= 10) {
      deptDestination = `/topic/notifications/dept/${myDeptId}`;
      console.log(`[NotificationContext] 부서 알림 구독 시작: ${deptDestination}`);
      webSocketService.subscribe(deptDestination, (notification) => {
        console.log('[NotificationContext] 부서 알림 수신:', notification);
        // 내 알림만 처리
        if (notification.userId === myEmpId) {
          handleRealtime(notification);
        }
      });
    }

    // 언마운트 시 구독 해제
    return () => {
      console.log('[NotificationContext] 웹소켓 구독 해제');
      clearInterval(connectionCheckInterval);
      webSocketService.unsubscribe('/topic/notifications/admin');
      if (deptDestination) {
        webSocketService.unsubscribe(deptDestination);
      }
    };
  }, [isUserLoggedIn]);

  // 최초 1회 fetch (로그인 상태일 때만)
  useEffect(() => {
    if (isUserLoggedIn) {
      fetchInitial();
    }
  }, [fetchInitial, isUserLoggedIn]);

  // 알림 읽음 처리
  const markAsRead = async (notificationId) => {
    if (!isLoggedIn()) return;
    
    try {
      await axiosInstance.patch(`/api/notifications/${notificationId}/read`);
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true, read: true } : n));
    } catch (error) {
      console.error('[NotificationContext] 알림 읽음 처리 실패:', error);
    }
  };

  // 모두 읽음 처리
  const markAllAsRead = async () => {
    if (!isLoggedIn()) return;
    
    try {
      await axiosInstance.patch('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, read: true })));
    } catch (error) {
      console.error('[NotificationContext] 모든 알림 읽음 처리 실패:', error);
    }
  };

  // 내 정보
  const myRole = localStorage.getItem('role');
  const myDeptId = Number(localStorage.getItem('deptId'));
  const myEmpId = Number(localStorage.getItem('empId'));

  // 내 권한/부서/개인 알림만 필터링
  const filteredNotifications = notifications.filter(n => {
    // targetEmpId(개인 알림)가 있으면 내 것만
    if (n.targetEmpId && n.targetEmpId !== myEmpId) return false;
    // targetDeptId(부서 알림)가 있으면 내 부서만
    if (n.targetDeptId && n.targetDeptId !== myDeptId) return false;
    // targetRole(권한 알림)가 있으면 내 권한만
    if (n.targetRole && n.targetRole !== myRole) return false;
    // 조건 없으면 모두 표시
    return true;
  });

  const unreadCount = filteredNotifications.filter(n => !n.isRead && !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications: filteredNotifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext); 