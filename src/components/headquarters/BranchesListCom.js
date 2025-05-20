import React from 'react';
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Button, Modal, Typography, Fade, Pagination, CircularProgress, Alert, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { InputBase, IconButton, Paper, FormControl, FormLabel, FormGroup, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';

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

const BranchesListCom = ({
  branches, search, onSearch, filters, toggleStatusFilter, onSortChange,
  onDetail, modalOpen, selectedBranch, onCloseModal,
  page, setPage, totalCount, rowsPerPage, loading, error,
  onAddBranch, hasEditPermission, onNavigateToBranchEdit
}) => {
  
  const navigate = useNavigate();
  
  // 상태 필터 옵션들
  const statusOptions = [
    { value: 1, label: '영업중', color: '#3B6FAE' },
    { value: 2, label: '휴업', color: '#3B6FAE' },
    { value: 3, label: '폐업', color: '#3B6FAE' }
  ];
  
  // 본사 스타일 기준 컬럼 정의
  const branchColumns = [
    { id: 'storeId', label: '지점번호', minWidth: 100 },
    { id: 'storeName', label: '지점명', minWidth: 120 },
    { id: 'storeAddr', label: '주소', minWidth: 220 },
    { id: 'storeTel', label: '전화번호', minWidth: 120 },
    { id: 'storeStatus', label: '상태', minWidth: 100 },
    { id: 'storeCreatedAt', label: '개설일', minWidth: 120 }
  ];
  
  // 검색 폼 제출 핸들러
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };
  
  // 검색어 초기화 핸들러
  const handleClearSearch = () => {
    onSearch('');
  };
  
  // 지점 정보 수정 페이지로 이동
  const handleNavigateToBranchEdit = (storeId) => {
    onCloseModal();
    onNavigateToBranchEdit(storeId);
  };
  
  return (
    <Box>
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
            지점 목록
          </Typography>
          {hasEditPermission && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddBranch}
              sx={{
                backgroundColor: '#2563A6',
                '&:hover': { backgroundColor: '#1E5187' },
                borderRadius: '30px',
                px: 3,
                height: 40
              }}
            >
              지점 추가
            </Button>
          )}
        </Box>
      </Box>
      
      {/* 검색바 */}
      <Box sx={{ width: '90%', maxWidth: 1200, mx: 'auto', display: 'flex', justifyContent: 'center', mb: 5 }}>
        <Paper
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            p: '2px 16px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            borderRadius: '30px',
            boxShadow: '0 2px 8px 0 rgba(85, 214, 223, 0.15)',
            border: '2px solid #55D6DF',
            bgcolor: '#fff',
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1, fontSize: 18 }}
            placeholder="지점명, 주소 검색"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            inputProps={{ 'aria-label': '검색' }}
          />
          {search && (
            <IconButton
              onClick={handleClearSearch}
              sx={{ p: '10px', color: '#55D6DF' }}
              aria-label="clear"
            >
              <ClearIcon />
            </IconButton>
          )}
          <IconButton
            type="submit"
            sx={{ p: '10px', color: '#55D6DF' }}
            aria-label="search"
          >
            <SearchIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Paper>
      </Box>
      
      {/* 상태 필터 */}
      <Box sx={{ width: '90%', maxWidth: 1200, mx: 'auto', display: 'flex', alignItems: 'center', mb: 4 }}>
        <FormControl component="fieldset">
          <FormGroup row>
            <FormLabel component="legend" sx={{ mr: 2, fontSize: 16, fontWeight: 'bold', color: '#2563A6', lineHeight: '42px' }}>
              상태:
            </FormLabel>
            {statusOptions.map(option => (
              <Chip
                key={option.value}
                label={option.label}
                onClick={() => toggleStatusFilter(option.value)}
                sx={{
                  mx: 0.5,
                  px: 1,
                  fontSize: 14,
                  borderRadius: '16px',
                  border: `1px solid ${option.color}`,
                  color: filters.status.includes(option.value) ? '#fff' : option.color,
                  backgroundColor: filters.status.includes(option.value) ? option.color : 'transparent',
                  '&:hover': {
                    backgroundColor: filters.status.includes(option.value) ? option.color : `${option.color}22`,
                  },
                }}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Box>
      
      {/* 로딩 표시 */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* 에러 표시 */}
      {error && !loading && (
        <Box sx={{ textAlign: 'center', color: 'error.main', my: 4 }}>
          <Typography variant="h6">{error}</Typography>
        </Box>
      )}

      {/* 데이터가 없을 때 */}
      {!loading && !error && branches.length === 0 && (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6">검색 결과가 없습니다.</Typography>
        </Box>
      )}

      {/* 테이블(필터바+목록) 중앙 정렬 및 좌우 여백 */}
      {!loading && !error && branches.length > 0 && (
        <Box sx={{ width: '90%', maxWidth: 1200, mx: 'auto' }}>
          <Table size="small" sx={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 4px 0 rgba(85, 214, 223, 0.08)', mx: 'auto' }}>
            <TableHead>
              <TableRow>
                {branchColumns.map((column, idx) => (
                  <TableCell
                    key={column.id}
                    align="center"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: 18,
                      color: '#2563A6',
                      borderBottom: '1px solid #F5F5F5',
                      borderRight: idx < branchColumns.length - 1 ? '1px solid #F5F5F5' : undefined,
                      bgcolor: '#fff',
                      px: 2,
                      minWidth: column.minWidth,
                      cursor: column.id !== 'storeStatus' ? 'pointer' : 'default'
                    }}
                    onClick={() => column.id !== 'storeStatus' && onSortChange(column.id)}
                  >
                    {column.label}
                    {filters.sort === column.id && (
                      filters.order === 'asc' ? 
                        <ArrowUpwardIcon sx={{ fontSize: '0.9rem', ml: 0.5 }} /> : 
                        <ArrowDownwardIcon sx={{ fontSize: '0.9rem', ml: 0.5 }} />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {branches.map((row) => (
                <TableRow 
                  key={row.storeId}
                  hover
                  onClick={() => onDetail(row.storeId)}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#F0F5FF',
                    }
                  }}
                >
                  <TableCell align="center" sx={{ borderRight: '1px solid #F5F5F5', py: 2.5, borderBottom: '1px solid #F5F5F5' }}>{highlightText(row.storeId, search)}</TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid #F5F5F5', py: 2.5, borderBottom: '1px solid #F5F5F5' }}>{highlightText(row.storeName, search)}</TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid #F5F5F5', py: 2.5, borderBottom: '1px solid #F5F5F5' }}>{highlightText(row.storeAddr, search)}</TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid #F5F5F5', py: 2.5, borderBottom: '1px solid #F5F5F5' }}>{row.storeTel}</TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid #F5F5F5', py: 2.5, borderBottom: '1px solid #F5F5F5' }}>
                    <Chip 
                      label={
                        row.storeStatus === 1 ? '영업중' :
                        row.storeStatus === 2 ? '휴업' :
                        '폐업'
                      }
                      sx={{ 
                        backgroundColor: 
                          row.storeStatus === 1 ? '#D0EBFF' :
                          row.storeStatus === 2 ? '#FFCC80' :
                          '#FFAFAF',
                        color: 
                          row.storeStatus === 1 ? '#1D5795' :
                          row.storeStatus === 2 ? '#B36A00' :
                          '#A02929',
                        fontWeight: 'bold',
                        px: 1
                      }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2.5, borderBottom: '1px solid #F5F5F5' }}>{new Date(row.storeCreatedAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Box display="flex" justifyContent="center" mt={3} mb={2}>
            <Pagination
              count={Math.ceil(totalCount / rowsPerPage)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
            />
          </Box>
        </Box>
      )}

      {/* 상세 모달 */}
      <Modal open={modalOpen} onClose={onCloseModal} closeAfterTransition>
        <Fade in={modalOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              p: 4,
              borderRadius: 3,
              minWidth: 800,
              boxShadow: 24,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>지점 상세 정보</Typography>
            {selectedBranch ? (
              <Box sx={{ display: 'flex', width: '100%', gap: 4 }}>
                {/* 정보 필드 */}
                <Box sx={{ flex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography fontWeight="bold" fontSize={14}>지점번호</Typography>
                    <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedBranch.storeId}</Typography>
                  </Box>
                  <Box>
                    <Typography fontWeight="bold" fontSize={14}>지점명</Typography>
                    <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedBranch.storeName}</Typography>
                  </Box>
                  <Box>
                    <Typography fontWeight="bold" fontSize={14}>점주명</Typography>
                    <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedBranch.ownerName || '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography fontWeight="bold" fontSize={14}>점주 연락처</Typography>
                    <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedBranch.ownerPhone || '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography fontWeight="bold" fontSize={14}>지점 전화번호</Typography>
                    <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedBranch.storeTel}</Typography>
                  </Box>
                  <Box>
                    <Typography fontWeight="bold" fontSize={14}>개설일</Typography>
                    <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>
                      {new Date(selectedBranch.storeCreatedAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography fontWeight="bold" fontSize={14}>상태</Typography>
                    <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>
                      {selectedBranch.storeStatus === 1 ? '영업중' :
                       selectedBranch.storeStatus === 2 ? '휴업' : '폐업'}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: '1 / span 2' }}>
                    <Typography fontWeight="bold" fontSize={14}>주소</Typography>
                    <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedBranch.storeAddr}</Typography>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                <CircularProgress />
              </Box>
            )}
            {hasEditPermission && (
              <Box mt={3} width="100%" display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  onClick={() => handleNavigateToBranchEdit(selectedBranch.storeId)}
                  sx={{
                    minWidth: 120,
                    borderRadius: '20px',
                    backgroundColor: '#2563A6',
                    '&:hover': {
                      backgroundColor: '#1E5187',
                    }
                  }}
                >
                  정보 수정
                </Button>
              </Box>
            )}
            <Box mt={1} width="100%" display="flex" justifyContent="flex-end">
              <Button onClick={onCloseModal}>닫기</Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default BranchesListCom; 