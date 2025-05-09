import React from 'react';
import StoreInquiryCon from '../../containers/headquarters/StoreInquiryCon';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';

const StoreInquiryPage = () => (
  <Container maxWidth="xl">
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          지점 문의 관리
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          고객으로부터 접수된 지점 관련 문의, 칭찬, 컴플레인을 관리하고 처리 상태를 업데이트할 수 있습니다.
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <StoreInquiryCon />
    </Paper>
  </Container>
);

export default StoreInquiryPage; 