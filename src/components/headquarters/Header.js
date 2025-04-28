import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 로고 클릭 시 현재 페이지로 이동
  const handleLogoClick = () => {
    navigate(location.pathname, { replace: true });
  };

  return (
    <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #eee' }}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
        {/* 좌측 여백 */}
        <Box sx={{ width: 300 }} />
        {/* 가운데 로고 */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <img
            src="/core_logo.png" // public 폴더에 core_logo.png로 저장
            alt="CORE"
            style={{ height: 30, cursor: 'pointer' }}
            onClick={handleLogoClick}
          />
        </Box>
        {/* 우측 Store 버튼 */}
        <Box sx={{ width: 200, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            color="inherit" 
            onClick={() => navigate('/store')}
            sx={{ mr: 2 }}
          >
            Store
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 