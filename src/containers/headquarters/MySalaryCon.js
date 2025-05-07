import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from '../../service/axiosInstance';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

function MySalaryCon() {
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
        return format(new Date(dateString), 'yyyy년 MM월 dd일', { locale: ko });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        급여 내역
                    </Typography>
                    
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>계산일</TableCell>
                                    <TableCell align="right">기본급</TableCell>
                                    <TableCell align="right">보너스</TableCell>
                                    <TableCell align="right">공제액</TableCell>
                                    <TableCell align="right">추가공제</TableCell>
                                    <TableCell align="right">실수령액</TableCell>
                                    <TableCell>지급일</TableCell>
                                    <TableCell align="center">지급상태</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {salaryHistory.map((salary) => (
                                    <TableRow key={salary.salaryId}>
                                        <TableCell>{formatDate(salary.calculatedAt)}</TableCell>
                                        <TableCell align="right">{formatCurrency(salary.baseSalary)}</TableCell>
                                        <TableCell align="right">{formatCurrency(salary.bonus)}</TableCell>
                                        <TableCell align="right">{formatCurrency(salary.deductTotal)}</TableCell>
                                        <TableCell align="right">
                                            {salary.deductExtra ? formatCurrency(salary.deductExtra) : '-'}
                                        </TableCell>
                                        <TableCell align="right">{formatCurrency(salary.netSalary)}</TableCell>
                                        <TableCell>{formatDate(salary.payDate)}</TableCell>
                                        <TableCell align="center">
                                            {salary.payStatus === 1 ? '지급완료' : 
                                             salary.payStatus === 2 ? '지급실패' : '대기'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {salaryHistory.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            <Typography color="text.secondary">
                                                급여 내역이 없습니다.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default MySalaryCon;