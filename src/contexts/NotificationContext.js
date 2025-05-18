import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import webSocketService from '../service/WebSocketService';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // 최초 마운트 시 서버에서 알림 fetch
  const fetchInitial = useCallback(async () => {
    const res = await fetch('/api/notifications/unread');
    let unread = [];
    if (res.ok) {
      const text = await res.text();
      if (text) {
        unread = JSON.parse(text);
      }
    }
    setNotifications([...unread]);
    setUnreadCount(unread.length);
  }, []);

  // 실시간 알림 구독
  useEffect(() => {
    const handleRealtime = (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    // 개인 알림 구독
    const myEmpId = parseInt(localStorage.getItem('empId'), 10);
    webSocketService.subscribe('/topic/notifications/admin', (notification) => {
      if (notification.userId === myEmpId) {
        handleRealtime(notification);
      }
    });

    // 부서 알림 구독 (상품팀 5번)
    const myDeptId = parseInt(localStorage.getItem('deptId'), 10);
    let deptDestination;
    if (myDeptId === 5) {
      deptDestination = '/topic/notifications/dept/5';
      webSocketService.subscribe(deptDestination, handleRealtime);
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
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // 모두 읽음 처리
  const markAllAsRead = async () => {
    await fetch('/api/notifications/read-all', { method: 'POST' });
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true, read: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext); 