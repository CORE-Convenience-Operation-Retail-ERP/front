import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import MySalaryCon from '../../containers/headquarters/MySalaryCon';

const MySalaryPage = () => {
  return (
    <Box sx={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Box sx={{ width: '90%', maxWidth: 2200, mx: 'auto', mt: 4, mb: 7 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{
            fontWeight: 'bold',
            fontSize: 30,
            color: '#2563A6',
            letterSpacing: '-1px',
            ml: 15
          }}>
            나의 급여 내역
          </Typography>
        </Box>
      </Box>
      <Box sx={{ width: '90%', maxWidth: 1200, mx: 'auto' }}>
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 3, 
            p: 3,
            backgroundColor: '#fff',
            border: '1px solid #eaeef3',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
            width: '100%',
            minHeight: 400
          }}
        >
          <MySalaryCon />
        </Paper>
      </Box>
    </Box>
  );
};

export default MySalaryPage;