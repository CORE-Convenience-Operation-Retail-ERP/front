import React, { useState } from 'react';
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  Tooltip,
  Pagination
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CommentIcon from '@mui/icons-material/Comment';
import { styled } from '@mui/system';

// 스타일이 적용된 테이블 셀
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: '#fff',
  color: '#2563A6',
  fontSize: '16px',
  border: 'none',
  borderBottom: '1px solid #F5F5F5',
  borderRight: '1px solid #F5F5F5',
  paddingTop: 16,
  paddingBottom: 16,
  textAlign: 'center' // 중앙 정렬 추가
}));

// 스타일이 적용된 테이블 데이터 셀
const StyledTableDataCell = styled(TableCell)(({ theme }) => ({
  border: 'none',
  borderBottom: '1px solid #F5F5F5',
  borderRight: '1px solid #F5F5F5',
  fontSize: '0.875rem',
  color: '#475569',
  verticalAlign: 'middle',
  textAlign: 'center',
  py: 2
}));

// 스타일이 적용된 Paper 컴포넌트
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
}));

const AnnualLeaveCom = ({ 
  leaveRequests, 
  onNewRequest, 
  onDetailView, 
  selectedRequest, 
  openDetailDialog, 
  onCloseDetailDialog,
  onApprove,
  onReject,
  onAddComment,
  userRole,
  approveComment,
  setApproveComment,
  isProcessing,
  approveError,
  commentLog,
  totalItems,
  currentPage,
  totalPages,
  onPageChange
}) => {
  // 상태에 따른 칩 색상 설정
  const getStatusColor = (status) => {
    switch(status) {
      case '승인':
        return { color: '#10B981', bgcolor: '#ECFDF5', borderColor: '#A7F3D0' };
      case '거절':
        return { color: '#EF4444', bgcolor: '#FEF2F2', borderColor: '#FECACA' };
      case '대기중':
        return { color: '#F59E0B', bgcolor: '#FFFBEB', borderColor: '#FDE68A' };
      default:
        return { color: '#64748B', bgcolor: '#F8FAFC', borderColor: '#E2E8F0' };
    }
  };

  // 마스터 권한 확인
  const isMaster = userRole && (
    userRole.includes('MASTER') || 
    userRole === '10' || 
    userRole === 'ROLE_MASTER'
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* 헤더 */}
      <Box sx={{ width: '90%', maxWidth: 2200, mx: 'auto', mt: 4, mb: 7 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{
            fontWeight: 'bold',
            fontSize: 30,
            color: '#2563A6',
            letterSpacing: '-1px',
            ml: 15
          }}>
            연차 신청 관리
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        alignItems: 'center',
        width: '90%', 
        maxWidth: 1200, 
        mx: 'auto', 
        mb: 5
      }}>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={onNewRequest}
          sx={{ 
            backgroundColor: '#2563A6',
            '&:hover': { backgroundColor: '#1E5187' },
            borderRadius: '30px',
            px: 3,
            height: 40
          }}
        >
          연차 신청
        </Button>
      </Box>
      
      <StyledPaper sx={{ width: '90%', maxWidth: 1200, mx: 'auto', mb: 3 }}>
        <TableContainer>
          <Table size="small" sx={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 4px 0 rgba(85, 214, 223, 0.08)' }}>
            <TableHead>
              <TableRow>
                <StyledTableCell>번호</StyledTableCell>
                <StyledTableCell>신청자</StyledTableCell>
                <StyledTableCell>신청일</StyledTableCell>
                <StyledTableCell>연차일</StyledTableCell>
                <StyledTableCell>일수</StyledTableCell>
                <StyledTableCell>사유</StyledTableCell>
                <StyledTableCell>상태</StyledTableCell>
                <StyledTableCell align="center">관리</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveRequests.length > 0 ? (
                leaveRequests.map((request) => (
                  <TableRow 
                    key={request.reqId || Math.random().toString()}
                    hover
                    sx={{ 
                      '&:hover': { backgroundColor: '#F0F5FF !important' },
                    }}
                  >
                    <StyledTableDataCell onClick={() => onDetailView(request)}>
                      {request.reqId}
                    </StyledTableDataCell>
                    <StyledTableDataCell onClick={() => onDetailView(request)}>
                      {request.empName || '-'}
                    </StyledTableDataCell>
                    <StyledTableDataCell onClick={() => onDetailView(request)}>
                      {request.requestDate ? new Date(request.requestDate).toLocaleDateString() : '-'}
                    </StyledTableDataCell>
                    <StyledTableDataCell onClick={() => onDetailView(request)}>
                      {request.startDate ? new Date(request.startDate).toLocaleDateString() : '-'}
                    </StyledTableDataCell>
                    <StyledTableDataCell onClick={() => onDetailView(request)}>
                      {request.days}
                    </StyledTableDataCell>
                    <StyledTableDataCell onClick={() => onDetailView(request)}>
                      {request.reason && request.reason.length > 15 
                        ? `${request.reason.substring(0, 15)}...` 
                        : request.reason || '-'}
                    </StyledTableDataCell>
                    <StyledTableDataCell>
                      <Chip 
                        label={request.status} 
                        size="small"
                        sx={{ 
                          ...getStatusColor(request.status),
                          minWidth: 80,
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '0.75rem',
                          borderRadius: '4px',
                        }} 
                      />
                    </StyledTableDataCell>
                    <StyledTableDataCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => onDetailView(request)}
                          sx={{
                            minWidth: 'unset',
                            px: 1,
                            py: 0.5,
                            fontSize: 12,
                            borderRadius: '12px',
                            borderColor: '#55D6DF',
                            color: '#2563A6',
                            '&:hover': {
                              borderColor: '#1E5187',
                              backgroundColor: 'rgba(85, 214, 223, 0.1)',
                            },
                          }}
                        >
                          상세보기
                        </Button>
                        
                        {isMaster && (
                          <>
                            {/* 대기중이거나 반려 상태일 때만 승인 버튼 표시 */}
                            {(request.status === '대기중' || request.status === '거절') && (
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => onApprove(request.reqId)}
                                sx={{
                                  minWidth: 'unset',
                                  px: 1,
                                  py: 0.5,
                                  fontSize: 12,
                                  borderRadius: '12px',
                                  borderColor: '#10B981',
                                  color: '#10B981',
                                  '&:hover': {
                                    borderColor: '#059669',
                                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                  },
                                }}
                              >
                                승인
                              </Button>
                            )}
                            
                            {/* 대기중이거나 승인 상태일 때만 반려 버튼 표시 */}
                            {(request.status === '대기중' || request.status === '승인') && (
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => onReject(request.reqId)}
                                sx={{
                                  minWidth: 'unset',
                                  px: 1,
                                  py: 0.5,
                                  fontSize: 12,
                                  borderRadius: '12px',
                                  borderColor: '#EF4444',
                                  color: '#EF4444',
                                  '&:hover': {
                                    borderColor: '#DC2626',
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                  },
                                }}
                              >
                                반려
                              </Button>
                            )}
                          </>
                        )}
                      </Box>
                    </StyledTableDataCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <StyledTableDataCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      color: '#94A3B8',
                      py: 4
                    }}>
                      <EventIcon sx={{ fontSize: 48, color: '#CBD5E1', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#64748B', mb: 1 }}>
                        신청한 연차 내역이 없습니다
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                        상단의 '연차 신청' 버튼을 클릭하여 연차를 신청해주세요
                      </Typography>
                    </Box>
                  </StyledTableDataCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* 페이징 */}
        {totalPages > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
            <Pagination
              count={totalPages}
              page={currentPage + 1}
              onChange={onPageChange}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
        
        {totalItems > 0 && (
          <Box sx={{ 
            textAlign: 'center', 
            mt: 1,
            mb: 3,
            color: '#666',
            fontSize: 14
          }}>
            총 {totalItems}개의 연차 신청 중 {(currentPage * 10) + 1} - {Math.min((currentPage + 1) * 10, totalItems)}번째 항목을 보고 있습니다.
          </Box>
        )}
      </StyledPaper>
      
      {/* 연차 신청 상세 정보 다이얼로그 */}
      <Dialog 
        open={openDetailDialog} 
        onClose={onCloseDetailDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#EFF6FF', 
          color: '#1E40AF',
          fontWeight: 700,
          py: 3
        }}>
          연차 신청 상세 정보
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3, pb: 1 }}>
          {console.log('모달 렌더링 중:', { selectedRequest, commentLog, isMaster })}
          {selectedRequest ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                      신청번호
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedRequest.reqId}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                      신청자
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedRequest.empName || '-'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                      신청일
                    </Typography>
                    <Typography variant="body1">
                      {selectedRequest.requestDate ? new Date(selectedRequest.requestDate).toLocaleDateString() : '-'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                      연차 사용일
                    </Typography>
                    <Typography variant="body1">
                      {selectedRequest.startDate ? new Date(selectedRequest.startDate).toLocaleDateString() : '-'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                      일수
                    </Typography>
                    <Typography variant="body1">
                      {selectedRequest.days}일
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                      처리 상태
                    </Typography>
                    <Chip 
                      label={selectedRequest.status} 
                      size="small"
                      variant="outlined"
                      sx={{ 
                        ...getStatusColor(selectedRequest.status),
                        fontWeight: 'medium',
                        fontSize: '0.75rem',
                        borderRadius: '4px',
                        width: 'fit-content'
                      }} 
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                      신청 사유
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 1 }}>
                      <Typography variant="body2">
                        {selectedRequest.reason || '(사유 없음)'}
                      </Typography>
                    </Paper>
                  </Box>
                </Grid>
                
                {/* 승인/반려 코멘트 표시 영역 */}
                {commentLog && commentLog.length > 0 && (
                  <Grid item xs={12}>
                    {console.log('코멘트 로그 렌더링:', commentLog)}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
                      <Typography variant="caption" sx={{ 
                        color: '#64748B', 
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}>
                        <CommentIcon fontSize="small" />
                        승인/반려 코멘트
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2, bgcolor: '#FFFBEB', borderRadius: 1 }}>
                        {commentLog.map((log, index) => (
                          <Box key={index} sx={{ mb: index < commentLog.length - 1 ? 1.5 : 0 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#92400E' }}>
                              {log.status === 1 ? '승인' : 
                               log.status === 2 ? '반려' : 
                               log.status === 0 ? '코멘트' : '기타'} - {log.approverName || '담당자'}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5, color: '#78350F' }}>
                              {log.comment || '(코멘트 없음)'}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#B45309' }}>
                              {new Date(log.approvedAt).toLocaleString()}
                            </Typography>
                            {index < commentLog.length - 1 && (
                              <Divider sx={{ my: 1.5, borderColor: '#FDE68A' }} />
                            )}
                          </Box>
                        ))}
                      </Paper>
                    </Box>
                  </Grid>
                )}
                
                {/* 마스터 권한이 있을 때 코멘트 입력 필드 표시 */}
                {console.log('마스터 권한 검사:', { isMaster, userRole })}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                      {selectedRequest.status === '대기중' ? '승인/반려 코멘트' : '코멘트 추가'}
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      placeholder={selectedRequest.status === '대기중' ? 
                        "승인 또는 반려 사유를 입력하세요..." : 
                        "코멘트를 입력하세요..."}
                      value={approveComment}
                      onChange={(e) => setApproveComment(e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                    
                    {approveError && (
                      <Alert severity="error" sx={{ mt: 1, fontSize: '0.875rem' }}>
                        {approveError}
                      </Alert>
                    )}
                    
                    <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'flex-end' }}>
                      {/* 현재 상태가 대기중이면 승인/반려 버튼 표시 */}
                      {selectedRequest.status === '대기중' ? (
                        <>
                          <Button
                            variant="outlined"
                            color="error"
                            disabled={isProcessing}
                            onClick={() => onReject(selectedRequest.reqId)}
                            sx={{ 
                              borderRadius: 1,
                              color: '#EF4444',
                              borderColor: '#FCA5A5',
                              '&:hover': {
                                borderColor: '#EF4444',
                                bgcolor: '#FEF2F2'
                              }
                            }}
                          >
                            {isProcessing ? <CircularProgress size={24} /> : '반려'}
                          </Button>
                          <Button
                            variant="contained"
                            disabled={isProcessing}
                            onClick={() => onApprove(selectedRequest.reqId)}
                            sx={{ 
                              borderRadius: 1,
                              bgcolor: '#10B981',
                              '&:hover': { bgcolor: '#059669' }
                            }}
                          >
                            {isProcessing ? <CircularProgress size={24} /> : '승인'}
                          </Button>
                        </>
                      ) : (
                        <>
                          {/* 현재 상태가 승인이라면 반려로 변경 가능 */}
                          {selectedRequest.status === '승인' && (
                            <Button
                              variant="outlined"
                              color="error"
                              disabled={isProcessing}
                              onClick={() => onReject(selectedRequest.reqId)}
                              sx={{ 
                                borderRadius: 1,
                                color: '#EF4444',
                                borderColor: '#FCA5A5',
                                '&:hover': {
                                  borderColor: '#EF4444',
                                  bgcolor: '#FEF2F2'
                                }
                              }}
                            >
                              {isProcessing ? <CircularProgress size={24} /> : '반려로 변경'}
                            </Button>
                          )}
                          
                          {/* 현재 상태가 반려라면 승인으로 변경 가능 */}
                          {selectedRequest.status === '거절' && (
                            <Button
                              variant="contained"
                              disabled={isProcessing}
                              onClick={() => onApprove(selectedRequest.reqId)}
                              sx={{ 
                                borderRadius: 1,
                                bgcolor: '#10B981',
                                '&:hover': { bgcolor: '#059669' }
                              }}
                            >
                              {isProcessing ? <CircularProgress size={24} /> : '승인으로 변경'}
                            </Button>
                          )}
                          
                          {/* 상태와 관계없이 코멘트 추가 버튼 표시 */}
                          <Button
                            variant="outlined"
                            disabled={isProcessing}
                            onClick={() => {
                              console.log('코멘트 추가 클릭:', selectedRequest.reqId);
                              onAddComment(selectedRequest.reqId);
                            }}
                            sx={{ 
                              borderRadius: 1,
                              color: '#6B7280',
                              borderColor: '#D1D5DB',
                              '&:hover': {
                                borderColor: '#9CA3AF',
                                bgcolor: '#F9FAFB'
                              }
                            }}
                          >
                            {isProcessing ? <CircularProgress size={24} /> : '코멘트 추가'}
                          </Button>
                        </>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography variant="body1">정보를 불러오는 중...</Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={onCloseDetailDialog} 
            variant="outlined"
            sx={{
              borderRadius: 1,
              color: '#6B7280',
              borderColor: '#D1D5DB',
              '&:hover': {
                borderColor: '#9CA3AF',
                bgcolor: '#F9FAFB'
              }
            }}
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnnualLeaveCom; 