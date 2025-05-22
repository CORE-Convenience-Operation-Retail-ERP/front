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
  Pagination,
  InputBase
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CommentIcon from '@mui/icons-material/Comment';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from '@mui/system';
import MuiButton from '@mui/material/Button';
import MuiChip from '@mui/material/Chip';

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

// 둥근 버튼 스타일
const RoundButton = styled(MuiButton)({
  borderRadius: '30px !important',
  minWidth: 'unset',
  padding: '6px 16px',
});

// 둥근 칩 스타일
const RoundChip = styled(MuiChip)({
  borderRadius: '30px !important',
  minWidth: 80,
  fontWeight: 700,
  fontSize: '0.75rem',
  justifyContent: 'center',
});

// 검색어 하이라이트 함수
const highlightText = (text, searchTerm) => {
  if (!searchTerm || !text) return text;
  
  const parts = String(text).split(new RegExp(`(${searchTerm})`, 'gi'));
  return (
    <>
      {parts.map((part, index) => 
        part.toLowerCase() === searchTerm.toLowerCase() ? 
          <span key={index} style={{ backgroundColor: '#D0EBFF', fontWeight: 'bold' }}>
            {part}
          </span> : part
      )}
    </>
  );
};

// 안전한 날짜 포맷 함수 추가
const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const safeStr = dateStr.replace(/-/g, '/');
  const d = new Date(safeStr);
  return isNaN(d) ? '-' : d.toLocaleDateString();
};

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
  onPageChange,
  search,
  onSearch
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
  
  // 검색 폼 제출 핸들러
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // 검색어가 이미 상태에 설정된 상태임
  };
  
  // 검색어 초기화 핸들러
  const handleClearSearch = () => {
    onSearch('');
  };

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
      
      {/* 검색바 */}
      <Box sx={{ width: '90%', maxWidth: 1200, mx: 'auto', display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Paper
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            p: '2px 16px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            borderRadius: '30px',
            boxShadow: '0 2px 8px 0 rgba(85, 110, 223, 0.15)',
            border: '2px solid #005F9A',
            bgcolor: '#fff',
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1, fontSize: 18 }}
            placeholder="사번, 이름 검색"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            inputProps={{ 'aria-label': '검색' }}
          />
          {search && (
            <IconButton
              onClick={handleClearSearch}
              sx={{ p: '10px', color: '#005F9A' }}
              aria-label="clear"
            >
              <ClearIcon />
            </IconButton>
          )}
          <IconButton
            type="submit"
            sx={{ p: '10px', color: '#005F9A' }}
            aria-label="search"
          >
            <SearchIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Paper>
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        alignItems: 'center',
        width: '90%', 
        maxWidth: 1200, 
        mx: 'auto', 
        mb: 5,
        mt: 2
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
                <StyledTableCell>연차 시작일</StyledTableCell>
                <StyledTableCell>연차 종료일</StyledTableCell>
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
                      {highlightText(request.empName || '-', search)}
                    </StyledTableDataCell>
                    <StyledTableDataCell onClick={() => onDetailView(request)}>
                      {formatDate(request.startDate)}
                    </StyledTableDataCell>
                    <StyledTableDataCell onClick={() => onDetailView(request)}>
                      {formatDate(request.endDate)}
                    </StyledTableDataCell>
                    <StyledTableDataCell onClick={() => onDetailView(request)}>
                      {request.days != null ? request.days : '-'}
                    </StyledTableDataCell>
                    <StyledTableDataCell onClick={() => onDetailView(request)}>
                      {request.reason && request.reason.length > 15 
                        ? `${request.reason.substring(0, 15)}...` 
                        : request.reason || '-'}
                    </StyledTableDataCell>
                    <StyledTableDataCell>
                      <RoundChip 
                        label={request.status} 
                        size="small"
                        sx={getStatusColor(request.status)}
                      />
                    </StyledTableDataCell>
                    <StyledTableDataCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                        <RoundButton
                          variant="outlined"
                          size="small"
                          onClick={() => onDetailView(request)}
                          sx={{
                            borderColor: '#55D6DF',
                            color: '#2563A6',
                            px: 1,
                            py: 0.5,
                            fontSize: 12,
                            '&:hover': {
                              borderColor: '#1E5187',
                              backgroundColor: 'rgba(85, 214, 223, 0.1)',
                            },
                          }}
                        >
                          상세보기
                        </RoundButton>
                        
                        {isMaster && (
                          <>
                            {/* 대기중이거나 반려 상태일 때만 승인 버튼 표시 */}
                            {(request.status === '대기중' || request.status === '거절') && (
                              <RoundButton
                                variant="outlined"
                                size="small"
                                onClick={() => onApprove(request.reqId)}
                                sx={{
                                  borderColor: '#10B981',
                                  color: '#10B981',
                                  px: 1,
                                  py: 0.5,
                                  fontSize: 12,
                                  '&:hover': {
                                    borderColor: '#059669',
                                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                  },
                                }}
                              >
                                승인
                              </RoundButton>
                            )}
                            
                            {/* 대기중이거나 승인 상태일 때만 반려 버튼 표시 */}
                            {(request.status === '대기중' || request.status === '승인') && (
                              <RoundButton
                                variant="outlined"
                                size="small"
                                onClick={() => onReject(request.reqId)}
                                sx={{
                                  borderColor: '#EF4444',
                                  color: '#EF4444',
                                  px: 1,
                                  py: 0.5,
                                  fontSize: 12,
                                  '&:hover': {
                                    borderColor: '#DC2626',
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                  },
                                }}
                              >
                                반려
                              </RoundButton>
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
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#1E9FF2', 
          color: '#FFFFFF',
          fontWeight: 700,
          py: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <EventIcon />
          연차 신청 상세 정보
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          {selectedRequest ? (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {/* 기본 정보 섹션 */}
              <Box sx={{ p: 3, backgroundColor: '#F9FAFB' }}>
                <Typography variant="h6" sx={{ 
                  mb: 3,
                  fontWeight: 'bold',
                  color: '#015D70',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  borderBottom: '1px solid rgba(1, 93, 112, 0.1)',
                  pb: 1.5
                }}>
                  <VisibilityIcon fontSize="small" />
                  기본 정보
                </Typography>
                
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2.5,
                  backgroundColor: 'white',
                  borderRadius: 2,
                  border: '1px solid #E2E8F0',
                  p: 3
                }}>
                  {/* 신청번호 */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748B', fontWeight: 600 }}>
                      신청번호
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1E293B' }}>
                      {selectedRequest.reqId}
                    </Typography>
                  </Box>
                  
                  {/* 신청자 */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748B', fontWeight: 600 }}>
                      신청자
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1E293B' }}>
                      {selectedRequest.empName || '-'}
                    </Typography>
                  </Box>
                  
                  {/* 신청일 */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748B', fontWeight: 600 }}>
                      신청일
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#1E293B' }}>
                      {selectedRequest.requestDate ? new Date(selectedRequest.requestDate).toLocaleDateString() : '-'}
                    </Typography>
                  </Box>
                  
                  {/* 연차 사용일 */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748B', fontWeight: 600 }}>
                      연차 사용일
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#1E293B' }}>
                      {selectedRequest.startDate ? new Date(selectedRequest.startDate).toLocaleDateString() : '-'}
                    </Typography>
                  </Box>
                  
                  {/* 일수 */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748B', fontWeight: 600 }}>
                      일수
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#1E293B', fontWeight: 600 }}>
                      {selectedRequest.days}일
                    </Typography>
                  </Box>
                  
                  {/* 처리 상태 */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748B', fontWeight: 600 }}>
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
                        width: 'fit-content',
                        height: '26px'
                      }} 
                    />
                  </Box>
                </Box>
              </Box>
              
              {/* 신청 사유 섹션 */}
              <Box sx={{ p: 3, borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
                <Typography variant="subtitle1" sx={{ 
                  mb: 2,
                  fontWeight: 'bold',
                  color: '#015D70',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <CommentIcon fontSize="small" />
                  신청 사유
                </Typography>
                
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2.5, 
                    bgcolor: 'rgba(1, 93, 112, 0.03)', 
                    borderRadius: 1.5,
                    borderColor: 'rgba(1, 93, 112, 0.08)'
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#1E293B',
                      minHeight: '60px',
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {selectedRequest.reason || '(사유 없음)'}
                  </Typography>
                </Paper>
              </Box>
              
              {/* 승인/반려 코멘트 표시 영역 */}
              {commentLog && commentLog.length > 0 && (
                <Box sx={{ p: 3, borderBottom: '1px solid #E2E8F0' }}>
                  <Typography variant="subtitle1" sx={{ 
                    mb: 2,
                    color: '#015D70',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <CommentIcon fontSize="small" />
                    승인/반려 코멘트
                  </Typography>
                  
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2.5, 
                      bgcolor: 'rgba(30, 172, 181, 0.03)', 
                      borderRadius: 1.5,
                      borderColor: 'rgba(30, 172, 181, 0.1)'
                    }}
                  >
                    {commentLog.map((log, index) => (
                      <Box key={index} sx={{ mb: index < commentLog.length - 1 ? 2.5 : 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          {log.status === 1 ? <CheckCircleOutlineIcon fontSize="small" color="success" /> : 
                           log.status === 2 ? <CancelOutlinedIcon fontSize="small" color="error" /> : 
                           <CommentIcon fontSize="small" color="info" />}
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 
                            log.status === 1 ? '#10B981' : 
                            log.status === 2 ? '#EF4444' : 
                            '#3B82F6'
                          }}>
                            {log.status === 1 ? '승인' : 
                             log.status === 2 ? '반려' : 
                             log.status === 0 ? '코멘트' : '기타'} - {log.approverName || '담당자'}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" sx={{ 
                          mt: 0.5, 
                          color: '#1E293B',
                          ml: 3.5,
                          whiteSpace: 'pre-line'
                        }}>
                          {log.comment || '(코멘트 없음)'}
                        </Typography>
                        
                        <Typography variant="caption" sx={{ 
                          display: 'block', 
                          mt: 1, 
                          color: '#64748B',
                          ml: 3.5 
                        }}>
                          {new Date(log.approvedAt).toLocaleString()}
                        </Typography>
                        
                        {index < commentLog.length - 1 && (
                          <Divider sx={{ my: 2, borderColor: 'rgba(30, 172, 181, 0.2)' }} />
                        )}
                      </Box>
                    ))}
                  </Paper>
                </Box>
              )}
              
              {/* 마스터 권한이 있을 때 코멘트 입력 필드 표시 */}
              <Box sx={{ p: 3, backgroundColor: '#F9FAFB' }}>
                <Typography variant="subtitle1" sx={{ 
                  mb: 2,
                  fontWeight: 'bold',
                  color: '#015D70',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  {selectedRequest.status === '대기중' ? '승인/반려 코멘트' : '코멘트 추가'}
                </Typography>
                
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder={selectedRequest.status === '대기중' ? 
                    "승인 또는 반려 사유를 입력하세요..." : 
                    "코멘트를 입력하세요..."}
                  value={approveComment}
                  onChange={(e) => setApproveComment(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    backgroundColor: '#FFFFFF',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '&:hover fieldset': {
                        borderColor: '#1EACB5',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#015D70',
                      }
                    }
                  }}
                />
                
                {approveError && (
                  <Alert severity="error" sx={{ mt: 2, fontSize: '0.875rem', borderRadius: '8px' }}>
                    {approveError}
                  </Alert>
                )}
              </Box>
            </Box>
          ) : (
            <Typography sx={{ p: 3 }}>선택된 연차 신청 정보가 없습니다.</Typography>
          )}
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 3,
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          bgcolor: '#F9FAFB'
        }}>
          <Button
            variant="outlined"
            onClick={onCloseDetailDialog}
            sx={{
              borderRadius: '8px',
              color: '#64748B',
              borderColor: '#CBD5E1',
              '&:hover': {
                borderColor: '#94A3B8',
                backgroundColor: 'rgba(100, 116, 139, 0.04)'
              }
            }}
          >
            닫기
          </Button>
          
          {selectedRequest && selectedRequest.status === '대기중' ? (
            <>
              <Button
                variant="outlined"
                color="error"
                disabled={isProcessing}
                onClick={() => onReject(selectedRequest.reqId)}
                sx={{ 
                  borderRadius: '8px',
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
                  borderRadius: '8px',
                  bgcolor: '#10B981',
                  '&:hover': { bgcolor: '#059669' }
                }}
              >
                {isProcessing ? <CircularProgress size={24} /> : '승인'}
              </Button>
            </>
          ) : selectedRequest && (
            <>
              {/* 현재 상태가 승인이라면 반려로 변경 가능 */}
              {selectedRequest.status === '승인' && (
                <Button
                  variant="outlined"
                  color="error"
                  disabled={isProcessing}
                  onClick={() => onReject(selectedRequest.reqId)}
                  sx={{ 
                    borderRadius: '8px',
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
                    borderRadius: '8px',
                    bgcolor: '#10B981',
                    '&:hover': { bgcolor: '#059669' }
                  }}
                >
                  {isProcessing ? <CircularProgress size={24} /> : '승인으로 변경'}
                </Button>
              )}
              
              {/* 코멘트 추가 버튼 */}
              <Button
                variant="contained"
                disabled={isProcessing || !approveComment.trim()}
                onClick={() => onAddComment(selectedRequest.reqId)}
                sx={{ 
                  borderRadius: '8px',
                  bgcolor: '#3B82F6',
                  '&:hover': { bgcolor: '#2563EB' }
                }}
              >
                {isProcessing ? <CircularProgress size={24} /> : '코멘트 추가'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnnualLeaveCom; 