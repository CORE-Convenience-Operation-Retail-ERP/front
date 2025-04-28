import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          CORE ERP
        </Typography>
        <Button 
          color="inherit" 
          onClick={() => navigate('/store')}
          sx={{ mr: 2 }}
        >
          Store
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 