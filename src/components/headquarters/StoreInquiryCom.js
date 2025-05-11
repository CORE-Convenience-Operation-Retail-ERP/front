import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Typography, 
  Box, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  ButtonGroup,
  Rating,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Divider,
  Grid,
  Container,
  IconButton,
  Tooltip
} from '@mui/material';
import { alpha } from '@mui/material/styles';

// 날짜 형식화 함수
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// 날짜 시간 형식화 함수
const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// 문의 유형 배지 컴포넌트
const TypeBadge = ({ type }) => {
  let color, label;
  
  switch (type) {
    case 1:
      color = 'error';
      label = '컴플레인';
      break;
    case 2:
      color = 'success';
      label = '칭찬';
      break;
    case 3:
      color = 'primary';
      label = '건의/문의';
      break;
    default:
      color = 'default';
      label = '기타';
  }
  
  return <Chip label={label} color={color} size="small" />;
};

// 상태 배지 컴포넌트
const StatusBadge = ({ status }) => {
  let color, label;
  
  switch (status) {
    case 1:
      color = 'success';
      label = '완료';
      break;
    case 2:
      color = 'warning';
      label = '대기';
      break;
    case 3:
      color = 'error';
      label = '취소/반려';
      break;
    default:
      color = 'default';
      label = '기타';
  }
  
  return <Chip label={label} color={color} size="small" />;
};

