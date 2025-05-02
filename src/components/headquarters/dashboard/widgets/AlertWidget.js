import React from 'react';
import { Typography, Box, List, ListItem, ListItemText, Divider, ListItemIcon } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WidgetWrapper from './WidgetWrapper';

const AlertWidget = () => {
  // 더미 데이터
  const dummyAlerts = [
    { id: 1, message: '2023년 7월 판매 목표 달성!', timestamp: '오늘 09:15' },
    { id: 2, message: '서울 강남점 재고 부족 알림', timestamp: '어제 14:30' },
    { id: 3, message: '시스템 업데이트 예정', timestamp: '2일 전' }
  ];

  return (
    <WidgetWrapper title="알림">
      {dummyAlerts.length > 0 ? (
        <List sx={{ width: '100%', p: 0 }}>
          {dummyAlerts.map((alert, index) => (
            <React.Fragment key={alert.id}>
              <ListItem sx={{ px: 1, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <NotificationsIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={alert.message}
                  secondary={alert.timestamp}
                  primaryTypographyProps={{ noWrap: true, fontSize: '0.9rem' }}
                  secondaryTypographyProps={{ fontSize: '0.75rem' }}
                />
              </ListItem>
              {index < dummyAlerts.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Typography variant="body1">새로운 알림이 없습니다</Typography>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default AlertWidget; 