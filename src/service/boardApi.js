// CORE-ERP-Frontend/src/service/boardApi.js
import axios from './axiosInstance';

export const boardApi = {
  // 게시판 타입별 게시글 목록 조회
  getBoardPosts: async (boardType) => {
    try {
      const response = await axios.get(`/api/headquarters/board/${boardType}`);
      return response.data;
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error);
      throw error;
    }
  },
  
  // 게시글 단일 조회
  getBoardPost: async (postId) => {
    try {
      const response = await axios.get(`/api/headquarters/board/post/${postId}`);
      return response.data;
    } catch (error) {
      console.error('게시글 조회 실패:', error);
      throw error;
    }
  },
  
  // 게시글 등록
  createBoardPost: async (postData) => {
    try {
      const response = await axios.post('/api/headquarters/board/write', postData);
      return response.data;
    } catch (error) {
      console.error('게시글 등록 실패:', error);
      throw error;
    }
  },
  
  // 게시글 수정
  updateBoardPost: async (postId, postData) => {
    try {
      const response = await axios.put(`/api/headquarters/board/write/${postId}`, postData);
      return response.data;
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      throw error;
    }
  },
  
  // 게시글 삭제
  deleteBoardPost: async (postId) => {
    try {
      await axios.delete(`/api/headquarters/board/write/${postId}`);
      return true;
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      throw error;
    }
  },
  
  // 게시글 답변 등록
  createBoardComment: async (commentData) => {
    try {
      const response = await axios.post('/api/headquarters/board/comment', commentData);
      return response.data;
    } catch (error) {
      console.error('답변 등록 실패:', error);
      throw error;
    }
  }
};