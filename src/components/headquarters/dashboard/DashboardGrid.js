import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import DoneIcon from '@mui/icons-material/Done';
import DashboardSettings from './DashboardSettings';
import SalesWidget from './widgets/SalesWidget';
import PopularProductsWidget from './widgets/PopularProductsWidget';
import NoticeWidget from './widgets/NoticeWidget';
import AlertWidget from './widgets/AlertWidget';
import StoreRankWidget from './widgets/StoreRankWidget';
import CategoryRankWidget from './widgets/CategoryRankWidget';
import BoardWidget from './widgets/BoardWidget';
import StoreOverviewWidget from './widgets/StoreOverviewWidget';

const ResponsiveGridLayout = WidthProvider(Responsive);

// 위젯 매핑
const widgets = {
  sales: SalesWidget,
  popular: PopularProductsWidget,
  notice: NoticeWidget,
  alert: AlertWidget,
  storeRank: StoreRankWidget,
  categoryRank: CategoryRankWidget,
  board: BoardWidget,
  storeOverview: StoreOverviewWidget
};

const DashboardGrid = () => {
  const [layouts, setLayouts] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // 로컬스토리지에서 레이아웃 로드
  useEffect(() => {
    const userId = localStorage.getItem('empId');
    const savedLayouts = localStorage.getItem(`dashboard-layout-${userId}`);
    
    if (savedLayouts) {
      try {
        setLayouts(JSON.parse(savedLayouts));
      } catch (error) {
        console.error('레이아웃 파싱 오류:', error);
        setLayouts(getDefaultLayouts());
      }
    } else {
      // 기본 레이아웃
      setLayouts(getDefaultLayouts());
    }
  }, []);

  // 레이아웃 변경 시 저장
  const handleLayoutChange = (layout, allLayouts) => {
    // 편집 모드일 때만 레이아웃 변경 허용
    if (editMode) {
      const userId = localStorage.getItem('empId');
      localStorage.setItem(`dashboard-layout-${userId}`, JSON.stringify(allLayouts));
      setLayouts(allLayouts);
    }
  };

  // 설정 버튼 클릭 핸들러
  const handleSettingsClick = () => {
    if (editMode) {
      // 편집 모드 종료
      setEditMode(false);
      const userId = localStorage.getItem('empId');
      layouts && localStorage.setItem(`dashboard-layout-${userId}`, JSON.stringify(layouts));
    } else {
      // 설정 창 열기
      setSettingsOpen(true);
    }
  };

  // 기본 레이아웃 설정
  const getDefaultLayouts = () => {
    return {
      lg: [
        { i: 'storeOverview', x: 0, y: 0, w: 1, h: 1 },
        { i: 'sales', x: 1, y: 0, w: 1, h: 1 },
        { i: 'popular', x: 0, y: 1, w: 1, h: 1 },
        { i: 'board', x: 1, y: 1, w: 1, h: 1 },
        { i: 'alert', x: 0, y: 2, w: 1, h: 1 }
      ],
      md: [
        { i: 'storeOverview', x: 0, y: 0, w: 1, h: 1 },
        { i: 'sales', x: 1, y: 0, w: 1, h: 1 },
        { i: 'popular', x: 0, y: 1, w: 1, h: 1 },
        { i: 'board', x: 1, y: 1, w: 1, h: 1 },
        { i: 'alert', x: 0, y: 2, w: 1, h: 1 }
      ],
      sm: [
        { i: 'storeOverview', x: 0, y: 0, w: 1, h: 1 },
        { i: 'sales', x: 1, y: 0, w: 1, h: 1 },
        { i: 'popular', x: 0, y: 1, w: 1, h: 1 },
        { i: 'board', x: 1, y: 1, w: 1, h: 1 },
        { i: 'alert', x: 0, y: 2, w: 1, h: 1 }
      ],
      xs: [
        { i: 'storeOverview', x: 0, y: 0, w: 1, h: 1 },
        { i: 'sales', x: 0, y: 1, w: 1, h: 1 },
        { i: 'popular', x: 0, y: 2, w: 1, h: 1 },
        { i: 'board', x: 0, y: 3, w: 1, h: 1 },
        { i: 'alert', x: 0, y: 4, w: 1, h: 1 }
      ]
    };
  };

  // 설정 창에서 저장 후 편집 모드로 전환
  const handleSettingsClose = () => {
    setSettingsOpen(false);
    // 설정 창을 닫은 후 자동으로 편집 모드 활성화
    setEditMode(true);
  };

  return (
    <Box sx={{ p: 0, position: 'relative' }}>
      {/* 설정 버튼 (우측 상단 위치로 고정) */}
      <Box sx={{ 
        position: 'fixed', 
        top: '50px', 
        right: '20px', 
        zIndex: 1100
      }}>
        <Tooltip title={editMode ? "설정 완료" : "위젯 설정"}>
          <Box sx={{ position: 'relative' }}>
            {editMode && (
              <Typography 
                variant="caption" 
                sx={{ 
                  position: 'absolute',
                  right: '100%',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(0, 0, 0, 0.7)', 
                  color: 'white', 
                  borderRadius: 1, 
                  py: 0.5, 
                  px: 1,
                  mr: 1,
                  whiteSpace: 'nowrap'
                }}
              >
                위젯 위치 변경 모드
              </Typography>
            )}
            <IconButton 
              onClick={handleSettingsClick}
              sx={{ 
                bgcolor: editMode ? 'success.light' : 'white', 
                color: editMode ? 'white' : 'primary.main',
                '&:hover': { 
                  bgcolor: editMode ? 'success.main' : 'white', 
                  color: editMode ? 'white' : 'primary.dark',
                },
                boxShadow: 2,
                border: editMode ? 'none' : '1px solid #e0e0e0'
              }}
              size="large"
            >
              {editMode ? <DoneIcon /> : <SettingsIcon />}
            </IconButton>
          </Box>
        </Tooltip>
      </Box>
      
      {layouts && (
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
          cols={{ lg: 2, md: 2, sm: 2, xs: 1 }}
          rowHeight={300}
          margin={[16, 16]}
          containerPadding={[16, 16]}
          onLayoutChange={handleLayoutChange}
          isDraggable={editMode} // 편집 모드일 때만 드래그 가능
          isResizable={false}
        >
          {Object.keys(layouts).length > 0 && layouts.lg.map(item => {
            const WidgetComponent = widgets[item.i];
            if (!WidgetComponent) return null;
            
            return (
              <div key={item.i} className={editMode ? 'edit-mode' : ''}>
                <WidgetComponent />
              </div>
            );
          })}
        </ResponsiveGridLayout>
      )}
      
      <DashboardSettings 
        open={settingsOpen} 
        handleClose={handleSettingsClose}
        layouts={layouts}
        setLayouts={setLayouts}
      />
    </Box>
  );
};

export default DashboardGrid;