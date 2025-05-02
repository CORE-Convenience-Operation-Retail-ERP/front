// CORE-ERP-Frontend/src/components/headquarters/board/BoardList.js
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Collapse, Box, Typography, Button, Chip,
  IconButton, Pagination, Stack
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { format } from 'date-fns';

// 게시글 행 컴포넌트
const BoardRow = ({ post, canManage, onAddComment, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const hasComment = post.hasComment && post.comments && post.comments.length > 0;
  
  return (
    <>
      <TableRow 
        sx={{ 
          '& > *': { borderBottom: 'unset' }, 
          cursor: 'pointer',
          '&:hover': { backgroundColor: '#f5f5f5' }
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell>{post.postId}</TableCell>
        <TableCell>{post.empName}</TableCell>
        <TableCell>
          {post.boardTitle}
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{format(new Date(post.boardCreatedAt), 'yyyy-MM-dd')}</TableCell>
        <TableCell>
          {post.boardType > 1 && (
            hasComment ? 
              <Chip label="답변완료" color="success" size="small" /> : 
              <Chip label="답변대기" color="warning" size="small" />
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom component="div">
                {post.boardTitle}
              </Typography>
              <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {post.boardContent}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  작성자: {post.empName} | 작성일: {format(new Date(post.boardCreatedAt), 'yyyy-MM-dd HH:mm')}
                </Typography>
              </Box>
              
              {hasComment && (
                <Box sx={{ ml: 3, mb: 2 }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    답변
                  </Typography>
                  {post.comments.map(comment => (
                    <Box key={comment.commentId} sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                        {comment.comContent}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                        답변자: {comment.empName || '관리자'} | 
                        답변일: {format(new Date(comment.comCreatedAt), 'yyyy-MM-dd HH:mm')}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
              
              {canManage && (
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                  {!hasComment && post.boardType > 1 && (
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddComment(post);
                      }}
                      sx={{ mr: 1 }}
                    >
                      답변등록
                    </Button>
                  )}
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(post);
                    }}
                    sx={{ mr: 1 }}
                  >
                    수정
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('정말로 삭제하시겠습니까?')) {
                        onDelete(post.postId);
                      }
                    }}
                  >
                    삭제
                  </Button>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

// 게시판 목록 컴포넌트
const BoardList = ({ 
  posts, 
  boardType, 
  canManage, 
  onAddPost, 
  onEditPost, 
  onDeletePost, 
  onAddComment 
}) => {
  const boardTypeToTitle = {
    1: '공지사항',
    2: '건의사항',
    3: '점포 문의사항'
  };
  
  // 페이징 관련 상태
  const postsPerPage = 10;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(posts.length / postsPerPage);
  
  // 현재 페이지에 해당하는 posts만 필터링
  const displayedPosts = posts.slice(
    (page - 1) * postsPerPage,
    page * postsPerPage
  );
  
  // 페이지 변경 핸들러
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Typography variant="h5" component="div" fontWeight="bold" color="primary">
          {boardTypeToTitle[boardType] || '게시판'}
        </Typography>
        {(canManage || boardType > 1) && (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => onAddPost(boardType)}
          >
            글쓰기
          </Button>
        )}
      </Box>
      
      <TableContainer component={Paper} sx={{ mb: 4, boxShadow: 3 }}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f0f7ff' }}>
              <TableCell width="10%">번호</TableCell>
              <TableCell width="15%">작성자</TableCell>
              <TableCell width="50%">제목</TableCell>
              <TableCell width="15%">작성일</TableCell>
              <TableCell width="10%">상태</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedPosts.length > 0 ? (
              displayedPosts.map((post) => (
                <BoardRow 
                  key={post.postId} 
                  post={post} 
                  canManage={canManage}
                  onAddComment={onAddComment}
                  onEdit={onEditPost}
                  onDelete={onDeletePost}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  게시글이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* 페이지네이션 */}
      {posts.length > 0 && (
        <Stack spacing={2} alignItems="center" sx={{ mt: 3, mb: 3 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
            showFirstButton 
            showLastButton
          />
        </Stack>
      )}
    </Box>
  );
};

export default BoardList;