import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import axios from '../../service/axiosInstance';

const MySalaryPage = () => {
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalaryHistory = async () => {
      try {
        const response = await axios.get('/api/hr/my-salary', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSalaryHistory(response.data);
      } catch (error) {
        console.error('Error fetching salary history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSalaryHistory();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh', bgcolor: '#f8f9fa', py: 5, width: '100%' }}>
      <Paper elevation={3} sx={{ width: '100%', p: 4, borderRadius: 3, mt: 2, boxSizing: 'border-box' }}>
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          나의 급여 내역
        </Typography>
        <Box sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
          최근 급여 내역을 확인할 수 있습니다.
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer sx={{ width: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">계산일</TableCell>
                  <TableCell align="right">기본급</TableCell>
                  <TableCell align="right">보너스</TableCell>
                  <TableCell align="right">공제액</TableCell>
                  <TableCell align="right" sx={{ minWidth: 120 }}>추가공제</TableCell>
                  <TableCell align="right">실수령액</TableCell>
                  <TableCell align="center">지급일</TableCell>
                  <TableCell align="center" sx={{ minWidth: 110 }}>지급상태</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salaryHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ color: 'text.secondary' }}>
                      급여 내역이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  salaryHistory.map((salary) => (
                    <TableRow key={salary.salaryId}>
                      <TableCell align="center">{formatDate(salary.calculatedAt)}</TableCell>
                      <TableCell align="right">{formatCurrency(salary.baseSalary)}</TableCell>
                      <TableCell align="right">{formatCurrency(salary.bonus)}</TableCell>
                      <TableCell align="right">{formatCurrency(salary.deductTotal)}</TableCell>
                      <TableCell align="right" sx={{ minWidth: 120 }}>{salary.deductExtra ? formatCurrency(salary.deductExtra) : '-'}</TableCell>
                      <TableCell align="right">{formatCurrency(salary.netSalary)}</TableCell>
                      <TableCell align="center">{formatDate(salary.payDate)}</TableCell>
                      <TableCell align="center" sx={{ minWidth: 110 }}>{salary.payStatus === 1 ? '지급대기' : salary.payStatus === 2 ? '지급완료' : '대기'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default MySalaryPage;