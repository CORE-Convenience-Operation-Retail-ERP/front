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
  Alert
} from '@mui/material';

const BranchFormCom = ({
  formData,
  onChange,
  onSubmit,
  isEdit,
  loading,
  error,
  onCancel
}) => {
  const statusOptions = [
    { value: 1, label: '영업중' },
    { value: 2, label: '휴업' },
    { value: 3, label: '폐업' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {isEdit ? '지점 정보 수정' : '새 지점 추가'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="지점명"
                name="storeName"
                value={formData.storeName || ''}
                onChange={onChange}
                required
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="전화번호"
                name="storeTel"
                value={formData.storeTel || ''}
                onChange={onChange}
                required
                disabled={loading}
                placeholder="02-1234-5678"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="주소"
                name="storeAddr"
                value={formData.storeAddr || ''}
                onChange={onChange}
                required
                disabled={loading}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="영업 상태"
                name="storeStatus"
                value={formData.storeStatus || 1}
                onChange={onChange}
                required
                disabled={loading}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  disabled={loading}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} />}
                >
                  {isEdit ? '수정하기' : '추가하기'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default BranchFormCom; 