import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import chatService from './ChatService';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.subscriptions = {};
    this.stompSubscriptions = {}; // 실제 구독 객체 저장용
    this.connected = false;
    this.connectCallback = null;
    this.errorCallback = null;
    this.reconnectCount = 0;
    this.maxReconnectAttempts = 5;
    this.userRoomIds = []; // 사용자가 속한 채팅방 ID 목록 캐시
    
    // 페이지 로드 시 자동 연결 시도
    this.autoConnect();
    
    // 페이지 가시성 변경 감지 (탭 전환 등)
    if (typeof document !== 'undefined' && document.addEventListener) {
      document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }
  }
  
  // 앱 초기화 시 호출되는 함수
  init() {
    console.log('WebSocketService 초기화 중...');
    this.autoConnect();
  }
  
  // 자동 연결 함수
  autoConnect() {
    // 토큰이 있으면 자동 연결
    const token = localStorage.getItem('token');
    if (token && !this.connected) {
      console.log('자동 웹소켓 연결 시도...');
      this.connect(token, 
        () => {
          console.log('자동 웹소켓 연결 성공');
        }, 
        (error) => {
          console.error('자동 웹소켓 연결 실패:', error);
        }
      );
    }
  }
  
  // 페이지 가시성 변경 처리
  handleVisibilityChange() {
    if (!document.hidden && !this.connected) {
      console.log('페이지 가시성 변경으로 연결 재시도');
      this.autoConnect();
    }
  }

  connect(token, onConnectCallback, onErrorCallback) {
    // 토큰이 없는 경우 연결을 시도하지 않음
    if (!token) {
      console.log('토큰이 없어 웹소켓 연결을 시도하지 않습니다.');
      if (onErrorCallback) onErrorCallback(new Error('토큰이 없습니다.'));
      return;
    }

    // 알림 권한 요청
    this.requestNotificationPermission();

    if (this.connected && this.stompClient && this.stompClient.connected) {
      console.log('이미 웹소켓에 연결되어 있습니다.');
      if (onConnectCallback) onConnectCallback();
      return;
    }
    
    this.connectCallback = onConnectCallback;
    this.errorCallback = onErrorCallback;

    // 이전 연결 해제
    if (this.stompClient) {
      try {
        this.stompClient.deactivate();
      } catch (e) {
        console.warn('이전 웹소켓 연결 해제 중 오류:', e);
      }
    }

    // 웹소켓 연결 생성
    const socket = new SockJS('http://localhost:8080/ws');
    
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: function (str) {
        console.log("STOMP: " + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.stompClient.onConnect = (frame) => {
      this.connected = true;
      this.reconnectCount = 0;
      console.log('웹소켓 서버에 연결됨:', frame);
      
      // 사용자의 채팅방 목록 캐시 업데이트
      this.updateUserRoomsCache();
      
      // 글로벌 채팅 메시지 구독
      this.subscribeToGlobalMessages();
      
      // 채팅방 업데이트 이벤트 구독
      this.subscribeToChatRoomUpdates();
      
      // 이전에 구독했던 채널 재구독
      Object.keys(this.subscriptions).forEach(destination => {
        const callback = this.subscriptions[destination];
        this._subscribe(destination, callback);
      });
      
      if (this.connectCallback) this.connectCallback();
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP 오류:', frame);
      if (this.errorCallback) this.errorCallback(frame);
    };

    this.stompClient.onWebSocketClose = (event) => {
      console.log('웹소켓 연결이 닫힘:', event);
      this.connected = false;
      
      // 재연결 시도
      if (this.reconnectCount < this.maxReconnectAttempts) {
        this.reconnectCount++;
        console.log(`웹소켓 재연결 시도 ${this.reconnectCount}/${this.maxReconnectAttempts}`);
        setTimeout(() => this.connect(token, onConnectCallback, onErrorCallback), 3000);
      }
    };

    this.stompClient.activate();
  }

  // 알림 권한 요청 함수
  requestNotificationPermission() {
    if (!("Notification" in window)) {
      console.log("이 브라우저는 알림을 지원하지 않습니다.");
      return;
    }

    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      console.log("알림 권한 요청 중...");
      Notification.requestPermission().then(permission => {
        console.log("알림 권한 결과:", permission);
      });
    } else {
      console.log("현재 알림 권한:", Notification.permission);
    }
  }

  // 사용자의 채팅방 목록 캐시 업데이트
  updateUserRoomsCache() {
    return chatService.getChatRooms()
      .then(response => {
        this.userRoomIds = response.data.map(room => room.roomId);
        console.log('사용자 채팅방 캐시 업데이트됨:', this.userRoomIds);
        return this.userRoomIds;
      })
      .catch(error => {
        console.error('채팅방 목록 캐시 업데이트 오류:', error);
        return [];
      });
  }

  // 채팅방 업데이트 이벤트 구독 (채팅방 생성, 나가기, 초대 등)
  subscribeToChatRoomUpdates() {
    this._subscribe('/topic/chat/rooms/update', (updatedRoom) => {
      console.log('채팅방 정보 업데이트됨:', updatedRoom);
      // 채팅방 목록 캐시 갱신
      this.updateUserRoomsCache();
    });
  }

  // 글로벌 채팅 메시지 구독
  subscribeToGlobalMessages() {
    // 메시지 구독 (모든 메시지를 수신하는 토픽)
    try {
      this._subscribe('/topic/chat/messages', (message) => {
        console.log('글로벌 채팅 메시지 수신:', message);
        
        // 본인이 보낸 메시지인지 확인
        const userEmpId = parseInt(localStorage.getItem('empId') || '0');
        const isSentByMe = message.senderId === userEmpId;
        
        // 다른 사람이 보낸 메시지에 대해서만 알림 추가
        if (!isSentByMe && message.messageType === 'CHAT') {
          // 현재 포커스가 있는지 확인
          const hasFocus = document.hasFocus();
          const isActive = window.location.href.includes(`/chat/room/${message.roomId}`);
          
          console.log('메시지 알림 조건:', { 
            isSentByMe, 
            hasFocus, 
            isActive,
            messageContent: message.content
          });
          
          // 캐시가 비어 있는 경우 새로 로드
          if (this.userRoomIds.length === 0) {
            console.log('채팅방 캐시가 비어 있어 다시 로드합니다.');
            this.updateUserRoomsCache()
              .then(() => this.processMessageNotification(message, isSentByMe));
          } else {
            this.processMessageNotification(message, isSentByMe);
          }
        }
      });
      
      // 관리자 알림 구독
      this.subscribeToAdminNotifications();
    } catch (error) {
      console.error('글로벌 메시지 구독 오류:', error);
    }
  }
  
  // 관리자 알림 구독
  subscribeToAdminNotifications() {
    try {
      this._subscribe('/topic/notifications/admin', (notification) => {
        console.log('관리자 알림 수신:', notification);
        
        // AdminNotificationService 사용 가능한 경우에만 알림 추가
        if (typeof window !== 'undefined' && window.adminNotificationService) {
          window.adminNotificationService.addNotification(notification);
          
          // 브라우저 알림 표시 (페이지에 포커스가 없을 때만)
          if (!document.hasFocus() && Notification.permission === "granted") {
            const notif = new Notification('새 알림', {
              body: notification.content,
              icon: '/favicon.ico'
            });
            
            // 알림 클릭 시 해당 링크로 이동
            if (notification.link) {
              notif.onclick = function() {
                window.open(notification.link, '_blank');
                notif.close();
              };
            }
          }
        } else {
          console.warn('AdminNotificationService가 아직 초기화되지 않았습니다');
        }
      });
    } catch (error) {
      console.error('관리자 알림 구독 오류:', error);
    }
  }
  
  // 메시지 알림 처리 로직 분리
  processMessageNotification(message, isSentByMe) {
    // 사용자가 속한 채팅방인지 확인 (캐시된 목록 사용)
    const isUserInRoom = this.userRoomIds.includes(message.roomId);
    console.log(`사용자가 채팅방 ${message.roomId}에 속해있는지: ${isUserInRoom}`, this.userRoomIds);
    
    // 사용자가 속한 채팅방일 경우에만 알림 추가
    if (isUserInRoom) {
      chatService.addUnreadMessage(message.roomId);
    } else {
      console.log(`채팅방 ${message.roomId}은 사용자의 채팅방이 아니므로 알림을 표시하지 않습니다.`);
    }
  }

  disconnect() {
    if (this.stompClient && this.connected) {
      // 모든 구독 해제
      Object.keys(this.stompSubscriptions).forEach(destination => {
        try {
          const subscription = this.stompSubscriptions[destination];
          if (subscription && subscription.unsubscribe) {
            subscription.unsubscribe();
          }
        } catch (e) {
          console.warn(`구독 해제 중 오류 (${destination}):`, e);
        }
      });
      
      this.stompClient.deactivate();
      this.connected = false;
      this.subscriptions = {};
      this.stompSubscriptions = {};
      console.log('웹소켓 연결 해제됨');
    }
  }

  subscribe(destination, callback) {
    console.log(`구독 등록: ${destination}`);
    this.subscriptions[destination] = callback;
    
    if (this.connected && this.stompClient && this.stompClient.connected) {
      return this._subscribe(destination, callback);
    } else {
      console.warn(`웹소켓 연결이 없어 나중에 구독 예정: ${destination}`);
    }
  }

  _subscribe(destination, callback) {
    try {
      // 이미 구독 중인지 확인
      if (this.stompSubscriptions[destination]) {
        console.log(`이미 구독 중: ${destination}`);
        return;
      }
      
      console.log(`구독 시작: ${destination}`);
      const subscription = this.stompClient.subscribe(destination, (message) => {
        try {
          console.log(`메시지 수신 (${destination}):`, message.body);
          const parsedMessage = JSON.parse(message.body);
          callback(parsedMessage);
        } catch (e) {
          console.error(`메시지 처리 중 오류 (${destination}):`, e, message.body);
        }
      });
      
      this.stompSubscriptions[destination] = subscription;
      console.log(`구독 성공: ${destination}`);
      return subscription;
    } catch (error) {
      console.error(`구독 오류 (${destination}):`, error);
    }
  }

  unsubscribe(destination) {
    console.log(`구독 해제 시도: ${destination}`);
    
    if (this.stompSubscriptions[destination]) {
      try {
        const subscription = this.stompSubscriptions[destination];
        subscription.unsubscribe();
        console.log(`구독 해제 성공: ${destination}`);
      } catch (e) {
        console.warn(`구독 해제 중 오류 (${destination}):`, e);
      }
      
      delete this.stompSubscriptions[destination];
    }
    
    if (this.subscriptions[destination]) {
      delete this.subscriptions[destination];
    }
  }

  sendMessage(destination, message) {
    if (this.connected && this.stompClient && this.stompClient.connected) {
      console.log(`메시지 전송 (${destination}):`, message);
      this.stompClient.publish({
        destination: destination,
        body: JSON.stringify(message),
        headers: { 'content-type': 'application/json' }
      });
    } else {
      console.error('웹소켓이 연결되어 있지 않아 메시지를 보낼 수 없습니다.');
    }
  }

  isConnected() {
    return this.connected && this.stompClient && this.stompClient.connected;
  }
}

// 싱글톤 인스턴스 생성
const webSocketService = new WebSocketService();
export default webSocketService; 