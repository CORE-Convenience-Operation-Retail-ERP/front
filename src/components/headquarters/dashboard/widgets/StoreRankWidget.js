import React from 'react';
import { Typography, Box, List, ListItem, ListItemText, Divider, Chip } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import WidgetWrapper from './WidgetWrapper';

const StoreRankWidget = () => {
  // 더미 데이터
  const dummyStoreRanks = [
    { id: 1, storeName: '강남점', sales: 245000000, growth: 12 },
    { id: 2, storeName: '홍대점', sales: 198000000, growth: 5 },
    { id: 3, storeName: '부산점', sales: 187000000, growth: -2 },
    { id: 4, storeName: '대구점', sales: 154000000, growth: 8 },
    { id: 5, storeName: '인천점', sales: 143000000, growth: 3 }
  ];

  const formatSales = (sales) => {
    if (sales >= 100000000) {
      return `${(sales / 100000000).toFixed(1)}억`;
    } else if (sales >= 10000) {
      return `${(sales / 10000).toFixed(0)}만`;
    }
    return sales.toString();
  };

  return (
    <WidgetWrapper title="지점 매출 순위">
      {dummyStoreRanks.length > 0 ? (
        <List sx={{ width: '100%', p: 0 }}>
          {dummyStoreRanks.map((store, index) => (
            <React.Fragment key={store.id}>
              <ListItem sx={{ px: 1, py: 0.5 }}>
                <Typography variant="body2" sx={{ minWidth: 24, fontWeight: 'bold' }}>
                  {index + 1}
                </Typography>
                <ListItemText 
                  primary={store.storeName}
                  secondary={formatSales(store.sales)}
                  primaryTypographyProps={{ noWrap: true, fontSize: '0.9rem' }}
                  secondaryTypographyProps={{ fontSize: '0.75rem' }}
                />
                <Chip 
                  size="small"
                  label={`${Math.abs(store.growth)}%`}
                  color={store.growth >= 0 ? "success" : "error"}
                  icon={store.growth >= 0 ? <ArrowUpwardIcon fontSize="small" /> : null}
                  sx={{ height: 24, '& .MuiChip-label': { px: 1 } }}
                />
              </ListItem>
              {index < dummyStoreRanks.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Typography variant="body1">매출 데이터가 없습니다</Typography>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default StoreRankWidget; 