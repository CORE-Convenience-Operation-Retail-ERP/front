import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AddIcon from '@mui/icons-material/Add';

const AnnualLeaveCom = ({ leaveRequests, onNewRequest }) => {
  // 상태에 따른 칩 색상 설정
  const getStatusColor = (status) => {
    switch(status) {
      case '승인':
        return { bgcolor: '#4caf50', color: 'white' };
      case '거절':
        return { bgcolor: '#f44336', color: 'white' };
      case '대기중':
        return { bgcolor: '#ff9800', color: 'white' };
      default:
        return { bgcolor: '#e0e0e0', color: 'black' };
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EventIcon sx={{ color: '#1EACB5', mr: 1 }} />
            <Typography variant="h6" fontWeight="bold">연차 신청 관리</Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={onNewRequest}
            sx={{ 
              bgcolor: '#015D70', 
              '&:hover': { bgcolor: '#014D5E' },
              borderRadius: '8px',
              textTransform: 'none',
              boxShadow: '0px 3px 6px rgba(1, 93, 112, 0.2)',
            }}
          >
            연차 신청
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        {leaveRequests && leaveRequests.length > 0 ? (
          <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 440 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>신청일</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>시작일</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>종료일</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>일수</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>사유</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>상태</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveRequests.map((request, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{request.requestDate}</TableCell>
                    <TableCell>{request.startDate}</TableCell>
                    <TableCell>{request.endDate}</TableCell>
                    <TableCell>{request.days}</TableCell>
                    <TableCell>{request.reason}</TableCell>
                    <TableCell>
                      <Chip 
                        label={request.status} 
                        size="small" 
                        sx={{ 
                          ...getStatusColor(request.status),
                          fontWeight: 'medium',
                          minWidth: '70px'
                        }} 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ 
            py: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            color: 'text.secondary' 
          }}>
            <EventIcon sx={{ fontSize: 40, color: '#e0e0e0', mb: 1 }} />
            <Typography variant="body1">신청한 연차 내역이 없습니다.</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              상단의 '연차 신청' 버튼을 클릭하여 연차를 신청해주세요.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AnnualLeaveCom; 