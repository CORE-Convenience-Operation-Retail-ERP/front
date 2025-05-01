// src/pages/headquarters/board/SuggestionsPage.js
import React from 'react';
import BoardListCon from '../../../containers/headquarters/board/BoardListCon';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FeedbackIcon from '@mui/icons-material/Feedback';

const SuggestionsPage = () => {
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
          <FeedbackIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          건의사항
        </Typography>
      </Breadcrumbs>
      
      <BoardListCon boardType={2} />
    </Box>
  );
};

export default SuggestionsPage;