import React from 'react';
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Button, Modal, Typography, Fade, Pagination, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { InputBase, IconButton, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';

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

const EmployeesListCom = ({
  departments, employees, search, onSearch, filters, toggleStatusFilter, onSortChange,
  onDetail, modalOpen, selectedEmployee, onCloseModal,
  page, setPage, totalCount, rowsPerPage, loading, error
}) => {
  
  // 상태 필터 옵션들
  const statusOptions = [
    { value: '재직', label: '재직', color: '#3B6FAE' },
    { value: '휴직', label: '휴직', color: '#3B6FAE' },
    { value: '퇴사', label: '퇴사', color: '#3B6FAE' }
  ];
  
  // 검색 폼 제출 핸들러
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // 검색어가 이미 상태에 설정된 상태임
  };
  
  return (
    <Box>
      {/* 검색바 */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          mt: 3,
          mb: 4,
        }}
      >
        <Paper
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            p: '2px 16px',
            display: 'flex',
            alignItems: 'center',
            width: '70%',
            borderRadius: '30px',
            boxShadow: '0 2px 8px 0 rgba(85, 214, 223, 0.15)',
            border: '2px solid #55D6DF',
            bgcolor: '#fff',
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1, fontSize: 18 }}
            placeholder="이름, 사번, 부서 검색"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            inputProps={{ 'aria-label': '검색' }}
          />
          <IconButton
            type="submit"
            sx={{ p: '10px', color: '#55D6DF' }}
            aria-label="search"
          >
            <SearchIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Paper>
      </Box>
      
      {/* "전체 사원 목록" 텍스트와 상태 필터 버튼 */}
      <Box mb={3} sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 5
      }}>
        <Typography sx={{
          fontWeight: 'bold',
          fontSize: 30,
          color: '#2563A6',
          letterSpacing: '-1px',
        }}>
          전체 사원 목록
        </Typography>
        
        {/* 상태 필터 토글 버튼 */}
        <ToggleButtonGroup
          value={filters.status}
          onChange={(e, newValues) => {
            // 여기서는 사용하지 않고 각 버튼의 onClick에서 처리
          }}
          aria-label="상태 필터"
          size="small"
        >
          {statusOptions.map(option => (
            <ToggleButton 
              key={option.value} 
              value={option.value}
              onClick={() => toggleStatusFilter(option.value)}
              selected={filters.status.includes(option.value)}
              sx={{
                mx: 0.5,
                px: 2,
                py: 0.5,
                fontSize: 14,
                borderRadius: '16px',
                border: `1px solid ${option.color}`,
                color: filters.status.includes(option.value) ? '#fff' : option.color,
                backgroundColor: filters.status.includes(option.value) ? option.color : 'transparent',
                '&:hover': {
                  backgroundColor: filters.status.includes(option.value) ? option.color : `${option.color}22`,
                },
                '&.Mui-selected': {
                  backgroundColor: option.color,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: option.color,
                  }
                }
              }}
            >
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
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
      {!loading && !error && employees.length === 0 && (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6">검색 결과가 없습니다.</Typography>
        </Box>
      )}

      {/* 테이블(필터바+목록) 중앙 정렬 및 좌우 여백 */}
      {!loading && !error && employees.length > 0 && (
        <Box sx={{ width: '90%', maxWidth: 1200, mx: 'auto' }}>
          <Table size="small" sx={{ background: '#F8FAFB', borderRadius: 2, boxShadow: '0 1px 4px 0 rgba(85, 214, 223, 0.08)', mx: 'auto' }}>
            <TableHead>
              <TableRow>
                {[
                  { id: 'empId', label: '사번' },
                  { id: 'empName', label: '이름' },
                  { id: 'deptName', label: '부서' },
                  { id: 'empStatus', label: '상태' },
                  { id: 'hireDate', label: '입사일' }
                ].map((column, idx) => (
                  <TableCell
                    key={column.id}
                    align="center"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: 18,
                      color: '#2563A6',
                      borderBottom: 'none',
                      borderRight: idx < 4 ? '1px solid #E0E7EF' : undefined,
                      bgcolor: '#F8FAFB',
                      px: 2,
                      cursor: column.id !== 'empStatus' ? 'pointer' : 'default'
                    }}
                    onClick={() => column.id !== 'empStatus' && onSortChange(column.id)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      {column.label}
                      {column.id !== 'empStatus' && (
                        filters.sort === column.id ? (
                          filters.order === 'asc' ? 
                            <ArrowUpwardIcon fontSize="small" /> : 
                            <ArrowDownwardIcon fontSize="small" />
                        ) : (
                          <span style={{ opacity: 0.3 }}>↕</span>
                        )
                      )}
                    </Box>
                  </TableCell>
                ))}
                <TableCell sx={{ borderBottom: 'none', bgcolor: '#F8FAFB' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map(emp => (
                <TableRow key={emp.empId}>
                  <TableCell align="center">{search ? highlightText(emp.empId, search) : emp.empId}</TableCell>
                  <TableCell align="center">{search ? highlightText(emp.empName, search) : emp.empName}</TableCell>
                  <TableCell align="center">{search ? highlightText(emp.deptName, search) : emp.deptName}</TableCell>
                  <TableCell align="center">{emp.empStatus}</TableCell>
                  <TableCell align="center">{emp.hireDate}</TableCell>
                  <TableCell align="center">
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={() => onDetail(emp.empId)}
                      sx={{ 
                        borderRadius: '20px',
                        color: '#2563A6',
                        borderColor: '#2563A6',
                        '&:hover': {
                          backgroundColor: '#e8f0f7',
                          borderColor: '#2563A6',
                        }
                      }}
                    >
                      상세보기
                    </Button>
                  </TableCell>
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
            <Typography variant="h6" fontWeight="bold" mb={2}>상세 정보</Typography>
            {selectedEmployee ? (
              <Box sx={{ display: 'flex', width: '100%', gap: 4 }}>
                {/* 프로필 이미지 */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box
                    component="img"
                    src={selectedEmployee.empImg || "/profile_default.png"}
                    alt="프로필"
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      mb: 2,
                      border: '1px solid #eee'
                    }}
                  />
                </Box>
                {/* 정보 필드 */}
                <Box sx={{ flex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography fontWeight="bold" fontSize={14}>이름</Typography>
                    <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.empName || '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography fontWeight="bold" fontSize={14}>부서</Typography>
                    <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.deptName || '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography fontWeight="bold" fontSize={14}>연락처</Typography>
                    <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.empPhone || '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography fontWeight="bold" fontSize={14}>내선번호</Typography>
                    <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.empExt || '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography fontWeight="bold" fontSize={14}>이메일</Typography>
                    <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.empEmail || '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography fontWeight="bold" fontSize={14}>입사일</Typography>
                    <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.hireDate || '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography fontWeight="bold" fontSize={14}>상태</Typography>
                    <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.empStatus || '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography fontWeight="bold" fontSize={14}>재직일수</Typography>
                    <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.daysWorked || '-'}</Typography>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                <CircularProgress />
              </Box>
            )}
            <Box mt={3} width="100%" display="flex" justifyContent="center">
              <Button
                variant="contained"
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
            <Box mt={1} width="100%" display="flex" justifyContent="flex-end">
              <Button onClick={onCloseModal}>닫기</Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default EmployeesListCom;