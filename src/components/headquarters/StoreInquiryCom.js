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
  Tooltip,
  ThemeProvider,
  createTheme,
  Pagination,
  LinearProgress
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import WarningIcon from '@mui/icons-material/Warning';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ErrorIcon from '@mui/icons-material/Error';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

// Pretendard 폰트를 사용하는 MUI 테마 생성
const theme = createTheme({
  typography: {
    fontFamily: [
      'Pretendard',
      '-apple-system',
      'BlinkMacSystemFont',
      'system-ui',
      'Roboto',
      '"Helvetica Neue"',
      '"Segoe UI"',
      '"Apple SD Gothic Neo"',
      '"Noto Sans KR"',
      '"Malgun Gothic"',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: 'Pretendard, sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
        head: {
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

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
  let label;
  
  switch (type) {
    case 1:
      label = '컴플레인';
      break;
    case 2:
      label = '칭찬';
      break;
    case 3:
      label = '건의/문의';
      break;
    default:
      label = '기타';
  }
  
  return (
    <Chip 
      label={label} 
      size="small" 
      sx={{ 
        bgcolor: 'rgba(0, 0, 0, 0.08)',
        color: 'text.primary',
        width: '80px', // 너비 고정
        fontWeight: 500
      }}
    />
  );
};

// 상태 배지 컴포넌트
const StatusBadge = ({ status }) => {
  let label, bgColor;
  
  switch (status) {
    case 1:
      label = '완료';
      bgColor = 'rgba(46, 125, 50, 0.1)'; // 연한 녹색 배경
      break;
    case 2:
      label = '대기';
      bgColor = 'rgba(237, 108, 2, 0.1)'; // 연한 주황색 배경
      break;
    case 3:
      label = '취소/반려';
      bgColor = 'rgba(211, 47, 47, 0.1)'; // 연한 빨간색 배경
      break;
    default:
      label = '기타';
      bgColor = 'rgba(0, 0, 0, 0.08)'; // 기본 회색 배경
  }
  
  return (
    <Chip 
      label={label} 
      size="small" 
      sx={{ 
        bgcolor: bgColor,
        color: 'text.primary',
        width: '80px', // 너비 고정
        fontWeight: 500
      }}
    />
  );
};

// 컴플레인 평가 표시 컴포넌트
const ComplaintLevelIndicator = ({ value }) => {
  if (!value) return <Typography variant="body2" color="text.secondary">미평가</Typography>;
  
  // 바 형태로 변경
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        display: 'flex', 
        width: '70px',
        height: '8px',
        bgcolor: 'rgba(0,0,0,0.08)',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          width: `${value * 20}%`, 
          height: '100%', 
          bgcolor: value <= 2 ? 'warning.light' : value <= 4 ? 'warning.main' : 'error.main',
        }} />
      </Box>
      <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary', fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  );
};

// 칭찬 평가 표시 컴포넌트
const PraiseLevelIndicator = ({ value }) => {
  if (!value) return <Typography variant="body2" color="text.secondary">미평가</Typography>;
  
  // 바 형태로 변경 (밝은 그린 컬러)
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        display: 'flex', 
        width: '70px',
        height: '8px',
        bgcolor: 'rgba(0,0,0,0.08)',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          width: `${value * 20}%`, 
          height: '100%', 
          bgcolor: value <= 2 ? '#81c784' : value <= 4 ? '#66bb6a' : '#4caf50', // 밝은 그린 컬러
        }} />
      </Box>
      <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary', fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  );
};

// 문의 평가 컴포넌트 (조건부 렌더링)
const InquiryLevelIndicator = ({ inquiry }) => {
  if (!inquiry.inqLevel) {
    return <Typography variant="body2" color="text.secondary">미평가</Typography>;
  }
  
  if (inquiry.inqType === 1) { // 컴플레인
    return <ComplaintLevelIndicator value={inquiry.inqLevel} />;
  } else if (inquiry.inqType === 2) { // 칭찬
    return <PraiseLevelIndicator value={inquiry.inqLevel} />;
  } else {
    return <Typography variant="body2" color="text.secondary">-</Typography>;
  }
};

