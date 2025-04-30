import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const MyCon = ({ info, onlyTop }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* 근태 관리 박스 */}
      <Paper sx={{ display: 'flex', borderRadius: 3, boxShadow: 3, border: '1.5px solid #dbe6ef', p: 0, overflow: 'hidden', minHeight: 120 }}>
        {/* 왼쪽: 근태 정보 */}
        <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography sx={{ mb: 1 }}>근무 일수: {info.attendanceDays}일</Typography>
          <Typography sx={{ mb: 1 }}>지각: {info.lateCount}회</Typography>
          <Typography sx={{ mb: 1 }}>결근: {info.absentCount}일</Typography>
          <Divider sx={{ my: 1, borderColor: '#dbe6ef' }} />
          <Typography>잔여 연차: {info.annualLeaveRemain}회/{info.annualLeaveTotal}회</Typography>
        </Box>
        {/* 오른쪽: 그래프 느낌 */}
        <Box sx={{ width: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7fafd' }}>
          <Box sx={{ width: 80, height: 80, borderRadius: '50%', border: '8px solid #4a90e2', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', background: '#e3f0fa' }} />
          </Box>
        </Box>
      </Paper>
      {/* 급여 정보 박스 복구 */}
      <Paper sx={{ borderRadius: 3, boxShadow: 3, border: '1.5px solid #dbe6ef', p: 0, overflow: 'hidden', minHeight: 80 }}>
        <Box sx={{ p: 3 }}>
          <Typography sx={{ mb: 1 }}>급여일: {info.salaryDay}</Typography>
          <Typography sx={{ mb: 1 }}>계좌/은행: {info.empAcount}</Typography>
        </Box>
      </Paper>
      {/* 하단 연차신청 등 필요시 추가 가능 */}
      {/* <AnnualLeaveApply info={info} /> */}
    </Box>
  );
};

export default MyCon;
