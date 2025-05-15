import axios from 'axios';

const API_URL = 'http://localhost:8080/api/chat';

// 채팅 알림 상태 저장소
let unreadMessages = 0;
let unreadMessageCallbacks = [];

// 로컬 스토리지에서 알림 상태 초기화
try {
  const savedCount = localStorage.getItem('chat_unread_count');
  if (savedCount !== null) {
    unreadMessages = parseInt(savedCount, 10) || 0;
  }
} catch (e) {
  console.error('로컬 스토리지 읽기 오류:', e);
}

class ChatService {
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
  updateUnreadMessages(count) {
    console.log('알림 카운트 업데이트:', count);
    unreadMessages = count;
    // 로컬 스토리지에 저장
    localStorage.setItem('chat_unread_count', count.toString());
    // 모든 알림 콜백 호출
    unreadMessageCallbacks.forEach(callback => callback(unreadMessages));
  }

  // 새 메시지 받음
  addUnreadMessage() {
    unreadMessages += 1;
    console.log('새 메시지 알림 추가됨, 총:', unreadMessages);
    // 로컬 스토리지에 저장
    localStorage.setItem('chat_unread_count', unreadMessages.toString());
    // 모든 알림 콜백 호출
    unreadMessageCallbacks.forEach(callback => callback(unreadMessages));
  }

  // 메시지 읽음 처리
  markMessagesAsRead(count = null) {
    if (count === null) {
      unreadMessages = 0;
    } else {
      unreadMessages = Math.max(0, unreadMessages - count);
    }
    console.log('메시지 읽음 처리됨, 남은 알림:', unreadMessages);
    // 로컬 스토리지에 저장
    localStorage.setItem('chat_unread_count', unreadMessages.toString());
    // 모든 알림 콜백 호출
    unreadMessageCallbacks.forEach(callback => callback(unreadMessages));
  }

  // 알림 업데이트 콜백 등록
  onUnreadMessagesChange(callback) {
    console.log('알림 콜백 등록됨');
    unreadMessageCallbacks.push(callback);
    // 즉시 현재 상태 반영
    callback(unreadMessages);
    
    // 콜백 제거 함수 반환
    return () => {
      unreadMessageCallbacks = unreadMessageCallbacks.filter(cb => cb !== callback);
    };
  }

  // 현재 안읽은 메시지 수 반환
  getUnreadMessageCount() {
    return unreadMessages;
  }
}

const chatService = new ChatService();
export default chatService; 