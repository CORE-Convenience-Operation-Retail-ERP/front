import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Chip, LinearProgress } from '@mui/material';
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

    // 요약 데이터 계산
    const latest = salaryHistory.length > 0 ? salaryHistory[0] : null;
    const avg = salaryHistory.length > 0 ? Math.round(salaryHistory.reduce((acc, cur) => acc + (cur.netSalary || 0), 0) / salaryHistory.length) : 0;
    const total = salaryHistory.length > 0 ? salaryHistory.reduce((acc, cur) => acc + (cur.netSalary || 0), 0) : 0;

    // 실수령액 변화 시각화용 데이터 (막대그래프 느낌)
    const maxNet = salaryHistory.length > 0 ? Math.max(...salaryHistory.map(s => s.netSalary || 0)) : 1;

    // 이번달 급여 구성 비율 계산
    let 구성 = { base: 0, bonus: 0, deduct: 0, net: 0 };
    let 구성비 = { base: 0, bonus: 0, deduct: 0 };
    if (latest) {
        구성.base = latest.baseSalary || 0;
        구성.bonus = latest.bonus || 0;
        구성.deduct = (latest.deductTotal || 0) + (latest.deductExtra || 0);
        구성.net = latest.netSalary || 0;
        const totalForRatio = 구성.base + 구성.bonus + 구성.deduct;
        구성비.base = totalForRatio ? Math.round((구성.base / totalForRatio) * 100) : 0;
        구성비.bonus = totalForRatio ? Math.round((구성.bonus / totalForRatio) * 100) : 0;
        구성비.deduct = totalForRatio ? Math.round((구성.deduct / totalForRatio) * 100) : 0;
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            {/* 요약 카드 */}
            <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
                <Paper sx={{ flex: 1, minWidth: 180, p: 2, borderRadius: 2, textAlign: 'center', boxShadow: '0 2px 8px 0 rgba(85, 110, 223, 0.08)' }}>
                    <Typography sx={{ fontSize: 15, color: '#2563A6', fontWeight: 600 }}>이번달 실수령액</Typography>
                    <Typography sx={{ fontSize: 22, fontWeight: 'bold', mt: 1 }}>{latest ? formatCurrency(latest.netSalary) : '-'}</Typography>
                </Paper>
                <Paper sx={{ flex: 1, minWidth: 180, p: 2, borderRadius: 2, textAlign: 'center', boxShadow: '0 2px 8px 0 rgba(85, 110, 223, 0.08)' }}>
                    <Typography sx={{ fontSize: 15, color: '#2563A6', fontWeight: 600 }}>최근 평균 실수령액</Typography>
                    <Typography sx={{ fontSize: 22, fontWeight: 'bold', mt: 1 }}>{avg ? formatCurrency(avg) : '-'}</Typography>
                </Paper>
                <Paper sx={{ flex: 1, minWidth: 180, p: 2, borderRadius: 2, textAlign: 'center', boxShadow: '0 2px 8px 0 rgba(85, 110, 223, 0.08)' }}>
                    <Typography sx={{ fontSize: 15, color: '#2563A6', fontWeight: 600 }}>누적 실수령액</Typography>
                    <Typography sx={{ fontSize: 22, fontWeight: 'bold', mt: 1 }}>{total ? formatCurrency(total) : '-'}</Typography>
                </Paper>
            </Box>

            {/* 이번달 급여 구성 */}
            {latest && (
                <Paper sx={{ p: 2, mb: 4, borderRadius: 2, background: '#F8FAFB', boxShadow: 'none' }}>
                    <Typography sx={{ fontWeight: 600, color: '#2563A6', mb: 2, fontSize: 16 }}>이번달 급여 구성</Typography>
                    <Box sx={{ mb: 1 }}>
                        <Typography sx={{ fontSize: 14, color: '#475569', mb: 0.5 }}>기본급 <b>{formatCurrency(구성.base)}</b> ({구성비.base}%)</Typography>
                        <LinearProgress variant="determinate" value={구성비.base} sx={{ height: 8, borderRadius: 1, mb: 1, background: '#e3eaf6', '& .MuiLinearProgress-bar': { backgroundColor: '#2563A6' } }} />
                    </Box>
                    <Box sx={{ mb: 1 }}>
                        <Typography sx={{ fontSize: 14, color: '#475569', mb: 0.5 }}>보너스 <b>{formatCurrency(구성.bonus)}</b> ({구성비.bonus}%)</Typography>
                        <LinearProgress variant="determinate" value={구성비.bonus} sx={{ height: 8, borderRadius: 1, mb: 1, background: '#e3eaf6', '& .MuiLinearProgress-bar': { backgroundColor: '#6FC3ED' } }} />
                    </Box>
                    <Box sx={{ mb: 1 }}>
                        <Typography sx={{ fontSize: 14, color: '#475569', mb: 0.5 }}>공제액 <b>{formatCurrency(구성.deduct)}</b> ({구성비.deduct}%)</Typography>
                        <LinearProgress variant="determinate" value={구성비.deduct} sx={{ height: 8, borderRadius: 1, mb: 1, background: '#e3eaf6', '& .MuiLinearProgress-bar': { backgroundColor: '#F59E42' } }} />
                    </Box>
                    <Box>
                        <Typography sx={{ fontSize: 14, color: '#475569', mb: 0.5 }}>실수령액 <b>{formatCurrency(구성.net)}</b></Typography>
                        <LinearProgress variant="determinate" value={100} sx={{ height: 8, borderRadius: 1, background: '#e3eaf6', '& .MuiLinearProgress-bar': { backgroundColor: '#10B981' } }} />
                    </Box>
                </Paper>
            )}

            {/* 상세 표 */}
            <Paper elevation={0} sx={{ borderRadius: 3, p: 2, backgroundColor: '#fff', border: '1px solid #eaeef3', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)', width: '100%' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#2563A6' }}>
                    급여 내역
                </Typography>
                <TableContainer sx={{ width: '100%' }}>
                    <Table sx={{ width: '100%' }} size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#2563A6', fontSize: 16, textAlign: 'center', borderBottom: '1px solid #F5F5F5', padding: '12px 8px' }}>계산일</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#2563A6', fontSize: 16, borderBottom: '1px solid #F5F5F5', padding: '12px 8px' }}>기본급</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#2563A6', fontSize: 16, borderBottom: '1px solid #F5F5F5', padding: '12px 8px' }}>보너스</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#2563A6', fontSize: 16, borderBottom: '1px solid #F5F5F5', padding: '12px 8px' }}>공제액</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#2563A6', fontSize: 16, borderBottom: '1px solid #F5F5F5', padding: '12px 8px' }}>추가공제</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#2563A6', fontSize: 16, borderBottom: '1px solid #F5F5F5', padding: '12px 8px' }}>실수령액</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#2563A6', fontSize: 16, textAlign: 'center', borderBottom: '1px solid #F5F5F5', padding: '12px 8px' }}>지급일</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#2563A6', fontSize: 16, borderBottom: '1px solid #F5F5F5', padding: '12px 8px' }}>지급상태</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {salaryHistory.map((salary) => (
                                <TableRow key={salary.salaryId}>
                                    <TableCell sx={{ textAlign: 'center', padding: '10px 8px' }}>{formatDate(salary.calculatedAt)}</TableCell>
                                    <TableCell align="right" sx={{ padding: '10px 8px' }}>{formatCurrency(salary.baseSalary)}</TableCell>
                                    <TableCell align="right" sx={{ padding: '10px 8px' }}>{formatCurrency(salary.bonus)}</TableCell>
                                    <TableCell align="right" sx={{ padding: '10px 8px' }}>{formatCurrency(salary.deductTotal)}</TableCell>
                                    <TableCell align="right" sx={{ padding: '10px 8px' }}>{salary.deductExtra ? formatCurrency(salary.deductExtra) : '-'}</TableCell>
                                    <TableCell align="right" sx={{ padding: '10px 8px' }}>{formatCurrency(salary.netSalary)}</TableCell>
                                    <TableCell sx={{ textAlign: 'center', padding: '10px 8px' }}>{formatDate(salary.payDate)}</TableCell>
                                    <TableCell align="center" sx={{ padding: '10px 8px' }}>
                                        <Chip
                                            label={salary.payStatus === 1 ? '지급대기' : salary.payStatus === 2 ? '지급완료' : '대기'}
                                            size="small"
                                            sx={{
                                                bgcolor: salary.payStatus === 2 ? 'rgba(37,99,166,0.08)' : 'rgba(255,193,7,0.12)',
                                                color: salary.payStatus === 2 ? '#2563A6' : '#B28704',
                                                fontWeight: 600
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {salaryHistory.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ padding: '24px 8px' }}>
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

            {/* 안내문구 */}
            <Box sx={{ mt: 4, p: 2, background: '#F8FAFB', borderRadius: 2, color: '#2563A6', fontSize: 15, fontWeight: 500 }}>
                <div>급여는 매월 5일 지급됩니다.</div>
                <div>공제 항목 상세는 인사팀에 문의하세요.</div>
            </Box>
        </Box>
    );
}

export default MySalaryCon;