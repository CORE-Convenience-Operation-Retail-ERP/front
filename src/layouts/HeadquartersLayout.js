import React from 'react';
import Header from '../components/headquarters/Header';
import Sidebar from '../components/headquarters/Sidebar';
import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';

const HeadquartersLayout = () => (
  <Box sx={{ display: 'flex' }}>
    {/* 왼쪽 사이드바 */}
    <Sidebar />
    {/* 오른쪽 컨텐츠 영역 */}
    <Box sx={{ flex: 1, ml: '20px', minHeight: '100vh', position: 'relative' }}>
      {/* 상단 헤더 */}
      <Header />
      {/* 본문 영역 */}
      <Box
        sx={{
          mt: '5px', // 헤더 높이만큼 위에 여백 확보
          p: 3,      // 본문에 패딩 적용
          minHeight: 'calc(100vh - 64px)' // 스크롤 생기지 않게 조정
        }}
      >
        <Outlet /> {/* 하위 라우트 페이지들이 이 위치에 렌더링됨 */}
      </Box>
    </Box>
  </Box>
);

export default HeadquartersLayout;