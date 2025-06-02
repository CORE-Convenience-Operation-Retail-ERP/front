import React from 'react';
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Button, Modal, Typography, Fade, Pagination, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { InputBase, IconButton, Paper, FormControl, FormLabel, FormGroup, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
  page, setPage, totalCount, rowsPerPage, loading, error,
  employeeType, onEmployeeTypeChange
}) => {
  
  const navigate = useNavigate();
  
  // 상태 필터 옵션들
  const statusOptions = [
    { value: '재직', label: '재직', color: '#3B6FAE' },
    { value: '휴직', label: '휴직', color: '#3B6FAE' },
    { value: '퇴사', label: '퇴사', color: '#3B6FAE' }
  ];
  
  // 본사 테이블 헤더 컬럼 정의 (간격 기준)
  const hqColumns = [
    { id: 'empId', label: '사번', minWidth: 100 },
    { id: 'empName', label: '이름', minWidth: 120 },
    { id: 'deptName', label: '부서', minWidth: 140 },
    { id: 'empStatus', label: '상태', minWidth: 100 },
    { id: 'hireDate', label: '입사일', minWidth: 120 }
  ];
  // 점주 테이블 헤더 컬럼 정의 (본사 기준 간격 적용)
  const ownerColumns = [
    { id: 'empId', label: '점주', minWidth: 100 },
    { id: 'empName', label: '점주명', minWidth: 120 },
    { id: 'storeName', label: '점포명', minWidth: 140 },
    { id: 'empStatus', label: '상태', minWidth: 100 },
    { id: 'hireDate', label: '계약일', minWidth: 120 }
  ];
  
  // 검색 폼 제출 핸들러
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // 검색어가 이미 상태에 설정된 상태임
  };
  
  // 검색어 초기화 핸들러
  const handleClearSearch = () => {
    onSearch('');
  };
  
  // 사원정보 관리 페이지로 이동
  const handleNavigateToEmployeeManagement = () => {
    onCloseModal();
    if (selectedEmployee && selectedEmployee.empId) {
      navigate(`/headquarters/hr/employee-management/${selectedEmployee.empId}?type=${employeeType}`);
    } else {
      navigate(`/headquarters/hr/employee-management?type=${employeeType}`);
    }
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
            {employeeType === '본사' ? '본사 사원 목록' : '점주 목록'}
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
            placeholder="이름, 사번, 부서 검색"
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

      {/* 본사/점주 선택 버튼 + 상태 필터 */}
      <Box sx={{ width: '90%', maxWidth: 1200, mx: 'auto', display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'space-between' }}>
        {/* 상태 필터 - 왼쪽 */}
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
        {/* 본사/점주 토글 버튼 - 오른쪽 */}
        <Box sx={{ display: 'flex' }}>
          <Button
            variant={employeeType === '본사' ? 'contained' : 'outlined'}
            onClick={() => onEmployeeTypeChange('본사')}
            sx={{
              borderRadius: '20px 0 0 20px',
              backgroundColor: employeeType === '본사' ? '#2563A6' : 'transparent',
              color: employeeType === '본사' ? 'white' : '#2563A6',
              borderColor: '#2563A6',
              '&:hover': {
                backgroundColor: employeeType === '본사' ? '#1E5187' : 'rgba(37, 99, 166, 0.1)',
              },
              px: 2
            }}
          >
            본사
          </Button>
          <Button
            variant={employeeType === '점주' ? 'contained' : 'outlined'}
            onClick={() => onEmployeeTypeChange('점주')}
            sx={{
              borderRadius: '0 20px 20px 0',
              backgroundColor: employeeType === '점주' ? '#2563A6' : 'transparent',
              color: employeeType === '점주' ? 'white' : '#2563A6',
              borderColor: '#2563A6',
              '&:hover': {
                backgroundColor: employeeType === '점주' ? '#1E5187' : 'rgba(37, 99, 166, 0.1)',
              },
              px: 2
            }}
          >
            점주
          </Button>
        </Box>
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
          {/* 본사 테이블 시작 */}
          {employeeType === '본사' ? (
            <Table size="small" sx={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 4px 0 rgba(85, 214, 223, 0.08)', mx: 'auto' }}>
              <TableHead>
                <TableRow>
                  {/* 본사 테이블 헤더 컬럼 */}
                  {hqColumns.map((column, idx) => (
                    <TableCell
                      key={column.id}
                      align="center"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: 18,
                        color: '#2563A6',
                        borderBottom: '1px solid #F5F5F5',
                        borderRight: idx < 4 ? '1px solid 0' : undefined,
                        bgcolor: '#fff',
                        px: 2,
                        minWidth: column.minWidth,
                        cursor: column.id !== 'empStatus' ? 'pointer' : 'default'
                      }}
                      onClick={() => column.id !== 'empStatus' && onSortChange(column.id)}
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
                {/* 본사 테이블 바디 */}
                {employees.map((row) => (
                  <TableRow 
                    key={row.empId}
                    hover
                    onClick={() => onDetail(row.empId)}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#F0F5FF',
                      }
                    }}
                  >
                    {/* 본사 테이블 바디 셀 */}
                    <TableCell align="center" sx={{ borderRight: '1px solid #F5F5F5', py: 1, borderBottom: '1px solid #F5F5F5' }}>{highlightText(row.empId, search)}</TableCell>
                    <TableCell align="center" sx={{ borderRight: '1px solid #F5F5F5', py: 1, borderBottom: '1px solid #F5F5F5' }}>{highlightText(row.empName, search)}</TableCell>
                    <TableCell align="center" sx={{ borderRight: '1px solid #F5F5F5', py: 1, borderBottom: '1px solid #F5F5F5' }}>{highlightText(row.deptName, search)}</TableCell>
                    <TableCell align="center" sx={{ borderRight: '1px solid #F5F5F5', py: 1, borderBottom: '1px solid #F5F5F5' }}>
                      <Chip 
                        label={row.empStatus} 
                        sx={{ 
                          backgroundColor: 
                            row.empStatus === '재직' ? '#D0EBFF' :
                            row.empStatus === '휴직' ? '#FFCC80' :
                            '#FFAFAF',
                          color: 
                            row.empStatus === '재직' ? '#1D5795' :
                            row.empStatus === '휴직' ? '#B36A00' :
                            '#A02929',
                          fontWeight: 'bold',
                          px: 1
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ py: 2.5, borderBottom: '1px solid #F5F5F5' }}>{row.hireDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            // 점주 테이블 시작
            <Table size="small" sx={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 4px 0 rgba(85, 214, 223, 0.08)', mx: 'auto' }}>
              <TableHead>
                <TableRow>
                  {/* 점주 테이블 헤더 컬럼 (본사 기준 간격) */}
                  {ownerColumns.map((column, idx) => (
                    <TableCell
                      key={column.id}
                      align="center"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: 18,
                        color: '#2563A6',
                        borderBottom: '1px solid #F5F5F5',
                        borderRight: idx < 4 ? '1px solid 0' : undefined,
                        bgcolor: '#fff',
                        px: 2,
                        minWidth: column.minWidth,
                        cursor: column.id !== 'empStatus' ? 'pointer' : 'default'
                      }}
                      onClick={() => column.id !== 'empStatus' && onSortChange(column.id)}
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
                {/* 점주 테이블 바디 */}
                {employees.map((row) => (
                  <TableRow 
                    key={row.empId}
                    hover
                    onClick={() => onDetail(row.empId)}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#F0F5FF',
                      }
                    }}
                  >
                    {/* 점주 테이블 바디 셀 */}
                    <TableCell align="center" sx={{ borderRight: '1px solid #F5F5F5', py: 2.5, borderBottom: '1px solid #F5F5F5' }}>{highlightText(row.rowNum, search)}</TableCell>
                    <TableCell align="center" sx={{ borderRight: '1px solid #F5F5F5', py: 1, borderBottom: '1px solid #F5F5F5' }}>{highlightText(row.empName, search)}</TableCell>
                    <TableCell align="center" sx={{ borderRight: '1px solid #F5F5F5', py: 1, borderBottom: '1px solid #F5F5F5' }}>{highlightText(row.storeName, search)}</TableCell>
                    <TableCell align="center" sx={{ borderRight: '1px solid #F5F5F5', py: 1, borderBottom: '1px solid #F5F5F5' }}>
                      <Chip 
                        label={row.empStatus} 
                        sx={{ 
                          backgroundColor: 
                            row.empStatus === '재직' ? '#D0EBFF' :
                            row.empStatus === '휴직' ? '#FFCC80' :
                            '#FFAFAF',
                          color: 
                            row.empStatus === '재직' ? '#1D5795' :
                            row.empStatus === '휴직' ? '#B36A00' :
                            '#A02929',
                          fontWeight: 'bold',
                          px: 1
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ py: 1, borderBottom: '1px solid #F5F5F5' }}>{row.hireDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

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
                    src={
                      selectedEmployee.empImg 
                        ? (selectedEmployee.empImg.startsWith('http') 
                            ? selectedEmployee.empImg 
                            : `/api/auth/uploads/${selectedEmployee.empImg}`)
                        : "/profile_default.png"
                    }
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
                  <Typography fontWeight="bold" fontSize={16}>
                    {employeeType === '본사' ? `사번: ${selectedEmployee.empId}` : `점주번호: ${selectedEmployee.rowNum || '?'}`}
                  </Typography>
                </Box>
                {/* 정보 필드 */}
                <Box sx={{ flex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography fontWeight="bold" fontSize={14}>이름</Typography>
                    <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.empName || '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography fontWeight="bold" fontSize={14}>{employeeType === '본사' ? '부서' : '점포명'}</Typography>
                    <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>
                      {employeeType === '본사' ? selectedEmployee?.deptName || '-' : selectedEmployee?.storeName || '-'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography fontWeight="bold" fontSize={14}>연락처</Typography>
                    <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.empPhone || '-'}</Typography>
                  </Box>
                  {employeeType === '본사' ? (
                    <Box>
                      <Typography fontWeight="bold" fontSize={14}>내선번호</Typography>
                      <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.empExt || '-'}</Typography>
                    </Box>
                  ) : (
                    <Box>
                      <Typography fontWeight="bold" fontSize={14}>매장 전화번호</Typography>
                      <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.storeTel || '-'}</Typography>
                    </Box>
                  )}
                  <Box>
                    <Typography fontWeight="bold" fontSize={14}>이메일</Typography>
                    <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.empEmail || '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography fontWeight="bold" fontSize={14}>{employeeType === '본사' ? '입사일' : '계약일'}</Typography>
                    <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.hireDate || '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography fontWeight="bold" fontSize={14}>상태</Typography>
                    <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.empStatus || '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography fontWeight="bold" fontSize={14}>{employeeType === '본사' ? '재직일수' : '계약일수'}</Typography>
                    <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.daysWorked || '-'}</Typography>
                  </Box>
                  {employeeType === '본사' ? (
                    <Box sx={{ gridColumn: '1 / span 2' }}>
                      <Typography fontWeight="bold" fontSize={14}>주소</Typography>
                      <Typography 
                        sx={{ 
                          bgcolor: '#f0f7ff', 
                          p: 1, 
                          borderRadius: 1,
                          border: '1px solid #d0e0ff'
                        }}
                      >
                        {selectedEmployee?.empAddr || '-'}
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ gridColumn: '1 / span 2' }}>
                      <Typography fontWeight="bold" fontSize={14}>매장 주소</Typography>
                      <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.storeAddr || '-'}</Typography>
                    </Box>
                  )}
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
                onClick={handleNavigateToEmployeeManagement}
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