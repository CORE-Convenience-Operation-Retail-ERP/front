import React from 'react';
import { AppBar, Toolbar, Button, Box, Badge, IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifications, setNotifications] = React.useState([
    { id: 1, title: '새 공지사항이 등록되었습니다.', isRead: false },
    { id: 2, title: '연차 신청이 도착했습니다.', isRead: false },
  ]);
  const open = Boolean(anchorEl);
debugger;
  const loginUser = JSON.parse(localStorage.getItem('loginUser'));
  const userName = loginUser ? loginUser.name : "로그인 해주세요";

  const handleLogoClick = () => {
    navigate(location.pathname, { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  // 알림 클릭 시 해당 알림을 읽음 처리하는 함수
  const handleNotificationRead = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
    handleNotificationClose();
  };

  return (
    <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #eee' }}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
        <Box sx={{ width: 300 }} />

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <img
            src="/core_logo.png"
            alt="CORE"
            style={{ height: 30, cursor: 'pointer' }}
            onClick={handleLogoClick}
          />
        </Box>

        <Box sx={{ width: 300, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1.5 }}>
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
            {notifications.map((notification) => (
              // 알림 목록 클릭 시 읽음 처리
              <MenuItem key={notification.id} onClick={() => handleNotificationRead(notification.id)}>
                {notification.title}
              </MenuItem>
            ))}
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

          <Button color="inherit" onClick={() => navigate('/store')}>
            Store
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
