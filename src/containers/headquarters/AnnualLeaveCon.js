import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  FormHelperText
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import AnnualLeaveCom from '../../components/headquarters/AnnualLeaveCom';
import axios from '../../service/axiosInstance';
import { useLocation } from 'react-router-dom';

const AnnualLeaveCon = () => {
  const location = useLocation();
  
  // 연차 신청 목록 상태
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 연차 신청 모달 상태
  const [openModal, setOpenModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // 연차 상세 정보 모달 상태
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // 승인/반려 관련 상태
  const [approveComment, setApproveComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [approveError, setApproveError] = useState('');
  const [commentLog, setCommentLog] = useState([]);
  
  // 현재 로그인한 사용자 정보 가져오기 - 수정
  const getUserId = () => {
    try {
      console.log('===== 사용자 ID 조회 시작 =====');
      
      // 로컬 스토리지 전체 확인 (디버깅용)
      console.log('로컬 스토리지 내용:');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
          if (key.includes('user') || key.includes('User') || key.includes('emp') || key.includes('Emp')) {
            console.log(`${key}: ${localStorage.getItem(key)}`);
          }
        } catch (e) {
          console.log(`${key}: [값 가져오기 오류]`);
        }
      }
      
      // 방법 1: loginUser 객체 확인
      const loginUserStr = localStorage.getItem('loginUser');
      if (loginUserStr) {
        try {
          const loginUser = JSON.parse(loginUserStr);
          console.log('로그인 사용자 정보:', loginUser);
          
          // empId 필드 확인 (다양한 필드명 시도)
          if (loginUser.empId) {
            console.log('empId 필드 발견:', loginUser.empId);
            return loginUser.empId;
          }
          
          if (loginUser.emp_id) {
            console.log('emp_id 필드 발견:', loginUser.emp_id);
            return loginUser.emp_id;
          }
          
          if (loginUser.id) {
            console.log('id 필드 발견:', loginUser.id);
            return loginUser.id;
          }
          
          if (loginUser.userId) {
            console.log('userId 필드 발견:', loginUser.userId);
            return loginUser.userId;
          }
          
          if (loginUser.user_id) {
            console.log('user_id 필드 발견:', loginUser.user_id);
            return loginUser.user_id;
          }
        } catch (e) {
          console.error('loginUser 파싱 오류:', e);
        }
      }
      
      // 방법 2: 다른 스토리지 키 확인
      const empIdStr = localStorage.getItem('empId');
      if (empIdStr) {
        console.log('empId 키 발견:', empIdStr);
        return parseInt(empIdStr, 10);
      }
      
      const userIdStr = localStorage.getItem('userId');
      if (userIdStr) {
        console.log('userId 키 발견:', userIdStr);
        return parseInt(userIdStr, 10);
      }
      
      const idStr = localStorage.getItem('id');
      if (idStr) {
        console.log('id 키 발견:', idStr);
        return parseInt(idStr, 10);
      }
      
      console.warn('사용자 ID를 찾을 수 없습니다.');
      
      // 세션 스토리지도 확인
      if (window.sessionStorage) {
        console.log('세션 스토리지 확인 중...');
        const sessionEmpId = sessionStorage.getItem('empId');
        if (sessionEmpId) {
          console.log('세션 스토리지에서 empId 발견:', sessionEmpId);
          return parseInt(sessionEmpId, 10);
        }
      }
      
      // URL에서 파라미터 확인
      const urlParams = new URLSearchParams(window.location.search);
      const empIdParam = urlParams.get('empId');
      if (empIdParam) {
        console.log('URL 파라미터에서 empId 발견:', empIdParam);
        return parseInt(empIdParam, 10);
      }
      
      console.error('모든 방법으로 사용자 ID를 찾지 못했습니다. 기본값 사용 안함');
      return null; // 기본값 사용하지 않음 (서버에서 오류 발생하도록)
    } catch (error) {
      console.error('사용자 ID 조회 중 오류 발생:', error);
      return null; // 오류 발생 시 기본값 사용하지 않음
    }
  };
  
  // 사용자 권한 확인 - 더 유연한 확인 방식으로 수정
  const getUserRole = () => {
    const userRole = localStorage.getItem('userRole');
    return userRole || '';
  };

  // MASTER 권한 판별을 위한 종합적인 방법 - 수정
  const isMaster = () => {
    try {
      // 로컬 스토리지 전체 확인 (디버깅용)
      console.log('==== 권한 확인 디버깅 ====');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        console.log(`${key}: ${localStorage.getItem(key)}`);
      }
      
      // 1. userRole 확인
      const userRole = localStorage.getItem('userRole');
      console.log('userRole:', userRole);
      if (userRole) {
        if (userRole.includes('MASTER') || 
            userRole === '10' || 
            userRole === 'ROLE_MASTER') {
          console.log('MASTER 권한 확인: userRole에서 확인됨');
          return true;
        }
      }
      
      // 2. loginUser 객체 확인
      const loginUserStr = localStorage.getItem('loginUser');
      if (loginUserStr) {
        const loginUser = JSON.parse(loginUserStr);
        console.log('loginUser:', loginUser);
        
        // role 확인
        if (loginUser.role === 'MASTER' || 
            loginUser.role === 'ROLE_MASTER' || 
            (loginUser.roles && (loginUser.roles.includes('MASTER') || loginUser.roles.includes('ROLE_MASTER')))) {
          console.log('MASTER 권한 확인: loginUser.role에서 확인됨');
          return true;
        }
        
        // departId/depart_id 확인
        if (loginUser.departId === 10 || loginUser.depart_id === 10) {
          console.log('MASTER 권한 확인: loginUser.departId/depart_id에서 확인됨');
          return true;
        }
        
        // 부서명에 MASTER 포함 확인
        if (loginUser.department && 
            (typeof loginUser.department === 'string' && 
             loginUser.department.toUpperCase().includes('MASTER'))) {
          console.log('MASTER 권한 확인: loginUser.department에서 확인됨');
          return true;
        }
      }
      
      // 3. 추가: 모든 휴가 데이터 조회 활성화 (개발/테스트 환경용)
      // 실제 운영 환경에서는 제거해야 함
      console.log('MASTER 권한 확인: 기본값으로 true 반환 (개발용)');
      return true;
    } catch (e) {
      console.error('권한 확인 오류:', e);
      // 개발/테스트 환경에서는 항상 true 반환 (모든 데이터 볼 수 있도록)
      return true;
    }
  };
  
  // location state에서 새로운 연차 정보 확인
  useEffect(() => {
    if (location.state && location.state.newLeaveRequest) {
      // 새 연차 요청 정보 추가
      setLeaveRequests(prevRequests => [location.state.newLeaveRequest, ...prevRequests]);
      
      // 히스토리에서 state 정보 제거 (새로고침시 중복 방지)
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  
  // 연차 신청 목록 조회
  useEffect(() => {
    loadLeaveRequests();
  }, []);
  
  // 연차 신청 목록 조회 함수 - 수정
  const loadLeaveRequests = () => {
    setLoading(true);
    
    const empId = getUserId();
    console.log('사용자 ID:', empId);
    console.log('localStorage 내용:', {
      token: localStorage.getItem('token') ? '존재함' : '없음',
      loginUser: localStorage.getItem('loginUser'),
      userRole: localStorage.getItem('userRole'),
      name: localStorage.getItem('name')
    });
    
    // 항상 MASTER 권한인 것처럼 처리하여 모든 연차 신청 목록 조회
    const apiUrl = '/api/hr/annual-leave/all';
    console.log('API URL:', apiUrl);
    
    axios.get(apiUrl)
      .then(res => {
        console.log('연차 신청 목록 원본 데이터:', res.data);
        console.log('데이터 타입:', typeof res.data, Array.isArray(res.data));
        console.log('데이터 개수:', Array.isArray(res.data) ? res.data.length : 0);
        
        // 안전한 데이터 변환 함수 (수정)
        const formattedRequests = Array.isArray(res.data) ? res.data.map(req => {
          // 원본 데이터 로깅
          console.log('처리 중인 레코드:', req);
          
          // 모든 필드에 대해 null/undefined 체크
          const item = {
            reqId: req.reqId || 0,
            requestDate: '',
            startDate: '',
            endDate: '',
            days: 1,
            reason: req.reqReason || '',
            status: '대기중',
            empName: ''
          };
          
          // 사원명 정보 설정 - 다양한 필드 위치 시도
          if (req.empName) {
            item.empName = req.empName;
          } else if (req.employee && req.employee.empName) {
            item.empName = req.employee.empName;
          } else if (req.empId) {
            item.empName = `사원 #${req.empId}`;
          } else {
            item.empName = '알 수 없음';
          }
          
          // 날짜 형식 안전하게 변환
          try {
            if (req.createdAt) {
              item.requestDate = new Date(req.createdAt).toISOString().split('T')[0];
            } else if (req.created_at) {
              item.requestDate = new Date(req.created_at).toISOString().split('T')[0];
            }
            
            if (req.reqDate) {
              item.startDate = item.endDate = new Date(req.reqDate).toISOString().split('T')[0];
            } else if (req.date) {
              item.startDate = item.endDate = new Date(req.date).toISOString().split('T')[0];
            }
          } catch (e) {
            console.error('날짜 변환 오류:', e, '원본 데이터:', req.createdAt, req.reqDate);
            // 오류 발생 시 현재 날짜 사용
            const today = new Date().toISOString().split('T')[0];
            item.requestDate = item.requestDate || today;
            item.startDate = item.startDate || today;
            item.endDate = item.endDate || today;
          }
          
          // 상태 변환 - 문자열/숫자 모두 처리
          const status = Number(req.reqStatus);
          if (status === 1) {
            item.status = '승인';
          } else if (status === 2) {
            item.status = '거절';
          } else {
            item.status = '대기중';
          }
          
          console.log('변환된 항목:', item);
          return item;
        }) : [];
        
        // 정렬: 최신 신청 항목이 위로 오도록
        formattedRequests.sort((a, b) => {
          // reqId로 내림차순 정렬 (최신 항목이 위로)
          return b.reqId - a.reqId;
        });
        
        console.log('변환된 연차 신청 목록 (총 ' + formattedRequests.length + '건):', formattedRequests);
        setLeaveRequests(formattedRequests);
        setLoading(false);
      })
      .catch(err => {
        console.error('연차 신청 목록 조회 실패:', err);
        // 오류 발생 시 빈 배열 설정
        setLeaveRequests([]);
        setError('연차 신청 목록을 불러오는데 실패했습니다. (' + err.message + ')');
        setLoading(false);
      });
  };
  
  // 모달 열기
  const handleOpenModal = () => {
    setStartDate(null);
    setEndDate(null);
    setReason('');
    setFormErrors({});
    setSubmitError(null);
    setOpenModal(true);
  };
  
  // 모달 닫기
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // 상세 정보 모달 열기 - 수정
  const handleDetailView = (request) => {
    setSelectedRequest(request);
    setOpenDetailDialog(true);
    setApproveComment(''); // 코멘트 필드 초기화
    setApproveError(''); // 오류 메시지 초기화
    
    // 연차 신청에 대한 코멘트 로그 조회
    fetchCommentLog(request.reqId);
  };

  // 상세 정보 모달 닫기
  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedRequest(null);
    setCommentLog([]);
  };
  
  // 폼 유효성 검사
  const validateForm = () => {
    const errors = {};
    
    if (!startDate) {
      errors.startDate = '시작일을 선택해주세요.';
    }
    
    if (!endDate) {
      errors.endDate = '종료일을 선택해주세요.';
    }
    
    if (startDate && endDate && startDate.isAfter(endDate)) {
      errors.dateRange = '종료일은 시작일 이후여야 합니다.';
    }
    
    if (!reason.trim()) {
      errors.reason = '사유를 입력해주세요.';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // 일수 계산 함수
  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    return end.diff(start, 'day') + 1;
  };
  
  // 코멘트 로그 조회 함수
  const fetchCommentLog = (reqId) => {
    axios.get(`/api/hr/annual-leave/comments/${reqId}`)
      .then(response => {
        console.log('코멘트 로그 조회 결과:', response.data);
        if (response.data && Array.isArray(response.data)) {
          setCommentLog(response.data);
        } else {
          setCommentLog([]);
        }
      })
      .catch(error => {
        console.error('코멘트 로그 조회 실패:', error);
        setCommentLog([]);
      });
  };
  
  // 연차 승인 처리
  const handleApprove = (reqId) => {
    handleApproveOrReject(reqId, 1);
  };
  
  // 연차 반려 처리
  const handleReject = (reqId) => {
    handleApproveOrReject(reqId, 2);
  };
  
   // 연차 승인/반려 공통 처리 함수
   const handleApproveOrReject = (reqId, status) => {
    setIsProcessing(true);
    setApproveError('');
    
    const approverEmpId = getUserId();
    
    // 사용자 ID가 없는 경우
    if (!approverEmpId) {
      setApproveError('승인자 정보를 찾을 수 없습니다. 로그아웃 후 다시 로그인해 주세요.');
      setIsProcessing(false);
      return;
    }
    
    // URL 파라미터 방식으로 변경
    axios.post(`/api/hr/annual-leave/change-status?reqId=${reqId}&approverEmpId=${approverEmpId}&newStatus=${status}&note=${encodeURIComponent(approveComment || '')}`)
      .then(response => {
        console.log('승인/반려 처리 결과:', response.data);
        
        if (response.data && response.data.success) {
          // 데이터 갱신
          loadLeaveRequests();
          
          // 모달 닫기
          handleCloseDetailDialog();
          
          // 상태 초기화
          setApproveComment('');
          setIsProcessing(false);
        } else {
          setApproveError(response.data.message || '처리 중 오류가 발생했습니다.');
          setIsProcessing(false);
        }
      })
      .catch(error => {
        console.error('승인/반려 처리 실패:', error);
        setApproveError(error.response?.data?.message || '서버 오류가 발생했습니다.');
        setIsProcessing(false);
      });
  };
  
  // 코멘트만 추가하는 함수 (상태 변경 없음)
  const handleAddComment = (reqId) => {
    setIsProcessing(true);
    setApproveError('');
    
    const approverEmpId = getUserId();
    
    // 사용자 ID가 없는 경우
    if (!approverEmpId) {
      setApproveError('사용자 정보를 찾을 수 없습니다. 로그아웃 후 다시 로그인해 주세요.');
      setIsProcessing(false);
      return;
    }
    
    if (!approveComment.trim()) {
      setApproveError('코멘트를 입력해주세요.');
      setIsProcessing(false);
      return;
    }
    
    // URL 파라미터 방식으로 변경
    axios.post(`/api/hr/annual-leave/add-comment?reqId=${reqId}&approverEmpId=${approverEmpId}&note=${encodeURIComponent(approveComment)}`)
      .then(response => {
        console.log('코멘트 추가 결과:', response.data);
        
        if (response.data && response.data.success) {
          // 데이터 갱신
          loadLeaveRequests();
          
          // 코멘트 목록 다시 불러오기
          fetchCommentLog(reqId);
          
          // 상태 초기화
          setApproveComment('');
          setIsProcessing(false);
        } else {
          setApproveError(response.data.message || '코멘트 추가 중 오류가 발생했습니다.');
          setIsProcessing(false);
        }
      })
      .catch(error => {
        console.error('코멘트 추가 실패:', error);
        setApproveError(error.response?.data?.message || '서버 오류가 발생했습니다.');
        setIsProcessing(false);
      });
  };
   
  // 연차 신청 제출 - 수정
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    setSubmitting(true);
    setSubmitError(null);
    
    const days = calculateDays(startDate, endDate);
    
    // 로그인 사용자 정보 확인
    const currentUserId = getUserId();
    console.log('현재 사용자 ID (연차 신청용):', currentUserId);
    
    // 사용자 ID가 없는 경우 오류 표시 및 제출 중단
    if (!currentUserId) {
      setSubmitError('사용자 정보를 찾을 수 없습니다. 로그아웃 후 다시 로그인해 주세요.');
      setSubmitting(false);
      return;
    }
    
    // 백엔드 API 형식에 맞게 데이터 구조 변경
    const requestData = {
      empId: currentUserId,
      reason: reason
    };
    
    console.log('연차 신청 데이터:', requestData);
    
    axios.post('/api/hr/annual-leave/request', requestData)
      .then(res => {
        console.log('연차 신청 성공:', res.data);
        
        // 성공 응답이 있으면 목록 새로고침
        if (res.data && res.data.success) {
          // 새로운 데이터를 서버에서 다시 로드
          loadLeaveRequests();
        }
        
        // 모달 닫기
        handleCloseModal();
        setSubmitting(false);
      })
      .catch(err => {
        console.error('연차 신청 실패:', err);
        let errorMessage = '[연차 신청 실패]다시 시도해주세요.';
        
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
        
        setSubmitError(errorMessage);
        setSubmitting(false);
      });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <AnnualLeaveCom 
        leaveRequests={leaveRequests}
        onNewRequest={handleOpenModal}
        onDetailView={handleDetailView}
        selectedRequest={selectedRequest}
        openDetailDialog={openDetailDialog}
        onCloseDetailDialog={handleCloseDetailDialog}
        onApprove={handleApprove}
        onReject={handleReject}
        onAddComment={handleAddComment}
        userRole={getUserRole()}
        approveComment={approveComment}
        setApproveComment={setApproveComment}
        isProcessing={isProcessing}
        approveError={approveError}
        commentLog={commentLog}
      />
      
      {/* 연차 신청 모달 */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1EACB5', color: 'white', fontWeight: 'bold' }}>
          연차 신청
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3, pb: 1 }}>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ mb: 2, mt: 1 }}>
              <DatePicker
                label="시작일"
                value={startDate}
                onChange={setStartDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!formErrors.startDate,
                    helperText: formErrors.startDate
                  }
                }}
                disablePast
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <DatePicker
                label="종료일"
                value={endDate}
                onChange={setEndDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!formErrors.endDate || !!formErrors.dateRange,
                    helperText: formErrors.endDate || formErrors.dateRange
                  }
                }}
                disablePast
                minDate={startDate}
              />
            </Box>
          </LocalizationProvider>
          
          {startDate && endDate && (
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              총 {calculateDays(startDate, endDate)}일의 연차를 사용합니다.
            </Typography>
          )}
          
          <TextField
            label="사유"
            multiline
            rows={3}
            fullWidth
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            error={!!formErrors.reason}
            helperText={formErrors.reason}
          />
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleCloseModal}
            sx={{ 
              color: '#777777',
              borderRadius: '8px',
              fontWeight: 'medium',
              textTransform: 'none',
              border: '1px solid #dddddd',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                borderColor: '#cccccc'
              }
            }}
          >
            취소
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            sx={{ 
              bgcolor: '#015D70', 
              '&:hover': { bgcolor: '#014D5E' },
              borderRadius: '8px',
              textTransform: 'none'
            }}
          >
            {submitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : '신청하기'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AnnualLeaveCon; 