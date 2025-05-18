import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import NotificationsIcon from '@mui/icons-material/Notifications';

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
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  console.log('[Icon] notifications', notifications, unreadCount);

  // 바깥 영역 클릭 시 드롭다운 닫기
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isUnread = (notification) => {
    return !notification.isRead && !notification.read;
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
    setShowDropdown(false);
  };

  return (
    <div style={styles.container} ref={dropdownRef}>
      <div onClick={() => setShowDropdown(!showDropdown)}>
        <NotificationsIcon style={styles.icon} />
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
              <button style={styles.markAllBtn} onClick={markAllAsRead}>
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