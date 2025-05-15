import axios from 'axios';

const API_URL = 'http://localhost:8080/api/chat';

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
}

const chatService = new ChatService();
export default chatService; 