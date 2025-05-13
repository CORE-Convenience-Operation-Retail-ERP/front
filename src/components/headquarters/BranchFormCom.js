import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
  Tooltip,
  Container
} from '@mui/material';
import AddressSearch from '../common/AddressSearch';
import StoreIcon from '@mui/icons-material/Store';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import StorefrontIcon from '@mui/icons-material/Storefront';

const BranchFormCom = ({
  formData,
  onChange,
  onSubmit,
  isEdit,
  loading,
  error,
  onCancel,
  onAddressSelect,
  detailAddress,
  onDetailAddressChange
}) => {
  const statusOptions = [
    { value: 1, label: '영업중' },
    { value: 2, label: '휴업' },
    { value: 3, label: '폐업' }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={4}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ 
            bgcolor: 'primary.main', 
            color: 'primary.contrastText', 
            p: 3,
            borderRadius: '4px 4px 0 0',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <BusinessIcon fontSize="large" />
            <Typography variant="h4" component="h1" fontWeight="bold">
              {isEdit ? '지점 정보 수정' : '새 지점 등록'}
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 4, fontSize: '1.1rem' }}>
                {error}
              </Alert>
            )}

            <form onSubmit={onSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* 기본 정보 섹션 */}
                <Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom color="primary.dark" sx={{ mb: 2 }}>
                    기본 정보
                  </Typography>
                  <Divider sx={{ mb: 3, borderWidth: 2 }} />
                
                  {/* 지점명 */}
                  <Box sx={{ mb: 4 }}>
                    <TextField
                      fullWidth
                      label="지점명"
                      name="storeName"
                      value={formData.storeName || ''}
                      onChange={onChange}
                      required
                      disabled={loading}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <StoreIcon color="primary" fontSize="large" />
                          </InputAdornment>
                        ),
                      }}
                      helperText="지점의 공식 상호명을 입력해주세요"
                      sx={{ fontSize: '1.2rem' }}
                    />
                  </Box>

                  {/* 전화번호 */}
                  <Box sx={{ mb: 4 }}>
                    <TextField
                      fullWidth
                      label="전화번호"
                      name="storeTel"
                      value={formData.storeTel || ''}
                      onChange={onChange}
                      required
                      disabled={loading}
                      placeholder="02-1234-5678"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color="primary" fontSize="large" />
                          </InputAdornment>
                        ),
                      }}
                      helperText="하이픈(-)을 포함한 전화번호를 입력해주세요"
                    />
                  </Box>
                </Box>

                {/* 위치 정보 섹션 */}
                <Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom color="primary.dark" sx={{ mb: 2, mt: 2 }}>
                    위치 정보
                  </Typography>
                  <Divider sx={{ mb: 3, borderWidth: 2 }} />

                  <Box sx={{ mb: 4 }}>
                    <AddressSearch
                      value={formData.storeAddr || ''}
                      onChange={onChange}
                      onSelect={onAddressSelect}
                      detailAddress={detailAddress}
                      onDetailAddressChange={onDetailAddressChange}
                    />
                  </Box>
                </Box>

                {/* 영업 상태 섹션 */}
                <Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom color="primary.dark" sx={{ mb: 2, mt: 2 }}>
                    영업 상태
                  </Typography>
                  <Divider sx={{ mb: 3, borderWidth: 2 }} />

                  <Box sx={{ mb: 4 }}>
                    <TextField
                      fullWidth
                      select
                      label="영업 상태"
                      name="storeStatus"
                      value={formData.storeStatus || 1}
                      onChange={onChange}
                      required
                      disabled={loading}
                      variant="outlined"
                      helperText="현재 지점의 영업 상태를 선택해주세요"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <StorefrontIcon color="primary" fontSize="large" />
                          </InputAdornment>
                        ),
                      }}
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Box>

                {/* 버튼 영역 */}
                <Box>
                  <Divider sx={{ my: 3, borderWidth: 1 }} />
                  <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 4 }}>
                    <Button
                      variant="outlined"
                      onClick={onCancel}
                      disabled={loading}
                      startIcon={<CancelIcon />}
                      size="large"
                      sx={{ 
                        fontSize: '1.1rem', 
                        py: 1.5, 
                        px: 4, 
                        borderRadius: 2,
                        border: '2.2px solid #e0e0e0',
                  
                        bgcolor: '#f5f5f5',
                        color: '#666666',
                        borderColor: '#e0e0e0',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        '&:hover': {
                          bgcolor: '#e0e0e0',
                          borderColor: '#e0e0e0',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      취소
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={24} /> : <SaveIcon />}
                      size="large"
                      sx={{ fontSize: '1.1rem', py: 1.5, px: 4, borderRadius: 2 }}
                    >
                      {isEdit ? '수정 완료' : '지점 등록'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </form>
          </Box>
        </CardContent>
      </Card>

      {/* 도움말 카드 */}
      <Card elevation={2} sx={{ mt: 4, bgcolor: 'info.lighter' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" color="info.dark" gutterBottom>
            <strong>도움말</strong>
          </Typography>
          <Typography variant="body1" color="info.dark">
            • 지점명은 고객에게 노출되는 공식 명칭으로 사용됩니다.<br />
            • 주소는 실제 매장 위치를 지도에서 정확히 표시하기 위해 필요합니다.<br />
            • 상세 주소까지 정확히 입력하면 배송 및 방문에 도움이 됩니다.<br />
            • 전화번호는 고객 문의를 받을 수 있는 대표 연락처를 입력해주세요.<br />
            • 영업 상태 변경 시 매장 운영 정보가 자동으로 업데이트됩니다.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BranchFormCom; 