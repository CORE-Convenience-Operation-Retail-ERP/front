import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import axios from '../../service/axiosInstance';
import MySalaryCon from '../../containers/headquarters/MySalaryCon';

const MySalaryPage = () => {
  return (
    <div>
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
      
      <MySalaryCon />
    </div>
  );
};

export default MySalaryPage;