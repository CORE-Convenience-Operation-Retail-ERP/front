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
  LinearProgress,
  InputBase,
  CircularProgress
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import WarningIcon from '@mui/icons-material/Warning';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ErrorIcon from '@mui/icons-material/Error';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from '@mui/system';

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

// 상태 칩 스타일(AnnualLeaveCom 참고)
const StatusChip = styled(Chip)(({ status }) => {
  let color, bgcolor, borderColor;
  if (status === '완료' || status === '승인') {
    color = '#10B981'; bgcolor = '#ECFDF5'; borderColor = '#A7F3D0';
  } else if (status === '취소/반려' || status === '거절') {
    color = '#EF4444'; bgcolor = '#FEF2F2'; borderColor = '#FECACA';
  } else if (status === '대기' || status === '대기중') {
    color = '#F59E0B'; bgcolor = '#FFFBEB'; borderColor = '#FDE68A';
  } else {
    color = '#64748B'; bgcolor = '#F8FAFC'; borderColor = '#E2E8F0';
  }
  return {
    color,
    backgroundColor: bgcolor,
    border: `1.5px solid ${borderColor}`,
    borderRadius: '30px',
    fontWeight: 700,
    fontSize: '0.75rem',
    minWidth: 80,
    justifyContent: 'center',
    height: 28,
  };
});

// 테이블 헤더/데이터 셀 스타일
const StyledTableCell = styled(TableCell)({
  fontWeight: 'bold',
  backgroundColor: '#fff',
  color: '#2563A6',
  fontSize: '16px',
  border: 'none',
  borderBottom: '1px solid #F5F5F5',
  borderRight: '1px solid #F5F5F5',
  textAlign: 'center',
  paddingTop: 16,
  paddingBottom: 16,
});
const StyledTableDataCell = styled(TableCell)({
  border: 'none',
  borderBottom: '1px solid #F5F5F5',
  borderRight: '1px solid #F5F5F5',
  fontSize: '0.875rem',
  color: '#475569',
  verticalAlign: 'middle',
  textAlign: 'center',
  paddingTop: 12,
  paddingBottom: 12,
});

// 둥근 버튼 스타일
const RoundButton = styled(Button)({
  borderRadius: '30px',
  backgroundColor: '#2563A6',
  color: '#fff',
  fontWeight: 700,
  fontSize: '1rem',
  height: 40,
  padding: '0 24px',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#1E5187',
    color: '#fff',
    boxShadow: 'none',
  },
  textTransform: 'none',
});

