import React from 'react';
import { Paper, Typography, Box, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const WidgetWrapper = ({ title, children, onRefresh }) => {
  return (
    <Paper 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '.edit-mode &': {
          boxShadow: '0 0 0 2px #1976d2',
          cursor: 'move'
        }
      }}
      elevation={3}
    >
      <Box 
        sx={{ 
          p: 1.5, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #eee',
          bgcolor: 'primary.light',
          color: 'white'
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontSize: '1rem' }}>
          {title}
        </Typography>
        {onRefresh && (
          <IconButton size="small" onClick={onRefresh} sx={{ color: 'white' }}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      <Box sx={{ p: 1.5, flexGrow: 1, overflow: 'auto' }}>
        {children}
      </Box>
    </Paper>
  );
};

export default WidgetWrapper;