const StoreInquiryCom = ({ 
  inquiries = [], 
  loading = false, 
  onStatusChange, 
  onTypeFilter, 
  onStatusFilter,
  onLevelChange,
  storeRankings = [],
  showRankings = false,
  onToggleRankings
}) => {
  const [selectedType, setSelectedType] = React.useState('all');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selectedInquiry, setSelectedInquiry] = React.useState(null);
  const [inquiryLevel, setInquiryLevel] = React.useState(null);
  
  // 대기 상태 게시글 수 계산
  const waitingInquiriesCount = inquiries.filter(inquiry => inquiry.inqStatus === 2).length;
  
  const handleTypeChange = (newType) => {
    setSelectedType(newType);
    onTypeFilter && onTypeFilter(newType === 'all' ? null : parseInt(newType));
  };
  
  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
    onStatusFilter && onStatusFilter(newStatus === 'all' ? null : parseInt(newStatus));
  };
  
  const handleDetailOpen = (inquiry) => {
    setSelectedInquiry(inquiry);
    setInquiryLevel(inquiry.inqLevel || null);
    setDetailOpen(true);
  };
  
  const handleDetailClose = () => {
    setDetailOpen(false);
  };
  
  const handleChangeStatus = (newStatus) => {
    if (onStatusChange && selectedInquiry) {
      onStatusChange(selectedInquiry.inquiryId, newStatus);
    }
    setDetailOpen(false);
  };

  const handleLevelChange = (event) => {
    setInquiryLevel(event.target.value);
  };
  
  const handleSaveLevel = () => {
    if (onLevelChange && selectedInquiry && inquiryLevel !== null) {
      onLevelChange(selectedInquiry.inquiryId, inquiryLevel);
      setDetailOpen(false); // 저장 후 다이얼로그 닫기
    }
  };
  
  // 필터링된 문의 목록
  const filteredInquiries = inquiries.filter(inquiry => {
    const typeMatch = selectedType === 'all' || inquiry.inqType === parseInt(selectedType);
    const statusMatch = selectedStatus === 'all' || inquiry.inqStatus === parseInt(selectedStatus);
    return typeMatch && statusMatch;
  });
  
  return (
    <Container maxWidth="xl">
      <Card sx={{ mb: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: '#333' }}>
              지점 문의 관리
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={onToggleRankings}
              sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                fontWeight: 500
              }}
            >
              {showRankings ? '문의 목록 보기' : '지점 평가 순위'}
            </Button>
          </Box>
          
          {!showRankings && (
            <Grid container spacing={2} sx={{ mb: 3, mt: 1 }}>
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 2,
                  alignItems: { xs: 'flex-start', md: 'center' },
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: alpha('#f5f5f5', 0.5),
                  borderRadius: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, whiteSpace: 'nowrap', color: '#444' }}>
                      문의 유형:
                    </Typography>
                    <ButtonGroup 
                      variant="outlined" 
                      size="small"
                      sx={{ 
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        borderRadius: 1.5,
                        '.MuiButton-root': {
                          borderRadius: 1.5
                        }
                      }}
                    >
                      <Button 
                        color={selectedType === 'all' ? 'primary' : 'inherit'} 
                        variant={selectedType === 'all' ? 'contained' : 'outlined'}
                        onClick={() => handleTypeChange('all')}
                      >
                        전체
                      </Button>
                      <Button 
                        color={selectedType === '1' ? 'error' : 'inherit'} 
                        variant={selectedType === '1' ? 'contained' : 'outlined'}
                        onClick={() => handleTypeChange('1')}
                      >
                        컴플레인
                      </Button>
                      <Button 
                        color={selectedType === '2' ? 'success' : 'inherit'} 
                        variant={selectedType === '2' ? 'contained' : 'outlined'}
                        onClick={() => handleTypeChange('2')}
                      >
                        칭찬
                      </Button>
                      <Button 
                        color={selectedType === '3' ? 'primary' : 'inherit'} 
                        variant={selectedType === '3' ? 'contained' : 'outlined'}
                        onClick={() => handleTypeChange('3')}
                      >
                        건의/문의
                      </Button>
                    </ButtonGroup>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, whiteSpace: 'nowrap', color: '#444' }}>
                      처리 상태:
                    </Typography>
                    <ButtonGroup 
                      variant="outlined"
                      size="small"
                      sx={{ 
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        borderRadius: 1.5,
                        '.MuiButton-root': {
                          borderRadius: 1.5
                        }
                      }}
                    >
                      <Button 
                        color={selectedStatus === 'all' ? 'primary' : 'inherit'} 
                        variant={selectedStatus === 'all' ? 'contained' : 'outlined'}
                        onClick={() => handleStatusChange('all')}
                      >
                        전체
                      </Button>
                      <Button 
                        color={selectedStatus === '1' ? 'success' : 'inherit'} 
                        variant={selectedStatus === '1' ? 'contained' : 'outlined'}
                        onClick={() => handleStatusChange('1')}
                      >
                        완료
                      </Button>
                      <Badge badgeContent={waitingInquiriesCount} color="warning" sx={{ '& .MuiBadge-badge': { top: 5, right: 5 } }}>
                        <Button 
                          color={selectedStatus === '2' ? 'warning' : 'inherit'} 
                          variant={selectedStatus === '2' ? 'contained' : 'outlined'}
                          onClick={() => handleStatusChange('2')}
                        >
                          대기
                        </Button>
                      </Badge>
                      <Button 
                        color={selectedStatus === '3' ? 'error' : 'inherit'} 
                        variant={selectedStatus === '3' ? 'contained' : 'outlined'}
                        onClick={() => handleStatusChange('3')}
                      >
                        취소/반려
                      </Button>
                    </ButtonGroup>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
      
      {showRankings ? (
        // 지점 평가 순위 테이블
        <Card sx={{ boxShadow: '0 2px 10px rgba(0,0,0,0.08)', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
              지점 평가 순위
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #eee' }}>
              <Table>
                <TableHead sx={{ backgroundColor: alpha('#3f51b5', 0.08) }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>순위</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>지점명</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>컴플레인 건수</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>컴플레인 점수</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>칭찬 건수</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>칭찬 점수</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>종합 점수</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {storeRankings.length > 0 ? (
                    storeRankings.map((store, index) => (
                      <TableRow key={index} sx={{ 
                        backgroundColor: index === 0 ? alpha('#ffd700', 0.1) : index === 1 ? alpha('#c0c0c0', 0.1) : index === 2 ? alpha('#cd7f32', 0.1) : 'white',
                        '&:hover': {
                          backgroundColor: index === 0 ? alpha('#ffd700', 0.2) : index === 1 ? alpha('#c0c0c0', 0.2) : index === 2 ? alpha('#cd7f32', 0.2) : alpha('#f5f5f5', 0.5)
                        }
                      }}>
                        <TableCell>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : alpha('#f5f5f5', 0.8),
                            color: index < 3 ? '#000' : '#666'
                          }}>
                            {store.rank}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: index < 3 ? 600 : 400 }}>{store.storeName}</TableCell>
                        <TableCell>{store.complaintCount}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Rating value={Math.min(5, store.complaintScore / store.complaintCount || 0)} readOnly max={5} size="small" />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              ({store.complaintScore})
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{store.praiseCount}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Rating value={Math.min(5, store.praiseScore / store.praiseCount || 0)} readOnly max={5} size="small" />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              ({store.praiseScore})
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            color: store.totalScore >= 0 ? 'green' : 'red',
                            fontWeight: 'bold',
                            fontSize: '1.1rem'
                          }}
                        >
                          {store.totalScore.toFixed(1)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        평가 데이터가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, p: 2, bgcolor: alpha('#f5f5f5', 0.5), borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>평가 지표 설명</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>컴플레인 점수</strong>: 컴플레인 심각도 평균 (1: 경미 ~ 5: 매우 심각)
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>칭찬 점수</strong>: 칭찬 수준 평균 (1: 기본 ~ 5: 최고 수준)
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>종합 점수</strong>: 칭찬 총점 - (컴플레인 총점 × 2) (컴플레인은 가중치 부여)
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1, color: '#3f51b5', fontWeight: 500 }}>
                ※ 상위 3개 지점에는 인센티브 지급 대상이 됩니다.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        // 문의 목록
        <>
          {loading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography>데이터를 불러오는 중입니다...</Typography>
            </Box>
          ) : (
            <Card sx={{ boxShadow: '0 2px 10px rgba(0,0,0,0.08)', borderRadius: 2 }}>
              <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #eee' }}>
                <Table>
                  <TableHead sx={{ backgroundColor: alpha('#3f51b5', 0.08) }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>번호</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>지점명</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>유형</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>내용</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>문의일자</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>상태</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>평가등급</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>액션</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredInquiries.length > 0 ? (
                      filteredInquiries.map(inquiry => (
                        <TableRow 
                          key={inquiry.inquiryId} 
                          hover
                          sx={{
                            '&:hover': {
                              backgroundColor: alpha('#f5f5f5', 0.5)
                            }
                          }}
                        >
                          <TableCell>{inquiry.inquiryId}</TableCell>
                          <TableCell>{inquiry.storeName}</TableCell>
                          <TableCell>
                            <TypeBadge type={inquiry.inqType} />
                          </TableCell>
                          <TableCell sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {inquiry.inqContent}
                          </TableCell>
                          <TableCell>
                            {formatDate(inquiry.inqCreatedAt)}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={inquiry.inqStatus} />
                          </TableCell>
                          <TableCell>
                            {inquiry.inqLevel ? 
                              <Rating value={inquiry.inqLevel} readOnly max={5} size="small" /> : 
                              <Typography variant="body2" color="text.secondary">미평가</Typography>
                            }
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outlined" 
                              size="small"
                              onClick={() => handleDetailOpen(inquiry)}
                              sx={{ 
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 500,
                                fontSize: '0.875rem'
                              }}
                            >
                              상세보기
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          문의 내역이 없거나 필터 조건에 맞는 문의가 없습니다.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          )}
        </>
      )}
      
      {/* 상세 보기 다이얼로그 */}
      <Dialog 
        open={detailOpen} 
        onClose={handleDetailClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
          }
        }}
      >
        {selectedInquiry && (
          <>
            <DialogTitle sx={{ 
              bgcolor: alpha(selectedInquiry.inqType === 1 ? '#f44336' : 
                             selectedInquiry.inqType === 2 ? '#4caf50' : '#2196f3', 0.1),
              py: 2
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {selectedInquiry.storeName} - 문의 상세
                </Typography>
                <TypeBadge type={selectedInquiry.inqType} />
              </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      문의 번호: {selectedInquiry.inquiryId}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      문의 일자: {formatDateTime(selectedInquiry.inqCreatedAt)}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      연락처: {selectedInquiry.inqPhone}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mr: 1 }}>
                      현재 상태:
                    </Typography>
                    <StatusBadge status={selectedInquiry.inqStatus} />
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ mb: 2, mt: 1 }} />
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    문의 내용
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, backgroundColor: alpha('#f5f5f5', 0.5), borderRadius: 2 }}>
                    <Typography sx={{ whiteSpace: 'pre-line' }}>{selectedInquiry.inqContent}</Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ mb: 2, mt: 1 }} />
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>지점 평가</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FormControl sx={{ minWidth: 200, mr: 2 }}>
                      <InputLabel id="level-select-label">평가 등급</InputLabel>
                      <Select
                        labelId="level-select-label"
                        value={inquiryLevel || ''}
                        onChange={handleLevelChange}
                        label="평가 등급"
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="">
                          <em>미평가</em>
                        </MenuItem>
                        <MenuItem value={1}>1 - {selectedInquiry.inqType === 1 ? '경미한 컴플레인' : '기본 칭찬'}</MenuItem>
                        <MenuItem value={2}>2 - {selectedInquiry.inqType === 1 ? '약간 심각' : '좋은 칭찬'}</MenuItem>
                        <MenuItem value={3}>3 - {selectedInquiry.inqType === 1 ? '중간 수준' : '높은 칭찬'}</MenuItem>
                        <MenuItem value={4}>4 - {selectedInquiry.inqType === 1 ? '심각' : '매우 높은 칭찬'}</MenuItem>
                        <MenuItem value={5}>5 - {selectedInquiry.inqType === 1 ? '매우 심각' : '최고 수준의 칭찬'}</MenuItem>
                      </Select>
                    </FormControl>
                    <Button 
                      variant="contained" 
                      onClick={handleSaveLevel}
                      disabled={inquiryLevel === null}
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    >
                      평가 저장
                    </Button>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    p: 1, 
                    bgcolor: alpha('#f5f5f5', 0.5), 
                    borderRadius: 1,
                    fontStyle: 'italic'
                  }}>
                    {selectedInquiry.inqType === 1 
                      ? '* 컴플레인 평가: 1(경미)~5(매우 심각)' 
                      : '* 칭찬 평가: 1(기본)~5(최고 수준)'}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'space-between', bgcolor: alpha('#f5f5f5', 0.3) }}>
              <Box>
                <Button 
                  variant="contained" 
                  color="success" 
                  sx={{ 
                    mr: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                  onClick={() => handleChangeStatus(1)}
                >
                  완료 처리
                </Button>
                <Button 
                  variant="contained" 
                  color="warning"
                  sx={{ 
                    mr: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                  onClick={() => handleChangeStatus(2)}
                >
                  대기 상태
                </Button>
                <Button 
                  variant="contained" 
                  color="error"
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                  onClick={() => handleChangeStatus(3)}
                >
                  취소/반려
                </Button>
              </Box>
              <Button 
                onClick={handleDetailClose}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                닫기
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default StoreInquiryCom;