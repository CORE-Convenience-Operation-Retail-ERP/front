import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  CircularProgress,
  Paper
} from '@mui/material';
import axios from '../../../../service/axiosInstance';
import { useNavigate } from 'react-router-dom';

// 게시판 타입 정의
const boardTypes = {
  1: { name: '공지', path: '/headquarters/board/notice' },
  2: { name: '건의', path: '/headquarters/board/suggestions' },
  3: { name: '문의', path: '/headquarters/board/store-inquiries' }
};

const BoardWidget = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 최근 게시글 로드
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await axios.get('/api/headquarters/board/recent');
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('최근 게시글 로드 오류:', err);
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  // 게시글 클릭 핸들러
  const handlePostClick = (post) => {
    const boardType = post.boardType;
    const boardPath = boardTypes[boardType]?.path || '/headquarters/dashboard';
    navigate(`${boardPath}?postId=${post.postId}`);
  };

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <Paper 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 2,
        elevation: 3,
        boxShadow: 3
      }}
    >
      <Box 
        sx={{ 
          p: 1.5, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #eee',
          bgcolor: 'primary.light',
          color: 'white'
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontSize: '1rem' }}>
          최근 게시글
        </Typography>
      </Box>
      
      <Box sx={{ p: 1.5, flexGrow: 1, overflow: 'visible' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80%' }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ textAlign: 'center', mt: 2 }}>
            {error}
          </Typography>
        ) : (
          <List disablePadding>
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <React.Fragment key={post.postId}>
                  <ListItem 
                    button 
                    onClick={() => handlePostClick(post)}
                    sx={{ 
                      px: 1,
                      py: 0.3,
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography 
                            variant="body2" 
                            component="span"
                            sx={{ 
                              color: 'black',
                              bgcolor: 'primary.light',
                              px: 0.7,
                              py: 0.2,
                              borderRadius: 1,
                              fontSize: '0.7rem',
                              mr: 1
                            }}
                          >
                            {boardTypes[post.boardType]?.name || '게시판'}
                          </Typography>
                          <Typography 
                            variant="body2"
                            noWrap
                            sx={{ 
                              maxWidth: '180px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {post.boardTitle}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.3 }}>
                          <Typography variant="caption" component="span">
                            {formatDate(post.boardCreatedAt)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < posts.length - 1 && <Divider />}
                </React.Fragment>
              ))
            ) : (
              <Typography sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
                최근 게시글이 없습니다.
              </Typography>
            )}
          </List>
        )}
      </Box>
    </Paper>
  );
};

export default BoardWidget; 