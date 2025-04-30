import React from 'react';
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Button, Modal, Typography, Fade, Pagination } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { InputBase, IconButton, Paper } from '@mui/material';

const EmployeesListCom = ({
  departments, employees, search, setSearch, filters, setFilters,
  onDetail, modalOpen, selectedEmployee, onCloseModal,
  page, setPage, totalCount, rowsPerPage
}) => {
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
            placeholder="이름, 사번, 부서 등 검색"
            value={search.empName}
            onChange={e => setSearch(prev => ({ ...prev, empName: e.target.value }))}
            inputProps={{ 'aria-label': '검색' }}
          />
          <IconButton
            type="button"
            sx={{ p: '10px', color: '#55D6DF' }}
            aria-label="search"
            onClick={() => setSearch({ ...search })}
          >
            <SearchIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Paper>
      </Box>
      {/* "전체 사원 목록" 텍스트 */}
      <Box mb={5} sx={{
        fontWeight: 'bold',
        fontSize: 30,
        color: '#2563A6',
        letterSpacing: '-1px',
      }}>
        전체 사원 목록
      </Box>
      {/* 테이블(필터바+목록) 중앙 정렬 및 좌우 여백 */}
      <Box sx={{ width: '90%', maxWidth: 1200, mx: 'auto' }}>
        <Table size="small" sx={{ background: '#F8FAFB', borderRadius: 2, boxShadow: '0 1px 4px 0 rgba(85, 214, 223, 0.08)', mx: 'auto' }}>
          <TableHead>
            <TableRow>
              {[
                '사번',
                '이름',
                '부서',
                '직급',
                '상태',
                '입사일'
              ].map((label, idx) => (
                <TableCell
                  key={label}
                  align="center"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: 18,
                    color: '#2563A6',
                    borderBottom: 'none',
                    borderRight: idx < 5 ? '1px solid #E0E7EF' : undefined,
                    bgcolor: '#F8FAFB',
                    px: 2
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    {label}
                    <span style={{ fontSize: 16, color: '#B0B8C1', verticalAlign: 'middle' }}>↕</span>
                  </Box>
                </TableCell>
              ))}
              <TableCell sx={{ borderBottom: 'none', bgcolor: '#F8FAFB' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map(emp => (
              <TableRow key={emp.empId}>
                <TableCell align="center">{emp.empId}</TableCell>
                <TableCell align="center">{emp.empName}</TableCell>
                <TableCell align="center">{emp.deptName}</TableCell>
                <TableCell align="center">{emp.empRole}</TableCell>
                <TableCell align="center">{emp.empStatus}</TableCell>
                <TableCell align="center">{emp.hireDate}</TableCell>
                <TableCell align="center">
                  <Button size="small" variant="outlined" onClick={() => onDetail(emp.empId)}>상세보기</Button>
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
            <Box sx={{ display: 'flex', width: '100%', gap: 4 }}>
              {/* 프로필 이미지 */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                  component="img"
                  src="/profile_default.png"
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
                  <Typography fontWeight="bold" fontSize={14}>성명 Name</Typography>
                  <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.empName || '-'}</Typography>
                </Box>
                <Box>
                  <Typography fontWeight="bold" fontSize={14}>부서 Department</Typography>
                  <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.deptName || '-'}</Typography>
                </Box>
                <Box>
                  <Typography fontWeight="bold" fontSize={14}>연락처 Phone</Typography>
                  <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.empPhone || '-'}</Typography>
                </Box>
                <Box>
                  <Typography fontWeight="bold" fontSize={14}>직급 Position</Typography>
                  <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.empRole || '-'}</Typography>
                </Box>
                <Box>
                  <Typography fontWeight="bold" fontSize={14}>이메일 E-mail</Typography>
                  <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.empEmail || '-'}</Typography>
                </Box>
                <Box>
                  <Typography fontWeight="bold" fontSize={14}>입사일 Joining Date</Typography>
                  <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.hireDate || '-'}</Typography>
                </Box>
                <Box>
                  <Typography fontWeight="bold" fontSize={14}>상태 Status</Typography>
                  <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.empStatus || '-'}</Typography>
                </Box>
                <Box>
                  <Typography fontWeight="bold" fontSize={14}>근무 일수 Days Worked</Typography>
                  <Typography sx={{ bgcolor: '#f7fafd', p: 1, borderRadius: 1 }}>{selectedEmployee?.daysWorked || '-'}</Typography>
                </Box>
              </Box>
            </Box>
            <Box mt={3} width="100%" display="flex" justifyContent="center">
              <Button variant="contained" color="primary" sx={{ minWidth: 120 }}>정보 수정</Button>
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