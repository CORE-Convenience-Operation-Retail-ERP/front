import React from 'react';
import { Box, Typography } from '@mui/material';
import AnnualLeaveCon from '../../containers/headquarters/AnnualLeaveCon';

const AnnualLeavePage = () => {
  return (
    <Box sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        연차 신청 관리
      </Typography>
      <AnnualLeaveCon />
    </Box>
  );
};

export default AnnualLeavePage; 