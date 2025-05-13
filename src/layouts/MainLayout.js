import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/headquarters/Header';
import Sidebar from '../components/headquarters/Sidebar';

const MainLayout = () => {
  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div className="main-content" style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <div className="content" style={{ 
          flex: 1, 
          overflow: 'auto',
          marginLeft: '240px' // 사이드바 너비 220px + 여백 20px
        }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout; 