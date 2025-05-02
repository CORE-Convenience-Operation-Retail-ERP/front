import React from 'react';
import { Typography, Box } from '@mui/material';
import WidgetWrapper from './WidgetWrapper';

const PopularProductsWidget = () => {
  return (
    <WidgetWrapper title="인기 상품">
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Typography variant="body1">인기 상품 정보가 표시될 영역입니다</Typography>
      </Box>
    </WidgetWrapper>
  );
};

export default PopularProductsWidget; 