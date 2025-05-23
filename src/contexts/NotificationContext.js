import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import webSocketService from '../service/WebSocketService';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // 전체 알림 fetch
  const fetchInitial = useCallback(async () => {
    const res = await fetch('/api/notifications'); // 전체 알림 API로 변경
    let all = [];
    if (res.ok) {
      const text = await res.text();
      if (text) {
        all = JSON.parse(text);
      }
    }
    setNotifications([...all]);
  }, []);

  // 실시간 알림 구독
  useEffect(() => {
    const handleRealtime = (notification) => {
      console.log('[NotificationContext] 실시간 알림 수신:', notification);
      setNotifications(prev => {
        if (prev.some(n => n.id === notification.id)) return prev;
        return [notification, ...prev];
      });
    };

    // 개인 알림 구독
    const myEmpId = parseInt(localStorage.getItem('empId'), 10);
    webSocketService.subscribe('/topic/notifications/admin', (notification) => {
      if (notification.userId === myEmpId) {
        console.log('[NotificationContext] 개인 알림 수신:', notification);
        handleRealtime(notification);
      }
    });

    // 부서 알림 구독 (3~10번 부서 모두)
    const myDeptId = parseInt(localStorage.getItem('deptId'), 10);
    let deptDestination;
    if (myDeptId >= 3 && myDeptId <= 10) {
      deptDestination = `/topic/notifications/dept/${myDeptId}`;
      console.log(`[NotificationContext] 부서 알림 구독 시작: ${deptDestination}`);
      webSocketService.subscribe(deptDestination, (notification) => {
        console.log('[NotificationContext] 부서 알림 수신:', notification);
        handleRealtime(notification);
      });
    }

    // 언마운트 시 구독 해제
    return () => {
      webSocketService.unsubscribe('/topic/notifications/admin');
      if (deptDestination) {
        webSocketService.unsubscribe(deptDestination);
      }
    };
  }, []);

  // 최초 1회 fetch
  useEffect(() => {
    fetchInitial();
  }, [fetchInitial]);

  // 알림 읽음 처리
  const markAsRead = async (notificationId) => {
    await fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' });
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true, read: true } : n));
  };

  // 모두 읽음 처리
  const markAllAsRead = async () => {
    await fetch('/api/notifications/read-all', { method: 'POST' });
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true, read: true })));
  };

  // 읽지 않은 알림 개수 계산
  const unreadCount = notifications.filter(n => !n.isRead && !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext); 