const StoreInquiryCom = ({ 
  inquiries = [], 
  loading = false, 
  onStatusChange, 
  onTypeFilter, 
  onStatusFilter,
  onLevelChange,
  onInquiryComplete,
  storeRankings = [],
  showRankings = false,
  onToggleRankings,
  page = 0,
  totalPages = 0,
  onPageChange,
  statusCounts = { waiting: 0, completed: 0, canceled: 0 }
}) => {
  const [selectedType, setSelectedType] = React.useState('all');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selectedInquiry, setSelectedInquiry] = React.useState(null);
  const [inquiryLevel, setInquiryLevel] = React.useState(null);
  
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
    setInquiryLevel(null);
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
  
  const handleSelectLevel = (level) => {
    setInquiryLevel(level);
  };
  
  const handleSaveLevel = () => {
    if (onLevelChange && selectedInquiry && inquiryLevel !== null) {
      onLevelChange(selectedInquiry.inquiryId, inquiryLevel);
      // 평가 저장 시 자동으로 완료 상태로 변경
      if (onStatusChange) {
        onStatusChange(selectedInquiry.inquiryId, 1); // 1: 완료 상태
      }
      setDetailOpen(false); // 저장 후 다이얼로그 닫기
    }
  };
  
  // 취소/반려 처리 함수 추가
  const handleCancelInquiry = () => {
    if (onStatusChange && selectedInquiry) {
      onStatusChange(selectedInquiry.inquiryId, 3); // 3: 취소/반려 상태
      setDetailOpen(false);
    }
  };
  
  // 건의/문의 완료 처리 함수 수정
  const handleInquiryComplete = () => {
    if (onInquiryComplete && selectedInquiry) {
      onInquiryComplete(selectedInquiry.inquiryId);
      setDetailOpen(false); // 완료 처리 후 모달 닫기
    }
  };
  
  // 필터링된 문의 목록
  const filteredInquiries = inquiries.filter(inquiry => {
    const typeMatch = selectedType === 'all' || inquiry.inqType === parseInt(selectedType);
    const statusMatch = selectedStatus === 'all' || inquiry.inqStatus === parseInt(selectedStatus);
    return typeMatch && statusMatch;
  });
  
  return (
    <ThemeProvider theme={theme}>
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
                          borderRadius: 1.5,
                          minWidth: '80px',
                          px: 2
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
                        color="inherit" 
                        variant={selectedType === '1' ? 'contained' : 'outlined'}
                        onClick={() => handleTypeChange('1')}
                        sx={{ 
                          bgcolor: selectedType === '1' ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                          color: 'text.primary',
                          borderColor: 'rgba(0, 0, 0, 0.23)'
                        }}
                      >
                        컴플레인
                      </Button>
                      <Button 
                        color="inherit"
                        variant={selectedType === '2' ? 'contained' : 'outlined'}
                        onClick={() => handleTypeChange('2')}
                        sx={{ 
                          bgcolor: selectedType === '2' ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                          color: 'text.primary',
                          borderColor: 'rgba(0, 0, 0, 0.23)'
                        }}
                      >
                        칭찬
                      </Button>
                      <Button 
                        color="inherit"
                        variant={selectedType === '3' ? 'contained' : 'outlined'}
                        onClick={() => handleTypeChange('3')}
                        sx={{ 
                          bgcolor: selectedType === '3' ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                          color: 'text.primary',
                          borderColor: 'rgba(0, 0, 0, 0.23)'
                        }}
                      >
                        건의/문의
                      </Button>
                    </ButtonGroup>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: { xs: 2, md: 0 } }}>
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
                          borderRadius: 1.5,
                          minWidth: '80px',
                          px: 2
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
                        color="inherit"
                        variant={selectedStatus === '1' ? 'contained' : 'outlined'}
                        onClick={() => handleStatusChange('1')}
                        sx={{ 
                          bgcolor: selectedStatus === '1' ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                          color: 'text.primary',
                          borderColor: 'rgba(0, 0, 0, 0.23)'
                        }}
                      >
                        완료
                      </Button>
                      <Badge badgeContent={statusCounts.waiting} color="warning" sx={{ '& .MuiBadge-badge': { top: 5, right: 5 } }}>
                        <Button 
                          color="inherit"
                          variant={selectedStatus === '2' ? 'contained' : 'outlined'}
                          onClick={() => handleStatusChange('2')}
                          sx={{ 
                            bgcolor: selectedStatus === '2' ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                            color: 'text.primary',
                            borderColor: 'rgba(0, 0, 0, 0.23)'
                          }}
                        >
                          대기
                        </Button>
                      </Badge>
                      <Button 
                        color="inherit"
                        variant={selectedStatus === '3' ? 'contained' : 'outlined'}
                        onClick={() => handleStatusChange('3')}
                        sx={{ 
                          bgcolor: selectedStatus === '3' ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                          color: 'text.primary',
                          borderColor: 'rgba(0, 0, 0, 0.23)'
                        }}
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
                    <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>순위</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>지점명</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>컴플레인 건수</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>컴플레인 점수</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>칭찬 건수</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>칭찬 점수</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>종합 점수</TableCell>
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
                        <TableCell sx={{ textAlign: 'center' }}>
                          {index < 3 ? (
                            <Box sx={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                              background: index === 0 ? 'linear-gradient(135deg, #ffd700 30%, #ffec80 90%)' : 
                                         index === 1 ? 'linear-gradient(135deg, #c0c0c0 30%, #e0e0e0 90%)' : 
                                         'linear-gradient(135deg, #cd7f32 30%, #e0a872 90%)',
                              color: index === 0 ? '#7a5c00' : index === 1 ? '#555' : '#5d3200'
                            }}>
                              {store.rank}
                            </Box>
                          ) : (
                            <Typography sx={{ fontWeight: 500, color: '#666' }}>{store.rank}</Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ fontWeight: index < 3 ? 600 : 400, textAlign: 'center' }}>{store.storeName}</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>{store.complaintCount}</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {store.complaintCount > 0 ? (
                              <>
                                <Box sx={{ 
                                  display: 'flex', 
                                  width: '60px',
                                  height: '8px',
                                  bgcolor: 'rgba(0,0,0,0.08)',
                                  borderRadius: '4px',
                                  overflow: 'hidden'
                                }}>
                                  <Box sx={{ 
                                    width: `${Math.min(100, (store.complaintScore / store.complaintCount / 5) * 100)}%`, 
                                    height: '100%', 
                                    bgcolor: (store.complaintScore / store.complaintCount) <= 2 ? 
                                      'warning.light' : 
                                      (store.complaintScore / store.complaintCount) <= 4 ? 
                                        'warning.main' : 
                                        'error.main',
                                  }} />
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                  ({(store.complaintScore / store.complaintCount).toFixed(1)})
                                </Typography>
                              </>
                            ) : (
                              <Typography variant="body2" color="text.secondary">-</Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>{store.praiseCount}</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {store.praiseCount > 0 ? (
                              <>
                                <Box sx={{ 
                                  display: 'flex', 
                                  width: '60px',
                                  height: '8px',
                                  bgcolor: 'rgba(0,0,0,0.08)',
                                  borderRadius: '4px',
                                  overflow: 'hidden'
                                }}>
                                  <Box sx={{ 
                                    width: `${Math.min(100, (store.praiseScore / store.praiseCount / 5) * 100)}%`, 
                                    height: '100%', 
                                    bgcolor: (store.praiseScore / store.praiseCount) <= 2 ? 
                                      '#81c784' : 
                                      (store.praiseScore / store.praiseCount) <= 4 ? 
                                        '#66bb6a' : 
                                        '#4caf50',
                                  }} />
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                  ({(store.praiseScore / store.praiseCount).toFixed(1)})
                                </Typography>
                              </>
                            ) : (
                              <Typography variant="body2" color="text.secondary">-</Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            color: (100 + store.totalScore) >= 100 ? 'green' : (100 + store.totalScore) < 80 ? 'red' : '#f57c00',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            textAlign: 'center'
                          }}
                        >
                          {(100 + store.totalScore).toFixed(1)}
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
                • <strong>기본 점수</strong>: 모든 지점은 기본 점수 100점에서 시작합니다.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>컴플레인 점수</strong>: 컴플레인 심각도 평균 (1: 경미 ~ 5: 매우 심각) × 건수 × 가중치(1.5) 만큼 감점
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>칭찬 점수</strong>: 칭찬 수준 평균 (1: 기본 ~ 5: 최고 수준) × 건수 만큼 가점
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • <strong>종합 점수</strong>: 기본 점수(100) + 칭찬 총점 - 컴플레인 감점
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                ※ 건의/문의 유형은 평가 점수에 반영되지 않습니다.
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
                              <InquiryLevelIndicator inquiry={inquiry} /> : 
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
                                fontSize: '0.875rem',
                                width: '100px', // 너비 고정
                                bgcolor: 'rgba(0, 0, 0, 0.02)'
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
              
              {/* 페이지네이션 컴포넌트 */}
              {inquiries.length > 0 && totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
                  <Pagination 
                    count={totalPages} 
                    page={page + 1} 
                    onChange={(e, p) => onPageChange(e, p - 1)}
                    color="primary"
                    showFirstButton
                    showLastButton
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontWeight: 500,
                        fontSize: '0.9rem',
                      }
                    }}
                  />
                </Box>
              )}
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
              py: 2,
              textAlign: 'center'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {selectedInquiry.storeName} - 문의 상세
                </Typography>
                <TypeBadge type={selectedInquiry.inqType} />
              </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 3 }}>
              <Grid container spacing={2} justifyContent="center">
                {/* 문의 정보 영역 - 2줄로 압축 */}
                <Grid item xs={12} sx={{ mb: 2 }}>
                  <Box sx={{ textAlign: 'center', mb: 1 }}>
                    <Typography variant="body1" display="inline" sx={{ mr: 1 }}>
                      <strong>문의 번호:</strong> {selectedInquiry.inquiryId}
                    </Typography>
                    <Typography variant="body1" display="inline" sx={{ mr: 1 }}>
                      <strong>유형:</strong> <TypeBadge type={selectedInquiry.inqType} />
                    </Typography>
                    <Typography variant="body1" display="inline" sx={{ mr: 1 }}>
                      <strong>상태:</strong> <StatusBadge status={selectedInquiry.inqStatus} />
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body1" display="inline" sx={{ mr: 1 }}>
                      <strong>연락처:</strong> {selectedInquiry.inqPhone}
                    </Typography>
                    <Typography variant="body1" display="inline">
                      <strong>문의일:</strong> {formatDateTime(selectedInquiry.inqCreatedAt)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                
                {/* 문의 내용 영역 */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, textAlign: 'center' }}>
                    문의 내용
                  </Typography>
                  <Paper variant="outlined" sx={{ 
                    p: 2, 
                    backgroundColor: alpha('#f5f5f5', 0.5), 
                    borderRadius: 2,
                    minHeight: '100px',
                    mb: 3
                  }}>
                    <Typography sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>{selectedInquiry.inqContent}</Typography>
                  </Paper>
                </Grid>
                
                {/* 평가 영역 */}
                <Grid item xs={12}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, textAlign: 'center' }}>
                    {selectedInquiry.inqType === 3 ? '문의 처리' : '지점 평가'}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 2,
                    gap: 2
                  }}>
                    {selectedInquiry.inqType !== 3 ? (
                      // 칭찬이나 컴플레인인 경우 - 평가 UI
                      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                          {selectedInquiry.inqType === 1 ? '컴플레인 심각도 평가' : '칭찬 수준 평가'}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1, mb: 3, width: '100%' }}>
                          {selectedInquiry.inqType === 1 ? (
                            // 컴플레인 평가 버튼 그룹
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 300 }}>
                              <Box sx={{ display: 'flex', width: '100%', mb: 1, justifyContent: 'space-between' }}>
                                <Typography variant="caption" sx={{ flex: 1, textAlign: 'left' }}>경미</Typography>
                                <Typography variant="caption" sx={{ flex: 1, textAlign: 'center' }}>중간</Typography>
                                <Typography variant="caption" sx={{ flex: 1, textAlign: 'right' }}>매우 심각</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', width: '100%', p: 1, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 2 }}>
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <Button
                                    key={level}
                                    variant="contained"
                                    onClick={() => handleSelectLevel(level)}
                                    sx={{ 
                                      flex: 1,
                                      mx: 0.5,
                                      height: '36px',
                                      minWidth: '36px',
                                      p: 0,
                                      bgcolor: level <= inquiryLevel ? 
                                        (level <= 2 ? 'warning.light' : level <= 4 ? 'warning.main' : 'error.main') : 
                                        'rgba(0,0,0,0.08)',
                                      color: level <= inquiryLevel ? 'white' : 'text.secondary',
                                      '&:hover': {
                                        bgcolor: level <= 2 ? 'warning.light' : level <= 4 ? 'warning.main' : 'error.main',
                                        opacity: 0.9
                                      }
                                    }}
                                  >
                                    {level}
                                  </Button>
                                ))}
                              </Box>
                              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="body2" sx={{ 
                                  color: inquiryLevel ? 
                                    (inquiryLevel <= 2 ? 'warning.dark' : inquiryLevel <= 4 ? 'warning.dark' : 'error.dark') : 
                                    'text.secondary',
                                  fontWeight: inquiryLevel ? 500 : 400,
                                  fontSize: '0.8rem'
                                }}>
                                  {inquiryLevel ? (
                                    inquiryLevel === 1 ? '1 - 경미한 컴플레인' :
                                    inquiryLevel === 2 ? '2 - 약간 심각' :
                                    inquiryLevel === 3 ? '3 - 중간 수준' :
                                    inquiryLevel === 4 ? '4 - 심각' :
                                    '5 - 매우 심각'
                                  ) : '평가를 선택해주세요'}
                                </Typography>
                              </Box>
                            </Box>
                          ) : (
                            // 칭찬 평가 UI
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 300 }}>
                              <Box sx={{ display: 'flex', width: '100%', mb: 1, justifyContent: 'space-between' }}>
                                <Typography variant="caption" sx={{ flex: 1, textAlign: 'left' }}>기본</Typography>
                                <Typography variant="caption" sx={{ flex: 1, textAlign: 'center' }}>좋음</Typography>
                                <Typography variant="caption" sx={{ flex: 1, textAlign: 'right' }}>최고</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', width: '100%', p: 1, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 2 }}>
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <Button
                                    key={level}
                                    variant="contained"
                                    onClick={() => handleSelectLevel(level)}
                                    sx={{ 
                                      flex: 1,
                                      mx: 0.5,
                                      height: '36px',
                                      minWidth: '36px',
                                      p: 0,
                                      bgcolor: level <= inquiryLevel ? 
                                        (level <= 2 ? '#81c784' : level <= 4 ? '#66bb6a' : '#4caf50') : 
                                        'rgba(0,0,0,0.08)',
                                      color: level <= inquiryLevel ? 'white' : 'text.secondary',
                                      '&:hover': {
                                        bgcolor: level <= 2 ? '#81c784' : level <= 4 ? '#66bb6a' : '#4caf50',
                                        opacity: 0.9
                                      }
                                    }}
                                  >
                                    {level}
                                  </Button>
                                ))}
                              </Box>
                              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="body2" sx={{ 
                                  color: inquiryLevel ? 'success.dark' : 'text.secondary',
                                  fontWeight: inquiryLevel ? 500 : 400,
                                  fontSize: '0.8rem'
                                }}>
                                  {inquiryLevel ? (
                                    inquiryLevel === 1 ? '1 - 기본 칭찬' :
                                    inquiryLevel === 2 ? '2 - 좋은 칭찬' :
                                    inquiryLevel === 3 ? '3 - 높은 칭찬' :
                                    inquiryLevel === 4 ? '4 - 매우 높은 칭찬' :
                                    '5 - 최고 수준의 칭찬'
                                  ) : '평가를 선택해주세요'}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    ) : (
                      // 건의/문의인 경우 - 평가 없이 처리만 가능한 안내 메시지
                      <Box sx={{ textAlign: 'center', my: 2, p: 2, bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 2, width: '100%', maxWidth: 500 }}>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          건의/문의 사항은 평가 등급이 부여되지 않습니다.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          문의 내용에 대해 적절히 응대한 후 아래 버튼으로 처리 상태를 변경해주세요.
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'center', mt: 3 }}>
                      {selectedInquiry.inqType !== 3 ? (
                        // 칭찬이나 컴플레인인 경우 - 평가 및 완료처리 버튼
                        <Button 
                          variant="contained" 
                          color="primary"
                          onClick={handleSaveLevel}
                          disabled={inquiryLevel === null}
                          sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            bgcolor: selectedInquiry.inqType === 1 ? 'rgba(255, 141, 100, 0.65)' : 'rgba(17, 148, 23, 0.65)',
                            '&:hover': {
                              bgcolor: selectedInquiry.inqType === 1 ? 'rgba(255, 114, 63, 0.95)' : 'rgba(17, 148, 23, 0.95)',
                            },
                            minWidth: 140
                          }}
                        >
                          평가 및 완료
                        </Button>
                      ) : (
                        // 건의/문의인 경우 - 완료처리 버튼
                        <Button 
                          variant="contained" 
                          color="primary"
                          onClick={handleInquiryComplete}
                          sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            bgcolor: 'rgba(35, 122, 192, 0.65)',
                            '&:hover': {
                              bgcolor: 'rgba(35, 122, 192, 0.95)',
                            },
                            minWidth: 140
                          }}
                        >
                          완료처리
                        </Button>
                      )}
                      <Button 
                        variant="contained" 
                        color="error"
                        onClick={handleCancelInquiry}
                        sx={{ 
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500,
                          minWidth: 120,
                          bgcolor: 'rgba(255, 49, 49, 0.65)',
                          '&:hover': {
                            bgcolor: 'rgba(234, 35, 35, 0.95)',
                          }
                        }}
                      >
                        취소/반려
                      </Button>
                    </Box>
                  </Box>
                  {selectedInquiry.inqType !== 3 && (
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      fontStyle: 'italic', 
                      textAlign: 'center' 
                    }}>
                      {selectedInquiry.inqType === 1 
                        ? '* 컴플레인 평가: 1(경미)~5(매우 심각) - 평가 후 자동으로 완료 처리됩니다.' 
                        : '* 칭찬 평가: 1(기본)~5(최고 수준) - 평가 후 자동으로 완료 처리됩니다.'}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'center', bgcolor: alpha('#f5f5f5', 0.3) }}>
              <Button 
                onClick={handleDetailClose}
                variant="outlined"
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  minWidth: 100
                }}
              >
                닫기
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
    </ThemeProvider>
  );
};

export default StoreInquiryCom;
