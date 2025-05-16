import axios from 'axios';

const API_URL = 'http://localhost:8080/api/chat';

// 채팅 알림 상태 저장소
let unreadMessagesByRoom = {}; // 채팅방별 안 읽은 메시지 수 저장
let unreadMessageCallbacks = [];

// 로컬 스토리지에서 알림 상태 초기화
function initializeFromLocalStorage() {
  try {
    const savedUnreadMessages = localStorage.getItem('chat_unread_by_room');
    if (savedUnreadMessages) {
      unreadMessagesByRoom = JSON.parse(savedUnreadMessages) || {};
      console.log('로컬 스토리지에서 채팅 알림 상태 불러옴:', unreadMessagesByRoom);
    } else {
      console.log('로컬 스토리지에 저장된 채팅 알림 상태 없음');
      unreadMessagesByRoom = {};
    }
  } catch (e) {
    console.error('로컬 스토리지 읽기 오류:', e);
    unreadMessagesByRoom = {};
  }
}

// 초기화 실행
initializeFromLocalStorage();

class ChatService {
  constructor() {
    // 생성자에서도 로컬 스토리지에서 상태 초기화
    initializeFromLocalStorage();
    console.log('ChatService 초기화 완료, 현재 알림 상태:', unreadMessagesByRoom);
  }

  // 채팅방 목록 조회
  getChatRooms() {
    return axios.get(`${API_URL}/rooms`, {
      headers: this.getAuthHeader()
    });
  }

  // 채팅방 생성
  createChatRoom(roomName, roomType, memberIds) {
    return axios.post(`${API_URL}/rooms`, {
      roomName,
      roomType,
      memberIds
    }, {
      headers: this.getAuthHeader()
    });
  }

  // 특정 채팅방 정보 조회
  getChatRoom(roomId) {
    return axios.get(`${API_URL}/rooms/${roomId}`, {
      headers: this.getAuthHeader()
    });
  }

  // 채팅방 메시지 목록 조회
  getChatMessages(roomId, page = 0, size = 50) {
    return axios.get(`${API_URL}/rooms/${roomId}/messages`, {
      params: { page, size },
      headers: this.getAuthHeader()
    });
  }

  // 본사 직원 목록 조회
  getHeadquartersEmployees() {
    return axios.get(`${API_URL}/employees`, {
      headers: this.getAuthHeader()
    });
  }

  // 채팅방 나가기
  leaveChatRoom(roomId) {
    return axios.post(`${API_URL}/rooms/${roomId}/leave`, {}, {
      headers: this.getAuthHeader()
    });
  }

  // 채팅방에 사용자 초대
  inviteUsersToRoom(roomId, memberIds) {
    return axios.post(`${API_URL}/rooms/${roomId}/invite`, {
      memberIds
    }, {
      headers: this.getAuthHeader()
    });
  }

  // 채팅방 목록 폴링 (웹소켓 대체용)
  pollChatRooms(interval = 10000, callback) {
    // 이전 폴링 종료
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    
    // 즉시 첫 요청 수행
    this.getChatRooms()
      .then(response => {
        if (callback) callback(response.data);
      })
      .catch(error => {
        console.error('채팅방 목록 폴링 오류:', error);
      });
    
    // 주기적으로 채팅방 목록 갱신
    this.pollingInterval = setInterval(() => {
      this.getChatRooms()
        .then(response => {
          if (callback) callback(response.data);
        })
        .catch(error => {
          console.error('채팅방 목록 폴링 오류:', error);
        });
    }, interval);
    
    return () => {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
      }
    };
  }

  // 폴링 종료
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  // 인증 헤더 생성
  getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  // 새 메시지 알림 업데이트
  updateUnreadMessages(roomId, count) {
    console.log(`채팅방 ${roomId}의 알림 카운트 업데이트:`, count);
    
    if (roomId) {
      unreadMessagesByRoom[roomId] = count;
    }
    
    // 로컬 스토리지에 저장
    localStorage.setItem('chat_unread_by_room', JSON.stringify(unreadMessagesByRoom));
    
    // 모든 알림 콜백 호출
    this._notifyCallbacks();
  }

  // 새 메시지 받음
  addUnreadMessage(roomId) {
    if (!roomId) {
      console.warn('roomId 없이 메시지 알림 추가 시도');
      return;
    }
    
    // 해당 채팅방의 안 읽은 메시지 수 증가
    unreadMessagesByRoom[roomId] = (unreadMessagesByRoom[roomId] || 0) + 1;
    
    console.log(`채팅방 ${roomId}에 새 메시지 알림 추가됨, 총:`, unreadMessagesByRoom[roomId]);
    
    // 로컬 스토리지에 저장
    localStorage.setItem('chat_unread_by_room', JSON.stringify(unreadMessagesByRoom));
    
    // 모든 알림 콜백 호출
    this._notifyCallbacks();
  }

  // 특정 채팅방의 메시지 읽음 처리
  markRoomMessagesAsRead(roomId) {
    if (!roomId) {
      return;
    }
    
    // 해당 채팅방의 안 읽은 메시지 수 초기화
    if (unreadMessagesByRoom[roomId]) {
      delete unreadMessagesByRoom[roomId];
      
      console.log(`채팅방 ${roomId}의 메시지 읽음 처리됨`);
      
      // 로컬 스토리지에 저장
      localStorage.setItem('chat_unread_by_room', JSON.stringify(unreadMessagesByRoom));
      
      // 모든 알림 콜백 호출
      this._notifyCallbacks();
    }
  }

  // 모든 메시지 읽음 처리
  markMessagesAsRead() {
    unreadMessagesByRoom = {};
    console.log('모든 메시지 읽음 처리됨');
    
    // 로컬 스토리지에 저장
    localStorage.setItem('chat_unread_by_room', JSON.stringify(unreadMessagesByRoom));
    
    // 모든 알림 콜백 호출
    this._notifyCallbacks();
  }

  // 콜백 호출 내부 메서드
  _notifyCallbacks() {
    // 총 안 읽은 메시지 수 계산
    const totalUnread = this.getUnreadMessageCount();
    
    // 모든 알림 콜백 호출 (총 개수와 채팅방별 개수 전달)
    unreadMessageCallbacks.forEach(callback => 
      callback(totalUnread, unreadMessagesByRoom)
    );
  }

  // 알림 업데이트 콜백 등록
  onUnreadMessagesChange(callback) {
    console.log('알림 콜백 등록됨');
    unreadMessageCallbacks.push(callback);
    
    // 즉시 현재 상태 반영
    callback(this.getUnreadMessageCount(), unreadMessagesByRoom);
    
    // 콜백 제거 함수 반환
    return () => {
      unreadMessageCallbacks = unreadMessageCallbacks.filter(cb => cb !== callback);
    };
  }

  // 현재 안읽은 메시지 수 반환
  getUnreadMessageCount() {
    // 모든 채팅방의 안 읽은 메시지 수 합산
    return Object.values(unreadMessagesByRoom).reduce((sum, count) => sum + count, 0);
  }
  
  // 특정 채팅방의 안 읽은 메시지 수 반환
  getRoomUnreadCount(roomId) {
    return unreadMessagesByRoom[roomId] || 0;
  }
  
  // 모든 채팅방의 안 읽은 메시지 상태 반환
  getAllUnreadMessages() {
    return {...unreadMessagesByRoom};
  }
}

const chatService = new ChatService();
export default chatService; 