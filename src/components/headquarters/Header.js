import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Box, Badge, IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import ChatModal from '../chat/ChatModal';
import chatService from '../../service/ChatService';
import NotificationIcon from '../common/NotificationIcon';
import adminNotificationService from '../../service/AdminNotificationService';
import StorefrontIcon from '@mui/icons-material/Storefront';
import Tooltip from '@mui/material/Tooltip';
import useLogout from '../../hooks/useLogout';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useLogout();

  const [anchorEl, setAnchorEl] = useState(null);
  // 기존 연차 알림 관련 상태 - 주석 처리

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

  const deptId = parseInt(localStorage.getItem('deptId'), 10);
  const isStoreOwner = deptId === 3;

  // 채팅 알림 구독 - 웹소켓 관련이므로 유지
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
    if (adminNotificationService) {
      console.log('헤더 마운트 - 관리자 알림 새로고침 시도');
      adminNotificationService.refresh()
        .then(() => console.log('관리자 알림 새로고침 성공'))
        .catch(err => console.error('관리자 알림 새로고침 실패:', err));
    }
    
    // 컴포넌트 언마운트 시 구독 해제
    const handleVisibilityChange = () => {
      if (!document.hidden && adminNotificationService) {
        console.log('헤더 마운트 - 문서 보이기 상태 감지');
        adminNotificationService.refresh();
      }
    };
    
    // 문서 보이기 상태 감지 이벤트 등록
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleLogoClick = () => {
    navigate(location.pathname, { replace: true });
  };

  const handleLogout = logout;

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


  // 본사 페이지인지 확인
  const isHeadquartersPage = location.pathname.startsWith('/headquarters');

  return (
    <>
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #eee' }}>
        <Toolbar sx={{ minHeight: 64, px: 3, position: 'relative' }}>
          {/* 중앙: 로고 */}
          <Box
            sx={{
              position: 'absolute',
              left: '45%',
              top: '50%',
              transform: 'translate(-45%, -50%)',
              display: 'flex',
              alignItems: 'center',
              zIndex: 1, // 아이콘 그룹보다 위에 오도록
            }}
          >
            <img
              src="/core_logo.png"
              alt="CORE"
              style={{ height: 30, cursor: 'pointer' }}
              onClick={() => navigate('/headquarters/dashboard')}
            />
          </Box>

          {/* 오른쪽: 아이콘 그룹 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, marginLeft: 'auto' }}>
            {/* 점주일 때만 store 버튼 노출 */}
            {isHeadquartersPage && isStoreOwner && (
              <Tooltip title="Store" arrow>
                <IconButton
                  color="primary"
                  onClick={() => navigate('/store/home')}
                  sx={{ mr: 1, ml: 1}}
                >
                  <Box
                    sx={{
                      backgroundColor: '#222',
                      borderRadius: '50%',
                      width: 26,
                      height: 26,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <StorefrontIcon sx={{ color: 'white', fontSize: 18 }} />
                  </Box>
                </IconButton>
              </Tooltip>
            )}
            {/* 채팅 아이콘 (본사 페이지일 때만 표시) */}
            {isHeadquartersPage && (
              <IconButton onClick={toggleChat}>
                <Badge badgeContent={unreadMessages} color="error">
                  <ChatIcon sx={{ color: 'black' }} />
                </Badge>
              </IconButton>
            )}
            {/* 알림 아이콘 및 알림 목록 팝업(드롭다운) */}
            <NotificationIcon />
            <Box
              sx={{
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
                color: 'black'
              }}
              onClick={() => navigate(`/headquarters/hr/my-page`)}
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
