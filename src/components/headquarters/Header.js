import React from 'react';
import { AppBar, Toolbar, Button, Box, Badge, IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 알림 드롭다운 제어용
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifications, setNotifications] = React.useState([
    { id: 1, title: '새 공지사항이 등록되었습니다.' },
    { id: 2, title: '연차 신청이 도착했습니다.' },
  ]);
  const open = Boolean(anchorEl);

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

  return (
    <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #eee' }}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
        {/* 좌측 여백 */}
        <Box sx={{ width: 700 }} />

        {/* 가운데 로고 */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <img
            src="/core_logo.png"
            alt="CORE"
            style={{ height: 30, cursor: 'pointer' }}
            onClick={handleLogoClick}
          />
        </Box>

        {/* 우측 아이콘들 */}
        <Box sx={{ width: 300, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1.5 }}>
          {/* 알림 아이콘 */}
          <IconButton onClick={handleNotificationClick}>
            <Badge badgeContent={notifications.length} color="error">
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
              <MenuItem key={notification.id} onClick={handleNotificationClose}>
                {notification.title}
              </MenuItem>
            ))}
          </Menu>

          {/* 프로필 이미지 */}
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

          {/* 사용자 이름 */}
          <Box
            sx={{
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
            onClick={() => navigate('/headquarters/hr/my-page')}
          >
            홍길동님
          </Box>

          {/* 로그아웃 버튼 */}
          <LogoutIcon
            sx={{ cursor: 'pointer' }}
            onClick={handleLogout}
          />

          {/* Store 이동 버튼 */}
          <Button color="inherit" onClick={() => navigate('/store')}>
            Store
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
