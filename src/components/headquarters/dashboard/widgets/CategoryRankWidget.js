import React from 'react';
import { Typography, Box, List, ListItem, ListItemText, Divider, LinearProgress } from '@mui/material';
import WidgetWrapper from './WidgetWrapper';

const CategoryRankWidget = () => {
  // 더미 데이터
  const dummyCategoryRanks = [
    { id: 1, category: '의류', sales: 432000000, percentage: 35 },
    { id: 2, category: '신발', sales: 287000000, percentage: 23 },
    { id: 3, category: '액세서리', sales: 198000000, percentage: 16 },
    { id: 4, category: '가방', sales: 165000000, percentage: 13 },
    { id: 5, category: '화장품', sales: 123000000, percentage: 10 }
  ];

  const formatSales = (sales) => {
    if (sales >= 100000000) {
      return `${(sales / 100000000).toFixed(1)}억`;
    } else if (sales >= 10000) {
      return `${(sales / 10000).toFixed(0)}만`;
    }
    return sales.toString();
  };

  const getProgressColor = (index) => {
    const colors = ['primary', 'secondary', 'success', 'info', 'warning'];
    return colors[index % colors.length];
  };

  return (
    <WidgetWrapper title="카테고리별 매출 순위">
      {dummyCategoryRanks.length > 0 ? (
        <List sx={{ width: '100%', p: 0 }}>
          {dummyCategoryRanks.map((category, index) => (
            <React.Fragment key={category.id}>
              <ListItem sx={{ px: 1, py: 0.5, flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {category.category}
                  </Typography>
                  <Typography variant="body2">
                    {formatSales(category.sales)} ({category.percentage}%)
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={category.percentage} 
                  color={getProgressColor(index)}
                  sx={{ width: '100%', height: 8, borderRadius: 4 }}
                />
              </ListItem>
              {index < dummyCategoryRanks.length - 1 && <Divider sx={{ my: 0.5 }} />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Typography variant="body1">카테고리 데이터가 없습니다</Typography>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default CategoryRankWidget; 