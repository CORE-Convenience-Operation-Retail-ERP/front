import axios from './axiosInstance';

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
    this.unreadCounts = new Map(); // roomId -> unread count
    // 생성자에서도 로컬 스토리지에서 상태 초기화
    initializeFromLocalStorage();
    console.log('ChatService 초기화 완료, 현재 알림 상태:', unreadMessagesByRoom);
  }

  // 채팅방 목록 조회
  async getChatRooms() {
    const token = localStorage.getItem('token');
    const deptId = Number(localStorage.getItem('deptId'));
    if (!token || isNaN(deptId) || deptId < 4 || deptId > 10) {
      // 비로그인 또는 비허용 부서면 빈 배열 반환 (API 요청 X)
      return Promise.resolve({ data: [] });
    }
    const response = await axios.get('/api/chat/rooms', {
      headers: this.getAuthHeader()
    });
    // === [추가] 존재하지 않는 roomId의 알림 카운트 자동 정리 ===
    try {
      const validRoomIds = response.data.map(room => room.roomId);
      let unread = JSON.parse(localStorage.getItem('chat_unread_by_room') || '{}');
      let changed = false;
      Object.keys(unread).forEach(roomId => {
        if (!validRoomIds.includes(Number(roomId))) {
          delete unread[roomId];
          changed = true;
        }
      });
      if (changed) {
        localStorage.setItem('chat_unread_by_room', JSON.stringify(unread));
      }
    } catch (e) {
      // 무시
    }
    // === [추가 끝] ===
    return response;
  }

  // 채팅방 생성
  async createChatRoom(roomName, roomType, memberIds) {
    return await axios.post('/api/chat/rooms', {
      roomName,
      roomType,
      memberIds
    }, {
      headers: this.getAuthHeader()
    });
  }

  // 특정 채팅방 정보 조회
  async getChatRoom(roomId) {
    const response = await axios.get(`/api/chat/rooms/${roomId}`, {
      headers: this.getAuthHeader()
    });
    // 채팅방 입장 시 자동으로 읽음 처리
    await this.markMessagesAsRead(roomId);
    return response;
  }

  // 채팅방 메시지 목록 조회
  async getChatMessages(roomId, page = 0, size = 50) {
    return await axios.get(`/api/chat/rooms/${roomId}/messages`, {
      params: { page, size },
      headers: this.getAuthHeader()
    });
  }

  // 본사 직원 목록 조회
  async getHeadquartersEmployees() {
    return await axios.get('/api/chat/employees', {
      headers: this.getAuthHeader()
    });
  }

  // 채팅방 나가기
  async leaveChatRoom(roomId) {
    return await axios.post(`/api/chat/rooms/${roomId}/leave`, {}, {
      headers: this.getAuthHeader()
    });
  }

  // 채팅방에 사용자 초대
  async inviteUsersToRoom(roomId, memberIds) {
    console.log(`채팅방 ${roomId}에 초대할 멤버:`, memberIds);
    
    // 유효성 검사
    if (!roomId) {
      return Promise.reject(new Error('유효하지 않은 채팅방입니다.'));
    }
    
    if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
      return Promise.reject(new Error('초대할 멤버가 선택되지 않았습니다.'));
    }
    
    return await axios.post(`/api/chat/rooms/${roomId}/invite`, {
      memberIds
    }, {
      headers: this.getAuthHeader()
    });
  }

  // 채팅방 목록 폴링 (웹소켓 대체용)
  async pollChatRooms(interval = 10000, callback) {
    // 이전 폴링 종료
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    
    // 즉시 첫 요청 수행
    await this.getChatRooms()
      .then(response => {
        if (callback) callback(response.data);
      })
      .catch(error => {
        console.error('채팅방 목록 폴링 오류:', error);
      });
    
    // 주기적으로 채팅방 목록 갱신
    this.pollingInterval = setInterval(async () => {
      await this.getChatRooms()
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
  async markMessagesAsRead(roomId) {
    if (!roomId) {
      return;
    }
    
    try {
      await axios.post(`/api/chat/rooms/${roomId}/read`);
      // 로컬 읽지 않은 메시지 카운트 초기화
      this.unreadCounts.set(roomId, 0);
    } catch (error) {
      console.error('메시지 읽음 처리 실패:', error);
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

  // 읽지 않은 메시지 추가 (웹소켓에서 호출)
  addUnreadMessage(roomId) {
    const currentCount = this.unreadCounts.get(roomId) || 0;
    this.unreadCounts.set(roomId, currentCount + 1);
    
    // 브라우저 알림 표시
    this.showBrowserNotification(roomId);
  }

  // 읽지 않은 메시지 수 조회
  getUnreadCount(roomId) {
    return this.unreadCounts.get(roomId) || 0;
  }

  // 전체 읽지 않은 메시지 수 조회
  getTotalUnreadCount() {
    let total = 0;
    for (const count of this.unreadCounts.values()) {
      total += count;
    }
    return total;
  }

  // 브라우저 알림 표시
  showBrowserNotification(roomId) {
    if (Notification.permission === 'granted') {
      new Notification('새 메시지', {
        body: '새로운 채팅 메시지가 도착했습니다.',
        icon: '/favicon.ico',
        tag: `chat-${roomId}` // 같은 채팅방의 알림은 하나만 표시
      });
    }
  }
}

const chatService = new ChatService();
export default chatService;

// 메시지 읽음 처리
export const markMessagesAsRead = async (roomId) => {
  try {
    await axios.post(`${process.env.REACT_APP_API_URL}/api/chat/rooms/${roomId}/read`);
  } catch (error) {
    console.error('메시지 읽음 처리 실패:', error);
  }
};

// 메시지 검색
export const searchMessages = async (roomId, searchTerm) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/chat/rooms/${roomId}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  } catch (error) {
    console.error('메시지 검색 실패:', error);
    throw error;
  }
}; 