import React from 'react';
import Header from '../components/headquarters/Header';
import Sidebar from '../components/headquarters/Sidebar';
import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';

const HeadquartersLayout = () => (
  <Box sx={{ display: 'flex' }}>
    <Sidebar />
    <Box sx={{ flex: 1, ml: '20px', minHeight: '100vh', position: 'relative' }}>
      <Header />
      <Box
        sx={{
          mt: '5px', // 헤더 높이만큼 위에 여백
          p: 3,       // 본문에 패딩(선택)
          minHeight: 'calc(100vh - 64px)', // 스크롤 생기지 않게
          background: '#f9f9f9' // 배경색(선택)
        }}
      >
        <Outlet />
      </Box>
    </Box>
  </Box>
);

export default HeadquartersLayout;