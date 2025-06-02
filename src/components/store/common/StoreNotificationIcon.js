// src/components/store/common/StoreNotificationIcon.js
import { useState, useRef, useEffect } from 'react';
import { useNotification } from '../../../contexts/NotificationContext';
import { BellIcon, IconWrap } from '../../../features/store/styles/common/StoreHeader.styled';

// 팝업(드롭박스)만 본사 스타일 구조로, 컬러만 점주 컨셉
const popupStyles = {
  dropdown: {
    position: 'absolute',
    top: '30px',
    right: '-10px',
    background: '#fff', // 컨텐트 영역은 흰색
    boxShadow: '0 0 10px rgba(250,204,21,0.10)',
    borderRadius: '8px',
    width: '300px',
    maxHeight: '350px',
    overflowY: 'auto',
    zIndex: 9999,
    border: '1px solid #facc15'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 15px',
    borderBottom: '1px solid rgb(255, 255, 255)',
    background: '#fef9c3' // 헤더만 연노랑
  },
  title: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#b45309'
  },
  markAllBtn: {
    background: 'none',
    border: 'none',
    color: '#eab308', // 진한 노랑
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 700
  },
  notificationList: {
    padding: '0',
    margin: '0',
    listStyle: 'none'
  },
  notificationItem: {
    padding: '10px 15px',
    borderBottom: '1px solid #fef08a',
    cursor: 'pointer',
    transition: 'background 0.2s',
    background: 'transparent',
    color: '#7c6f1a'
  },
  notificationItemUnread: {
    background: '#fef9c3', // 연노랑
    fontWeight: 700
  },
  notificationTitle: {
    margin: '0 0 5px 0',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#b45309'
  },
  notificationContent: {
    margin: '0',
    fontSize: '13px',
    color: '#a16207'
  },
  timeText: {
    fontSize: '11px',
    color: '#eab308',
    marginTop: '5px'
  },
  emptyState: {
    padding: '20px',
    textAlign: 'center',
    color: '#b45309'
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  if (diff < 60 * 1000) return '방금 전';
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}분 전`;
  if (date.toDateString() === now.toDateString()) return `오늘 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return `어제 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
};

function StoreNotificationIcon() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const [showDropdown, setShowDropdown] = useState(false);
  const bellRef = useRef(null);

  // 외부 클릭 시 드롭박스 닫기
  useEffect(() => {
    function handleClickOutside(e) {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const isUnread = (notification) => {
    return !notification.isRead && !notification.read;
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    // 알림의 link로 이동
    if (notification.link) {
      window.location.href = notification.link;
    }
    setShowDropdown(false);
  };

  return (
    <IconWrap
      $hoverbg="#fef9c3"
      onClick={() => setShowDropdown((prev) => !prev)}
      ref={bellRef}
      style={{ position: 'relative' }}
    >
      <BellIcon />
      {unreadCount > 0 && (
        <span style={{
          position: 'absolute', top: 4, right: 4,
          background: '#facc15', color: '#fff', borderRadius: '50%',
          minWidth: 18, height: 18, fontSize: 12, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '0 5px',
          fontWeight: 700, boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
        }}>{unreadCount}</span>
      )}
      {showDropdown && (
        <div style={popupStyles.dropdown}>
          <div style={popupStyles.header}>
            <h3 style={popupStyles.title}>알림</h3>
            {unreadCount > 0 && (
              <button style={popupStyles.markAllBtn} onClick={markAllAsRead}>
                모두 읽음 처리
              </button>
            )}
          </div>
          <ul style={popupStyles.notificationList}>
            {notifications.length === 0 ? (
              <div style={popupStyles.emptyState}>알림이 없습니다.</div>
            ) : (
              notifications.map(notification => (
                <li
                  key={notification.id}
                  style={{
                    ...popupStyles.notificationItem,
                    ...(isUnread(notification) ? popupStyles.notificationItemUnread : {})
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <h4 style={popupStyles.notificationTitle}>
                    {notification.type}
                    {isUnread(notification) && ' 🟡'}
                  </h4>
                  <p style={popupStyles.notificationContent}>{notification.content}</p>
                  <p style={popupStyles.timeText}>{formatDate(notification.createdAt)}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </IconWrap>
  );
}

export default StoreNotificationIcon;