// 둥근 선택 버튼 스타일(더 작게)
const RoundSelectButton = styled(Button)(({ selected }) => ({
  borderRadius: '30px',
  fontWeight: 700,
  border: '1.5px solid #2563A6',
  color: selected ? '#fff' : '#2563A6',
  backgroundColor: selected ? '#2563A6' : '#fff',
  minWidth: 64,
  px: 1.5,
  py: 0.3,
  fontSize: 14,
  boxShadow: 'none',
  marginRight: 6,
  height: 32,
  '&:hover': {
    backgroundColor: selected ? '#1E5187' : '#F0F5FF',
    color: '#2563A6',
    boxShadow: 'none',
  },
  textTransform: 'none',
}));

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
  const [search, setSearch] = React.useState('');
  
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
  
  // 검색 핸들러 (검색어 입력 시)
  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleSearchSubmit = (e) => { e.preventDefault(); };
  const handleClearSearch = () => setSearch('');
  
  // 필터링된 문의 목록
  const filteredInquiries = inquiries.filter(inquiry => {
    const typeMatch = selectedType === 'all' || inquiry.inqType === parseInt(selectedType);
    const statusMatch = selectedStatus === 'all' || inquiry.inqStatus === parseInt(selectedStatus);
    const searchMatch = !search ||
      inquiry.storeName?.toLowerCase().includes(search.toLowerCase()) ||
      inquiry.inqContent?.toLowerCase().includes(search.toLowerCase()) ||
      String(inquiry.inquiryId).includes(search);
    return typeMatch && statusMatch && searchMatch;
  });
  
  return (
    <ThemeProvider theme={theme}>
      <Box>
        {/* 헤더 */}
        <Box sx={{ width: '90%', maxWidth: 2200, mx: 'auto', mt: 4, mb: 7 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Typography sx={{
              fontWeight: 'bold',
              fontSize: 30,
              color: '#2563A6',
              letterSpacing: '-1px',
              ml: 15
            }}>
              지점 문의 관리
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
              placeholder="지점명, 문의내용, 번호 검색"
              value={search}
              onChange={handleSearchChange}
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

        {/* 검색바 아래 버튼/필터/지점 평가 순위 버튼 한 줄 배치 */}
        <Box sx={{ width: '90%', maxWidth: 1200, mx: 'auto', display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'space-between' }}>
          {/* 왼쪽: 필터/버튼 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: 16, color: '#2563A6', lineHeight: '32px', mr: 1 }}>문의유형:</Typography>
              <Box>
                <RoundSelectButton selected={selectedType === 'all'} onClick={() => handleTypeChange('all')}>전체</RoundSelectButton>
                <RoundSelectButton selected={selectedType === '1'} onClick={() => handleTypeChange('1')}>컴플레인</RoundSelectButton>
                <RoundSelectButton selected={selectedType === '2'} onClick={() => handleTypeChange('2')}>칭찬</RoundSelectButton>
                <RoundSelectButton selected={selectedType === '3'} onClick={() => handleTypeChange('3')}>건의/문의</RoundSelectButton>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 4 }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: 16, color: '#2563A6', lineHeight: '32px', mr: 1 }}>상태:</Typography>
              <Box>
                <RoundSelectButton selected={selectedStatus === 'all'} onClick={() => handleStatusChange('all')}>전체</RoundSelectButton>
                <RoundSelectButton selected={selectedStatus === '1'} onClick={() => handleStatusChange('1')}>완료</RoundSelectButton>
                <Badge badgeContent={statusCounts.waiting} color="warning" sx={{ '& .MuiBadge-badge': { top: 5, right: 5 } }}>
                  <RoundSelectButton selected={selectedStatus === '2'} onClick={() => handleStatusChange('2')}>대기</RoundSelectButton>
                </Badge>
                <RoundSelectButton selected={selectedStatus === '3'} onClick={() => handleStatusChange('3')}>취소/반려</RoundSelectButton>
              </Box>
            </Box>
          </Box>
          {/* 오른쪽: 지점 평가 순위 버튼 */}
          <RoundButton
            onClick={onToggleRankings}
            sx={{ minWidth: 120, height: 36, fontSize: 15 }}
          >
            {showRankings ? '문의 목록 보기' : '지점 평가 순위'}
          </RoundButton>
        </Box>

        {/* 테이블/페이징 중앙정렬 및 maxWidth */}
        <Box sx={{ width: '90%', maxWidth: 1200, mx: 'auto' }}>
          {showRankings ? (
            // 랭킹 테이블만 단독으로 표시 (Card/Box 등 래핑 제거, 텍스트 제거)
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', border: '1px solid #eee' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>순위</StyledTableCell>
                    <StyledTableCell>지점명</StyledTableCell>
                    <StyledTableCell>컴플레인 건수</StyledTableCell>
                    <StyledTableCell>컴플레인 점수</StyledTableCell>
                    <StyledTableCell>칭찬 건수</StyledTableCell>
                    <StyledTableCell>칭찬 점수</StyledTableCell>
                    <StyledTableCell>종합 점수</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {storeRankings.length > 0 ? (
                    storeRankings.map((store, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          backgroundColor: index === 0 ? '#FFF9E1' : '#fff',
                          '&:hover': { backgroundColor: '#F0F5FF' }
                        }}
                      >
                        <StyledTableDataCell>{store.rank}</StyledTableDataCell>
                        <StyledTableDataCell>{store.storeName}</StyledTableDataCell>
                        <StyledTableDataCell>{store.complaintCount}</StyledTableDataCell>
                        <StyledTableDataCell>
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
                        </StyledTableDataCell>
                        <StyledTableDataCell>{store.praiseCount}</StyledTableDataCell>
                        <StyledTableDataCell>
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
                        </StyledTableDataCell>
                        <StyledTableDataCell
                          sx={{
                            color: (100 + store.totalScore) >= 100 ? 'green' : (100 + store.totalScore) < 80 ? 'red' : '#f57c00',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            textAlign: 'center'
                          }}
                        >
                          {(100 + store.totalScore).toFixed(1)}
                        </StyledTableDataCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <StyledTableDataCell colSpan={7} align="center" sx={{ py: 5 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#94A3B8', py: 4 }}>
                          <Typography variant="h6" sx={{ color: '#64748B', mb: 1 }}>
                            평가 데이터가 없습니다.
                          </Typography>
                        </Box>
                      </StyledTableDataCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Card sx={{ boxShadow: '0 2px 10px rgba(0,0,0,0.08)', borderRadius: 2 }}>
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', border: '1px solid #eee' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>번호</StyledTableCell>
                        <StyledTableCell>지점명</StyledTableCell>
                        <StyledTableCell>유형</StyledTableCell>
                        <StyledTableCell>내용</StyledTableCell>
                        <StyledTableCell>문의일자</StyledTableCell>
                        <StyledTableCell>상태</StyledTableCell>
                        <StyledTableCell>평가등급</StyledTableCell>
                        <StyledTableCell>액션</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredInquiries.length > 0 ? (
                        filteredInquiries.map(inquiry => (
                          <TableRow
                            key={inquiry.inquiryId}
                            hover
                            sx={{ '&:hover': { backgroundColor: '#F0F5FF !important' } }}
                          >
                            <StyledTableDataCell>{inquiry.inquiryId}</StyledTableDataCell>
                            <StyledTableDataCell>{inquiry.storeName}</StyledTableDataCell>
                            <StyledTableDataCell><TypeBadge type={inquiry.inqType} /></StyledTableDataCell>
                            <StyledTableDataCell sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inquiry.inqContent}</StyledTableDataCell>
                            <StyledTableDataCell>{formatDate(inquiry.inqCreatedAt)}</StyledTableDataCell>
                            <StyledTableDataCell>
                              <StatusChip label={inquiry.inqStatus === 1 ? '완료' : inquiry.inqStatus === 2 ? '대기' : inquiry.inqStatus === 3 ? '취소/반려' : '-'} status={inquiry.inqStatus === 1 ? '완료' : inquiry.inqStatus === 2 ? '대기' : inquiry.inqStatus === 3 ? '취소/반려' : '-'} size="small" />
                            </StyledTableDataCell>
                            <StyledTableDataCell>
                              {inquiry.inqLevel ? <InquiryLevelIndicator inquiry={inquiry} /> : <Typography variant="body2" color="text.secondary">미평가</Typography>}
                            </StyledTableDataCell>
                            <StyledTableDataCell>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleDetailOpen(inquiry)}
                                sx={{
                                  borderRadius: '30px',
                                  borderColor: '#55D6DF',
                                  color: '#2563A6',
                                  px: 2,
                                  py: 0.5,
                                  fontSize: 14,
                                  fontWeight: 700,
                                  '&:hover': {
                                    borderColor: '#1E5187',
                                    backgroundColor: 'rgba(85, 214, 223, 0.1)',
                                  },
                                }}
                              >
                                상세보기
                              </Button>
                            </StyledTableDataCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <StyledTableDataCell colSpan={8} align="center" sx={{ py: 5 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#94A3B8', py: 4 }}>
                              <Typography variant="h6" sx={{ color: '#64748B', mb: 1 }}>
                                문의 내역이 없거나 필터 조건에 맞는 문의가 없습니다.
                              </Typography>
                            </Box>
                          </StyledTableDataCell>
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
                      shape="rounded"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}
              </Card>
            )
          )}
        </Box>

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
      </Box>
    </ThemeProvider>
  );
};

export default StoreInquiryCom;
