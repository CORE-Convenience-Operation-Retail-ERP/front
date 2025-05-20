// CORE-ERP-Frontend/src/containers/headquarters/board/BoardListCon.js
import React, { useState, useEffect } from 'react';
import { Box, Alert, CircularProgress } from '@mui/material';
import BoardList from '../../../components/headquarters/board/BoardList';
import BoardPost from '../../../components/headquarters/board/BoardPost';
import BoardComment from '../../../components/headquarters/board/BoardComment';
import { boardApi } from '../../../service/boardApi';

const BoardListCon = ({ boardType }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // 사용자 권한 확인
  useEffect(() => {
    // 두 가지 가능한 키로 권한을 확인 (userRole 또는 role)
    const role = localStorage.getItem('role') || localStorage.getItem('userRole');
    console.log('현재 사용자 권한:', role); // 디버깅용 로그 추가
    
    // 로컬스토리지의 모든 데이터 확인 (디버깅용)
    console.log('로컬스토리지 데이터:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      console.log(`${key}: ${localStorage.getItem(key)}`);
    }
    
    // JWT 토큰 디코딩 시도
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const parts = token.split('.');
        if (parts.length === 3) {
          const base64Url = parts[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const decoded = JSON.parse(jsonPayload);
          console.log('토큰에서 추출한 정보:', decoded);
          
          // 토큰에서 role 정보 사용 (localStorage에 없을 경우)
          if (!role && decoded.role) {
            console.log('토큰에서 권한 정보 사용:', decoded.role);
            setUserRole(decoded.role);
            return;
          }
        }
      }
    } catch (e) {
      console.error('토큰 디코딩 실패:', e);
    }
    
    setUserRole(role || '');
  }, []);

  // 게시글 목록 로드
  useEffect(() => {
    fetchPosts();
  }, [boardType]);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await boardApi.getBoardPosts(boardType);
      setPosts(data);
    } catch (err) {
      console.error('게시글 로드 실패:', err);
      setError('게시글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 관리자 권한 확인 (HQ_BR, HQ_BR_M, MASTER만 게시글 관리 가능)
  const canManage = () => {
    console.log('권한 확인 - 현재 역할:', userRole);
    const hasPermission = userRole === 'ROLE_HQ_BR' || 
                          userRole === 'ROLE_HQ_BR_M' || 
                          userRole === 'ROLE_MASTER';
    console.log('권한 확인 결과:', hasPermission);
    return hasPermission;
  };

  // 게시글 등록 모달 오픈
  const handleAddPost = (type) => {
    setSelectedPost(null);
    setPostDialogOpen(true);
  };

  // 게시글 수정 모달 오픈
  const handleEditPost = (post) => {
    setSelectedPost(post);
    setPostDialogOpen(true);
  };

  // 게시글 삭제
  const handleDeletePost = async (postId) => {
    try {
      await boardApi.deleteBoardPost(postId);
      // 성공적으로 삭제 후 목록 새로고침
      fetchPosts();
    } catch (err) {
      console.error('게시글 삭제 실패:', err);
      setError('게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  // 답변 등록 모달 오픈
  const handleAddComment = (post) => {
    setSelectedPost(post);
    setCommentDialogOpen(true);
  };

  // 게시글 등록/수정 제출
  const handlePostSubmit = async (formData) => {
    try {
      if (formData.postId) {
        // 게시글 수정
        await boardApi.updateBoardPost(formData.postId, formData);
      } else {
        // 게시글 등록
        formData.boardType = boardType;
        await boardApi.createBoardPost(formData);
      }
      // 성공적으로 등록/수정 후 목록 새로고침
      fetchPosts();
    } catch (err) {
      console.error('게시글 등록/수정 실패:', err);
      setError('게시글 등록/수정 중 오류가 발생했습니다.');
    }
  };

  // 답변 등록 제출
  const handleCommentSubmit = async (commentData) => {
    try {
      await boardApi.createBoardComment(commentData);
      // 성공적으로 답변 등록 후 목록 새로고침
      fetchPosts();
    } catch (err) {
      console.error('답변 등록 실패:', err);
      setError('답변 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <BoardList
          posts={posts}
          boardType={boardType}
          canManage={canManage()}
          onAddPost={handleAddPost}
          onEditPost={handleEditPost}
          onDeletePost={handleDeletePost}
          onAddComment={handleAddComment}
          search={searchTerm}
          onSearch={setSearchTerm}
        />
      )}

      {/* 게시글 등록/수정 모달 */}
      <BoardPost
        open={postDialogOpen}
        handleClose={() => setPostDialogOpen(false)}
        post={selectedPost}
        boardType={boardType}
        onSubmit={handlePostSubmit}
      />

      {/* 답변 등록 모달 */}
      <BoardComment
        open={commentDialogOpen}
        handleClose={() => setCommentDialogOpen(false)}
        post={selectedPost}
        onSubmit={handleCommentSubmit}
      />
    </>
  );
};

export default BoardListCon;