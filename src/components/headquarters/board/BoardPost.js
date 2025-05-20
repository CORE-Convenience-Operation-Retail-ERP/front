// CORE-ERP-Frontend/src/components/headquarters/board/BoardPost.js
import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, FormControl, InputLabel, Select, MenuItem,
  Typography, Box
} from '@mui/material';

const BoardPost = ({ 
  open, 
  handleClose, 
  post = null, 
  boardType = 1, 
  onSubmit 
}) => {
  const [form, setForm] = useState({
    postId: null,
    boardType: boardType,
    boardTitle: '',
    boardContent: ''
  });
  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);

  useEffect(() => {
    if (post) {
      setForm({
        postId: post.postId,
        boardType: post.boardType,
        boardTitle: post.boardTitle,
        boardContent: post.boardContent
      });
      setTitleError(false);
      setContentError(false);
    } else {
      setForm({
        postId: null,
        boardType: boardType,
        boardTitle: '',
        boardContent: ''
      });
      setTitleError(false);
      setContentError(false);
    }
  }, [post, boardType, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (name === 'boardTitle') {
      setTitleError(value.trim() === '');
    } else if (name === 'boardContent') {
      setContentError(value.trim() === '');
    }
  };

  const handleSubmit = () => {
    const titleValid = form.boardTitle.trim() !== '';
    const contentValid = form.boardContent.trim() !== '';
    
    setTitleError(!titleValid);
    setContentError(!contentValid);
    
    if (!titleValid || !contentValid) {
      return;
    }
    
    onSubmit(form);
    handleClose();
  };

  const isEditMode = !!post;
  const title = isEditMode ? '게시글 수정' : '게시글 등록';
  const boardTypeText = {
    1: '공지사항',
    2: '건의사항',
    3: '점포 문의사항'
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography sx={{
          fontWeight: 'bold',
          fontSize: 30,
          color: '#2563A6',
          letterSpacing: '-1px',
          ml: 15
        }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <TextField
            margin="dense"
            label="게시판 유형"
            value={boardTypeText[form.boardType] || ''}
            fullWidth
            disabled
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <TextField
            autoFocus
            margin="dense"
            name="boardTitle"
            label="제목"
            type="text"
            fullWidth
            value={form.boardTitle}
            onChange={handleChange}
            error={titleError}
            helperText={titleError ? "제목을 입력해주세요" : ""}
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <TextField
            margin="dense"
            name="boardContent"
            label="내용"
            multiline
            rows={8}
            fullWidth
            value={form.boardContent}
            onChange={handleChange}
            error={contentError}
            helperText={contentError ? "내용을 입력해주세요" : ""}
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
          {isEditMode ? '수정' : '등록'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BoardPost;