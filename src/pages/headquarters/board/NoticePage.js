// src/pages/headquarters/board/NoticePage.js
import React from 'react';
import BoardListCon from '../../../containers/headquarters/board/BoardListCon';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AnnouncementIcon from '@mui/icons-material/Announcement';

const NoticePage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href="/"
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          홈
        </Link>
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href="/headquarters"
        >
          본사
        </Link>
        <Typography
          sx={{ display: 'flex', alignItems: 'center' }}
          color="text.primary"
        >
          <AnnouncementIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          공지사항
        </Typography>
      </Breadcrumbs>
      
      <BoardListCon boardType={1} />
    </Box>
  );
};

export default NoticePage;