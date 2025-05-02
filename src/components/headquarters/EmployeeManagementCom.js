import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Avatar,
  CircularProgress,
  Alert
} from '@mui/material';

const EmployeeManagementCom = ({ employee, departments, onSave, loading, error }) => {
  // 초기 상태 설정 (실제로는 컨테이너에서 props로 받아와야 함)
  const [formData, setFormData] = useState(employee || {
    empId: '',
    empName: '',
    deptCode: '',
    empStatus: '재직',
    empPhone: '',
    empExt: '',
    empEmail: '',
    hireDate: '',
    empImg: null
  });

  // 입력 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 폼 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
  };

  // 이미지 업로드 처리
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          empImg: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 로딩 중일 때 표시
  if (loading && !employee) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* 제목 */}
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 'bold', 
          color: '#2563A6', 
          mb: 4,
          borderBottom: '2px solid #55D6DF',
          paddingBottom: 1
        }}
      >
        사원 정보 관리
      </Typography>

      {/* 오류 메시지 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper 
        component="form" 
        onSubmit={handleSubmit}
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          backgroundColor: '#F8FAFB'
        }}
      >
        <Grid container spacing={4}>
          {/* 프로필 이미지 섹션 */}
          <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={formData.empImg || "/profile_default.png"}
              alt="프로필 이미지"
              sx={{ 
                width: 150, 
                height: 150, 
                mb: 2,
                border: '2px solid #e0e0e0'
              }}
            />
            <Button
              variant="outlined"
              component="label"
              sx={{ 
                borderRadius: 2,
                color: '#2563A6',
                borderColor: '#2563A6',
                '&:hover': {
                  backgroundColor: '#e8f0f7',
                  borderColor: '#2563A6',
                }
              }}
            >
              사진 업로드
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImageUpload}
              />
            </Button>
          </Grid>

          {/* 기본 정보 섹션 */}
          <Grid item xs={12} md={9}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                color: '#2563A6'
              }}
            >
              기본 정보
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="사번"
                  name="empId"
                  value={formData.empId}
                  onChange={handleChange}
                  disabled={!!employee?.empId}
                  variant="outlined"
                  size="small"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="이름"
                  name="empName"
                  value={formData.empName}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>부서</InputLabel>
                  <Select
                    name="deptCode"
                    value={formData.deptCode}
                    label="부서"
                    onChange={handleChange}
                    required
                  >
                    {departments?.map(dept => (
                      <MenuItem key={dept.deptCode} value={dept.deptCode}>
                        {dept.deptName}
                      </MenuItem>
                    )) || (
                      <>
                        <MenuItem value="HQ_BR">인사팀</MenuItem>
                        <MenuItem value="HQ_HRM">경영지원팀</MenuItem>
                        <MenuItem value="HQ_DEV">개발팀</MenuItem>
                        <MenuItem value="HQ_FIN">재무팀</MenuItem>
                      </>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>상태</InputLabel>
                  <Select
                    name="empStatus"
                    value={formData.empStatus}
                    label="상태"
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="재직">재직</MenuItem>
                    <MenuItem value="휴직">휴직</MenuItem>
                    <MenuItem value="퇴사">퇴사</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* 연락처 정보 섹션 */}
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                color: '#2563A6'
              }}
            >
              연락처 정보
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="휴대전화"
                  name="empPhone"
                  value={formData.empPhone}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  placeholder="010-0000-0000"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="내선번호"
                  name="empExt"
                  value={formData.empExt}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="이메일"
                  name="empEmail"
                  value={formData.empEmail}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  type="email"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* 입사 정보 섹션 */}
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                color: '#2563A6'
              }}
            >
              입사 정보
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="입사일"
                  name="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* 저장 버튼 */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                minWidth: 150,
                borderRadius: '20px',
                backgroundColor: '#2563A6',
                '&:hover': {
                  backgroundColor: '#1E5187',
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : '저장하기'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default EmployeeManagementCom;