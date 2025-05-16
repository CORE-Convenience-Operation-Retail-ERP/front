import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import adminNotificationService from '../../service/AdminNotificationService';

// 스타일
const styles = {
  container: {
    position: 'relative',
    display: 'inline-block',
    marginRight: '15px',
    cursor: 'pointer'
  },
  icon: {
    fontSize: '20px',
    color: '#333'
  },
  badge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    background: '#ff4757',
    color: 'white',
    fontSize: '12px',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold'
  },
  dropdown: {
    position: 'absolute',
    top: '30px',
    right: '-10px',
    background: 'white',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    borderRadius: '5px',
    width: '300px',
    maxHeight: '350px',
    overflowY: 'auto',
    zIndex: 1000
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 15px',
    borderBottom: '1px solid #eee'
  },
  title: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 'bold'
  },
  markAllBtn: {
    background: 'none',
    border: 'none',
    color: '#1e88e5',
    cursor: 'pointer',
    fontSize: '13px'
  },
  notificationList: {
    padding: '0',
    margin: '0',
    listStyle: 'none'
  },
  notificationItem: {
    padding: '10px 15px',
    borderBottom: '1px solid #f1f1f1',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  notificationItemUnread: {
    background: '#f0f7ff'
  },
  notificationTitle: {
    margin: '0 0 5px 0',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  notificationContent: {
    margin: '0',
    fontSize: '13px',
    color: '#666'
  },
  timeText: {
    fontSize: '11px',
    color: '#999',
    marginTop: '5px'
  },
  emptyState: {
    padding: '20px',
    textAlign: 'center',
    color: '#999'
  }
};

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  // 1분 이내
  if (diff < 60 * 1000) {
    return '방금 전';
  }
  
  // 1시간 이내
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes}분 전`;
  }
  
  // 오늘
  if (date.toDateString() === now.toDateString()) {
    return `오늘 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
  
  // 어제
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `어제 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
  
  // 그 이전
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
};

const NotificationIcon = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  // 알림 업데이트 구독
  useEffect(() => {
    const unsubscribe = adminNotificationService.onNotificationsChange((count, notifs) => {
      setUnreadCount(count);
      setNotifications(notifs);
    });
    
    // 컴포넌트 마운트 시 최신 알림 가져오기
    adminNotificationService.fetchUnreadNotifications();
    
    // 바깥 영역 클릭 시 드롭다운 닫기
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // ul9buc9c0 uc54auc740 uc54cub9bc uc774ucd5c uc0c1ud0dc uc2e0uaddc
  const isUnread = (notification) => {
    // isRead uc18duc131 ubc0f read uc18duc131 ubaa8ub450 ud655uc778 (uc11cubc84 ubc14uc774ud544 uc774uc288ub54c ubb38uc5d0)
    return !notification.isRead && !notification.read;
  };
  
  // uc54cub9bc ud074ub9ad ucc98ub9ac
  const handleNotificationClick = (notification) => {
    // uc77duc74c ucc98ub9ac
    adminNotificationService.markAsRead(notification.id);
    
    // ub9c1ud06cuac00 uc788uc73cuba74 ud574ub2f9 ud398uc774uc9c0ub85c uc774ub3d9
    if (notification.link) {
      navigate(notification.link);
    }
    
    setShowDropdown(false);
  };
  
  // 모든 알림 읽음 처리
  const handleMarkAllAsRead = () => {
    adminNotificationService.markAllAsRead();
  };
  
  return (
    <div style={styles.container} ref={dropdownRef}>
      <div onClick={() => setShowDropdown(!showDropdown)}>
        <i className="fa fa-bell" style={styles.icon}></i>
        {unreadCount > 0 && (
          <div style={styles.badge}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </div>
      
      {showDropdown && (
        <div style={styles.dropdown}>
          <div style={styles.header}>
            <h3 style={styles.title}>알림</h3>
            {unreadCount > 0 && (
              <button style={styles.markAllBtn} onClick={handleMarkAllAsRead}>
                모두 읽음 처리
              </button>
            )}
          </div>
          
          <ul style={styles.notificationList}>
            {notifications.length === 0 ? (
              <div style={styles.emptyState}>알림이 없습니다.</div>
            ) : (
              notifications.map(notification => (
                <li
                  key={notification.id}
                  style={{
                    ...styles.notificationItem,
                    ...(isUnread(notification) ? styles.notificationItemUnread : {})
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <h4 style={styles.notificationTitle}>
                    {notification.type}
                    {isUnread(notification) && ' 🔵'}
                  </h4>
                  <p style={styles.notificationContent}>{notification.content}</p>
                  <p style={styles.timeText}>{formatDate(notification.createdAt)}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon; 