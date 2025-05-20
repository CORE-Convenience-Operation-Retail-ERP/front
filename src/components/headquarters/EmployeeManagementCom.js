import React, { useState, useEffect } from 'react';
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
  Alert,
  FormHelperText
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const EmployeeManagementCom = ({ employee, departments, stores, onSave, loading, error, employeeType }) => {
  const navigate = useNavigate();
  // 초기 상태 설정
  const [formData, setFormData] = useState({
    empId: '',
    empName: '',
    deptCode: '',
    empStatus: '재직',
    empPhone: '',
    empExt: '',
    empEmail: '',
    hireDate: '',
    empImg: null,
    empAddr: '',
    storeTel: '',
    empBank: 0,      // 은행 정보 추가
    empAcount: '',   // 계좌번호 추가
    storeId: null    // 지점 ID 추가
  });

  // employee prop이 변경될 때 formData 업데이트
  useEffect(() => {
    if (employee) {
      console.log('Received employee data:', employee);
      
      // 상태값이 숫자인 경우 문자열로 변환
      let empStatusText = employee.empStatus || '재직';
      
      // 숫자인 경우 변환
      if (['1', '2', '3'].includes(empStatusText)) {
        switch (empStatusText) {
          case '1':
            empStatusText = '재직';
            break;
          case '2':
            empStatusText = '휴직';
            break;
          case '3':
            empStatusText = '퇴사';
            break;
          default:
            empStatusText = '재직';
        }
      }
      
      setFormData({
        empId: employee.empId || '',
        empName: employee.empName || '',
        deptCode: employee.deptCode || '',
        empStatus: empStatusText,
        empPhone: employee.empPhone || '',
        empExt: employee.empExt || '',
        empEmail: employee.empEmail || '',
        hireDate: employee.hireDate || '',
        empImg: employee.empImg || null,
        empAddr: employee.empAddr || '',
        storeTel: employee.storeTel || '',
        empBank: employee.empBank || 0,
        empAcount: employee.empAcount || '',
        storeId: employee.storeId || null
      });
    }
  }, [employee]);

  // 입력 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 계좌번호 입력 처리 (하이픈 자동 추가)
  const handleAccountChange = (e) => {
    let value = e.target.value;
    
    // 숫자와 하이픈만 허용
    value = value.replace(/[^0-9-]/g, '');
    
    // 하이픈 제거 후 숫자만 추출
    const numbers = value.replace(/-/g, '');
    
    // 계좌번호 포맷팅 (하이픈 자동 추가)
    let formattedValue = '';
    if (numbers.length <= 4) {
      formattedValue = numbers;
    } else if (numbers.length <= 8) {
      formattedValue = `${numbers.substring(0, 4)}-${numbers.substring(4)}`;
    } else if (numbers.length <= 12) {
      formattedValue = `${numbers.substring(0, 4)}-${numbers.substring(4, 8)}-${numbers.substring(8)}`;
    } else {
      formattedValue = `${numbers.substring(0, 4)}-${numbers.substring(4, 8)}-${numbers.substring(8, 12)}-${numbers.substring(12)}`;
    }
    
    setFormData(prev => ({
      ...prev,
      empAcount: formattedValue
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
            사원 정보 관리
          </Typography>
        </Box>
      </Box>
    
      {/* 오류 메시지 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 검색바 + 사원 정보 테이블 */}
      <Paper 
        component="form" 
        onSubmit={handleSubmit}
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          backgroundColor: '#fff',
          width: '90%',
          maxWidth: 1200,
          mx: 'auto',
          position: 'relative'
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

          {/* 정보 섹션 */}
          <Grid item xs={12} md={9}>
            {/* 1. 기본 정보 섹션 */}
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
                  label={employeeType === '본사' ? "이름" : "점주명"}
                  name="empName"
                  value={formData.empName}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={employeeType === '본사' ? "사번" : "점주번호"}
                  name="empId"
                  value={formData.empId}
                  onChange={handleChange}
                  disabled={!!employee?.empId}
                  variant="outlined"
                  size="small"
                  required
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* 2. 입사 정보 섹션 */}
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                color: '#2563A6'
              }}
            >
              {employeeType === '본사' ? '입사 정보' : '계약 정보'}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={employeeType === '본사' ? "입사일" : "계약일"}
                  name="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              {employeeType === '본사' ? (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>부서</InputLabel>
                    <Select
                      name="deptCode"
                      value={formData.deptCode || ''}
                      label="부서"
                      onChange={handleChange}
                      required
                    >
                      {departments?.length > 0 ? 
                        departments.map(dept => (
                          <MenuItem key={dept.deptCode} value={dept.deptCode}>
                            {dept.deptName}
                          </MenuItem>
                        )) : 
                        [
                          <MenuItem key="HQ_HRM" value="HQ_HRM">인사팀</MenuItem>,
                          <MenuItem key="HQ_BR" value="HQ_BR">지점관리팀</MenuItem>,
                          <MenuItem key="HQ_PRO" value="HQ_PRO">상품관리팀</MenuItem>
                        ]
                      }
                    </Select>
                  </FormControl>
                </Grid>
              ) : null}
              <Grid item xs={12} sm={employeeType === '본사' ? 6 : 6}>
                <FormControl fullWidth size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>상태</InputLabel>
                  <Select
                    name="empStatus"
                    value={formData.empStatus || '재직'}
                    label="상태"
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="재직">재직</MenuItem>
                    <MenuItem value="휴직">휴직</MenuItem>
                    <MenuItem value="퇴사">퇴사</MenuItem>
                    <MenuItem value="미승인">미승인</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* 3. 연락처 정보 섹션 */}
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
              {employeeType === '본사' ? (
                // 본사 직원용 연락처 필드
                <>
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
                </>
              ) : (
                // 점주용 연락처 필드
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="점주 연락처"
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
                      label="지점 연락처"
                      name="storeTel"
                      value={formData.storeTel || ''}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                      placeholder="02-0000-0000"
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="주소"
                  name="empAddr"
                  value={formData.empAddr}
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

            {/* 4. 급여 계좌 정보 섹션 */}
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                color: '#2563A6'
              }}
            >
              급여 계좌 정보
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>급여 은행</InputLabel>
                  <Select
                    name="empBank"
                    value={formData.empBank || 0}
                    label="급여 은행"
                    onChange={handleChange}
                  >
                    <MenuItem value={0}>선택 안함</MenuItem>
                    <MenuItem value={1}>국민은행</MenuItem>
                    <MenuItem value={2}>하나은행</MenuItem>
                    <MenuItem value={3}>신한은행</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="계좌번호"
                  name="empAcount"
                  value={formData.empAcount}
                  onChange={handleAccountChange}
                  variant="outlined"
                  size="small"
                  placeholder="0000-0000-0000"
                  disabled={formData.empBank === 0}
                  inputProps={{
                    maxLength: 20
                  }}
                />
              </Grid>
            </Grid>

            {/* 점주일 경우 지점 정보 섹션 추가 */}
            {employeeType === '점주' && (() => {
                // 이미 지점이 할당되었는지 여부 확인
                const isStoreAlreadyAssigned = 
                  (employee && employee.storeId && employee.storeId > 0) || 
                  (formData.storeId && formData.storeId > 0);

                return (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 'bold', 
                        mb: 2,
                        color: '#2563A6'
                      }}
                    >
                      지점 정보
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        {isStoreAlreadyAssigned ? (
                          // 이미 지점이 할당된 점주인 경우 지점 정보 표시 (수정 불가)
                          <TextField
                            fullWidth
                            label="지점명"
                            value={employee?.storeName || formData.storeName || '(지정된 지점)'}
                            variant="outlined"
                            size="small"
                            disabled
                            helperText={`매장 ID: ${employee?.storeId || formData.storeId || '알 수 없음'} - 이 점주에게 매장이 할당되어 있습니다.`}
                          />
                        ) : (
                          // 지점이 할당되지 않은 경우만 드롭다운으로 선택 가능
                          <FormControl fullWidth size="small" sx={{ minWidth: 180 }}>
                            <InputLabel>지점 선택</InputLabel>
                            <Select
                              name="storeId"
                              value={formData.storeId || ''}
                              label="지점 선택"
                              onChange={handleChange}
                            >
                              <MenuItem value="">
                                <em>지점 미지정</em>
                              </MenuItem>
                              {stores?.length > 0 ? 
                                stores.map(store => (
                                  <MenuItem key={store.storeId} value={store.storeId}>
                                    {store.storeName}
                                  </MenuItem>
                                )) : 
                                <MenuItem disabled>가용 지점이 없습니다</MenuItem>
                              }
                            </Select>
                            <FormHelperText>
                              {stores?.length > 0 ? '할당할 지점을 선택하세요' : '현재 할당 가능한 지점이 없습니다'}
                            </FormHelperText>
                          </FormControl>
                        )}
                      </Grid>
                    </Grid>
                  </>
                );
              })()
            }
          </Grid>
        </Grid>
        
        {/* 저장 버튼 - 오른쪽 하단으로 이동 */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          mt: 4 
        }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              width: '200px', 
              height: '45px',
              borderRadius: '20px',
              backgroundColor: '#2563A6',
              '&:hover': {
                backgroundColor: '#1E5187',
              },
              fontSize: '16px',
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              minWidth: '200px',
              maxWidth: '200px',
              flexShrink: 0,
              flexGrow: 0
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : '저장하기'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmployeeManagementCom; 