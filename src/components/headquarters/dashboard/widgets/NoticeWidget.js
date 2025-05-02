import React from 'react';
import { Typography, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import WidgetWrapper from './WidgetWrapper';

const NoticeWidget = () => {
  // 더미 데이터
  const dummyNotices = [
    { id: 1, title: '시스템 점검 안내', date: '2023-07-20' },
    { id: 2, title: '7월 판매 목표 달성 현황', date: '2023-07-18' },
    { id: 3, title: '신규 제품 입고 안내', date: '2023-07-15' }
  ];

  return (
    <WidgetWrapper title="공지사항">
      {dummyNotices.length > 0 ? (
        <List sx={{ width: '100%', p: 0 }}>
          {dummyNotices.map((notice, index) => (
            <React.Fragment key={notice.id}>
              <ListItem sx={{ px: 1, py: 0.5 }}>
                <ListItemText 
                  primary={notice.title}
                  secondary={notice.date}
                  primaryTypographyProps={{ noWrap: true, fontSize: '0.9rem' }}
                  secondaryTypographyProps={{ fontSize: '0.75rem' }}
                />
              </ListItem>
              {index < dummyNotices.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Typography variant="body1">공지사항이 없습니다</Typography>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default NoticeWidget; 