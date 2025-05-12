import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  Divider,
  Alert
} from '@mui/material';

// 위젯 목록 정의
const widgetsList = [
  { id: 'storeOverview', name: '점포 & 매출 현황', description: '전체 점포수, 이번달 신규 점포수, 당일 매출, 당월 매출 현황을 보여줍니다.' },
  { id: 'sales', name: '매출 분석', description: '일별/월별 매출 추이를 보여줍니다.' },
  { id: 'popular', name: '인기 상품', description: '현재 가장 인기 있는 상품 TOP5를 보여줍니다.' },
  { id: 'board', name: '최근 게시글', description: '최근 공지사항 및 게시글을 보여줍니다.' },
  { id: 'alert', name: '알림', description: '중요 알림 및 미결제 상태를 보여줍니다.' },
  { id: 'storeRank', name: '점포 랭킹', description: '매출 기준 상위 점포 랭킹을 보여줍니다.' },
  { id: 'categoryRank', name: '카테고리 랭킹', description: '매출 기준 상위 카테고리 랭킹을 보여줍니다.' }
];

const DashboardSettings = ({ open, handleClose, layouts, setLayouts }) => {
  const [selectedWidgets, setSelectedWidgets] = useState([]);
  const [error, setError] = useState('');

  // 레이아웃 정보를 기반으로 선택된 위젯 목록 설정
  useEffect(() => {
    if (layouts && layouts.lg) {
      const selectedIds = layouts.lg.map(item => item.i);
      setSelectedWidgets(selectedIds);
    }
  }, [layouts]);

  // 위젯 선택 변경 핸들러
  const handleWidgetToggle = (widgetId) => {
    if (selectedWidgets.includes(widgetId)) {
      setSelectedWidgets(selectedWidgets.filter(id => id !== widgetId));
    } else {
      setSelectedWidgets([...selectedWidgets, widgetId]);
    }
  };

  // 설정 저장 핸들러
  const handleSave = () => {
    if (selectedWidgets.length === 0) {
      setError('최소 1개 이상의 위젯을 선택해주세요.');
      return;
    }

    setError('');
    
    // 각 반응형 레이아웃에 대해 선택된 위젯 반영
    const newLayouts = {
      lg: [],
      md: [],
      sm: [],
      xs: []
    };
    
    // 선택된 위젯을 추가하고 위치 설정
    selectedWidgets.forEach((widgetId, index) => {
      // 모든 위젯을 1x1 크기로 통일
      const row = Math.floor(index / 2);
      const col = index % 2;
      
      newLayouts.lg.push({ i: widgetId, x: col, y: row, w: 1, h: 1 });
      newLayouts.md.push({ i: widgetId, x: col, y: row, w: 1, h: 1 });
      newLayouts.sm.push({ i: widgetId, x: col, y: row, w: 1, h: 1 });
      newLayouts.xs.push({ i: widgetId, x: 0, y: index, w: 1, h: 1 });
    });
    
    // 레이아웃 상태 업데이트
    setLayouts(newLayouts);
    
    // 설정 창 닫기
    handleClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6">대시보드 위젯 설정</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          대시보드에 표시할 위젯을 선택해주세요.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}
        
        <Divider sx={{ mb: 2 }} />
        
        <FormGroup>
          {widgetsList.map((widget) => (
            <Box key={widget.id} sx={{ mb: 1.5 }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={selectedWidgets.includes(widget.id)} 
                    onChange={() => handleWidgetToggle(widget.id)}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle2">{widget.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {widget.description}
                    </Typography>
                  </Box>
                }
              />
            </Box>
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DashboardSettings;