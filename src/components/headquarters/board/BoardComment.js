// CORE-ERP-Frontend/src/components/headquarters/board/BoardComment.js
import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Typography, Box
} from '@mui/material';
import { format } from 'date-fns';

const BoardComment = ({ 
  open, 
  handleClose, 
  post,
  onSubmit 
}) => {
  const [comContent, setComContent] = useState('');
  const [contentError, setContentError] = useState(false);

  const handleChange = (e) => {
    setComContent(e.target.value);
    setContentError(e.target.value.trim() === '');
  };

  const handleSubmit = () => {
    if (!comContent.trim()) {
      setContentError(true);
      return;
    }
    
    onSubmit({
      postId: post.postId,
      comContent
    });
    
    setComContent('');
    setContentError(false);
    handleClose();
  };

  if (!post) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold" color="primary">
          답변 등록
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            {post.boardTitle}
          </Typography>
          <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
              {post.boardContent}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              작성자: {post.empName} | 작성일: {format(new Date(post.boardCreatedAt), 'yyyy-MM-dd HH:mm')}
            </Typography>
          </Box>
          <TextField
            autoFocus
            margin="dense"
            label="답변 내용"
            multiline
            rows={6}
            fullWidth
            value={comContent}
            onChange={handleChange}
            error={contentError}
            helperText={contentError ? "답변 내용을 입력해주세요" : ""}
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="inherit" variant="outlined">취소</Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          disableElevation
        >
          등록
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BoardComment;