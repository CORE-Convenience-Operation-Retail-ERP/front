import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, List, ListItem, ListItemText, ListItemIcon,
  Checkbox, Typography, Box, Divider
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

// 위젯 목록
const widgetOptions = [
  { id: 'sales', title: '매출 현황' },
  { id: 'popular', title: '인기 상품' },
  { id: 'notice', title: '공지사항' },
  { id: 'alert', title: '알림' },
  { id: 'storeRank', title: '지점 매출 순위' },
  { id: 'categoryRank', title: '카테고리별 매출 순위' },
  { id: 'board', title: '게시판' }
];

const DashboardSettings = ({ open, handleClose, layouts, setLayouts }) => {
  const [selectedWidgets, setSelectedWidgets] = useState(
    layouts ? layouts.lg.map(item => item.i) : []
  );
  
  // 선택된 위젯 목록
  const [orderedWidgets, setOrderedWidgets] = useState(
    layouts ? layouts.lg.map(item => item.i) : []
  );
  
  // 위젯 이동 처리
  const moveWidget = (index, direction) => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === orderedWidgets.length - 1)
    ) {
      return;
    }
    
    const newOrderedWidgets = [...orderedWidgets];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newOrderedWidgets[index];
    newOrderedWidgets[index] = newOrderedWidgets[targetIndex];
    newOrderedWidgets[targetIndex] = temp;
    
    setOrderedWidgets(newOrderedWidgets);
  };
  
  // 위젯 선택/해제 처리
  const handleToggleWidget = (widgetId) => {
    if (selectedWidgets.includes(widgetId)) {
      setSelectedWidgets(selectedWidgets.filter(id => id !== widgetId));
      setOrderedWidgets(orderedWidgets.filter(id => id !== widgetId));
    } else {
      setSelectedWidgets([...selectedWidgets, widgetId]);
      setOrderedWidgets([...orderedWidgets, widgetId]);
    }
  };
  
  // 설정 저장
  const handleSave = () => {
    // 새 레이아웃 생성
    const newLayouts = {
      lg: orderedWidgets.map((widgetId, index) => ({
        i: widgetId,
        x: index % 2,
        y: Math.floor(index / 2),
        w: 1,
        h: 1
      }))
    };
    
    // 레이아웃 저장
    setLayouts(newLayouts);
    const userId = localStorage.getItem('empId');
    localStorage.setItem(`dashboard-layout-${userId}`, JSON.stringify(newLayouts));
    
    handleClose();
  };
  
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>대시보드 설정</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          표시할 위젯을 선택하고 순서를 변경하세요
        </Typography>
        
        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            위젯 선택
          </Typography>
          <List>
            {widgetOptions.map((widget) => (
              <ListItem key={widget.id} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedWidgets.includes(widget.id)}
                    onChange={() => handleToggleWidget(widget.id)}
                  />
                </ListItemIcon>
                <ListItemText primary={widget.title} />
              </ListItem>
            ))}
          </List>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            위젯 순서 설정
          </Typography>
          {orderedWidgets.length > 0 ? (
            <List>
              {orderedWidgets.map((widgetId, index) => {
                const widget = widgetOptions.find(w => w.id === widgetId);
                return (
                  <ListItem 
                    key={widgetId}
                    sx={{
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                      mb: 1,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <DragIndicatorIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <ListItemText primary={widget.title} />
                    <Box>
                      <Button 
                        size="small" 
                        onClick={() => moveWidget(index, 'up')}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button 
                        size="small" 
                        onClick={() => moveWidget(index, 'down')}
                        disabled={index === orderedWidgets.length - 1}
                      >
                        ↓
                      </Button>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              선택된 위젯이 없습니다.
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DashboardSettings;