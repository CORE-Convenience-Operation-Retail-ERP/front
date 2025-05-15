import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Box, Badge, IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatIcon from '@mui/icons-material/Chat';
import axios from 'axios';
import ChatModal from '../chat/ChatModal';
import chatService from '../../service/ChatService';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadMessagesByRoom, setUnreadMessagesByRoom] = useState({});
  const open = Boolean(anchorEl);

  // 새 방식: JWT 토큰 기반 로그인 정보 가져오기
  const name = localStorage.getItem('empName');
  const userRole = localStorage.getItem('role');  
  // 또는 localStorage.getItem('name'); 이런 식으로 저장되었을 수 있음

  // userName 설정 부분 
  const userName = name || "로그인 해주세요";

  // 채팅 알림 구독
  useEffect(() => {
    // 알림 상태 업데이트 콜백 등록
    const unsubscribe = chatService.onUnreadMessagesChange((totalCount, roomCounts) => {
      setUnreadMessages(totalCount);
      setUnreadMessagesByRoom(roomCounts);
    });
    
    // 웹소켓 연결 상태 확인 및 필요 시 재연결
    const webSocketService = require('../../service/WebSocketService').default;
    if (!webSocketService.isConnected()) {
      console.log('헤더 마운트 - 웹소켓 연결 확인 및 재연결 시도');
      webSocketService.autoConnect();
    }
    
    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      unsubscribe();
    };
  }, []);

  // 알림 데이터 가져오기
  useEffect(() => {
    fetchNotifications();
  }, []);

  // 알림 데이터를 가져오는 함수
  const fetchNotifications = async () => {
    if (!userRole) return;
    
    setLoading(true);
    try {
      // 연차 신청 목록 조회 API 호출
      const response = await axios.get('/api/hr/annual-leave/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // 응답 데이터에서 알림 목록 생성
      if (response.data) {
        // 미처리(상태가 0)인 연차 신청만 필터링
        const pendingLeaveRequests = response.data.filter(request => request.reqStatus === 0);
        
        // 알림 목록 생성
        const leaveNotifications = pendingLeaveRequests.map(request => ({
          id: request.reqId,
          title: `새로운 연차신청이 등록되었습니다.`,
          subtitle: `신청자: ${request.empName || '알 수 없음'}`,
          type: 'LEAVE_REQUEST',
          isRead: false,
          createdAt: request.createdAt || new Date().toISOString(),
          data: request
        }));
        
        setNotifications(leaveNotifications);
      }
    } catch (error) {
      console.error('연차 신청 알림 조회 실패:', error);
      // 오류 발생 시 빈 알림 설정
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoClick = () => {
    navigate(location.pathname, { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('empId');
    localStorage.removeItem('deptId');
    localStorage.removeItem('empName');
    localStorage.removeItem('deptName');
    localStorage.removeItem('role');
    localStorage.removeItem('storeId');
    localStorage.removeItem('storeName');
    navigate('/login');
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  // 채팅 모달 열기/닫기
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    
    // 채팅창을 열어도 알림은 유지 (각 채팅방에 들어갈 때만 해당 채팅방 알림 제거)
  };

  // 알림 클릭 시 해당 알림을 읽음 처리하는 함수
  const handleNotificationRead = (notification) => {
    // 알림 읽음 처리
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.id === notification.id ? { ...notif, isRead: true } : notif
      )
    );
    
    // 알림 유형에 따른 다른 처리
    if (notification.type === 'LEAVE_REQUEST') {
      // 연차 신청 상세 페이지로 이동 (실제 URL로 수정 필요)
      navigate(`/headquarters/hr/annual-leave/detail/${notification.id}`);
    }
    
    handleNotificationClose();
  };

  // 본사 페이지인지 확인
  const isHeadquartersPage = location.pathname.startsWith('/headquarters');

  return (
    <>
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #eee' }}>
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
          <Box sx={{ width: 300 }} />

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <img
              src="/core_logo.png"
              alt="CORE"
              style={{ height: 30, cursor: 'pointer' }}
              onClick={() => navigate('/headquarters/dashboard')}
            />
          </Box>

          <Box sx={{ width: 300, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1.5 }}>
            {/* 채팅 아이콘 (본사 페이지일 때만 표시) */}
            {isHeadquartersPage && (
              <IconButton onClick={toggleChat}>
                <Badge badgeContent={unreadMessages} color="error">
                  <ChatIcon sx={{ color: 'black' }} />
                </Badge>
              </IconButton>
            )}
            
            {/* 알림 아이콘 및 뱃지 */}
            <IconButton onClick={handleNotificationClick}>
              <Badge badgeContent={notifications.filter(n => !n.isRead).length} color="error">
                <NotificationsIcon sx={{ color: 'black' }} />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleNotificationClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <MenuItem 
                    key={notification.id} 
                    onClick={() => handleNotificationRead(notification)}
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'flex-start',
                      backgroundColor: notification.isRead ? 'inherit' : '#f0f7ff',
                      borderLeft: notification.isRead ? 'none' : '3px solid #1976d2'
                    }}
                  >
                    <Box sx={{ fontWeight: 'bold' }}>{notification.title}</Box>
                    {notification.subtitle && (
                      <Box sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                        {notification.subtitle}
                      </Box>
                    )}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>새로운 알림이 없습니다</MenuItem>
              )}
            </Menu>

            <Box
              component="img"
              src="/profile_default.png"
              alt="프로필"
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                cursor: 'pointer',
                objectFit: 'cover'
              }}
              onClick={() => navigate('/headquarters/hr/my-page')}
            />

            <Box
              sx={{
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
                color: 'black'
              }}
              onClick={() => navigate(`/headquarters/hr/my-page/${1}`)}
            >
              {userName}님
            </Box>

            <LogoutIcon
              sx={{ cursor: 'pointer', color: 'black' }}
              onClick={handleLogout}
            />
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* 채팅 모달 */}
      <ChatModal 
        isOpen={isChatOpen} 
        onClose={toggleChat}
      />
    </>
  );
};

export default Header;
