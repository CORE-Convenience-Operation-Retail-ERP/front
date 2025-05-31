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
    this.maxReconnectAttempts = 5; // 재연결 시도 횟수 증가
    this.reconnectDelay = 3000; // 재연결 지연 시간
    this.userRoomIds = []; // 사용자가 속한 채팅방 ID 목록 캐시
    this.connectionCheckInterval = null; // 연결 상태 체크 인터벌
    this.lastPingTime = null; // 마지막 핑 시간
    this.isReconnecting = false; // 재연결 중인지 여부
    
    // deptId 체크: 점주(3)~본사(10) 모두 웹소켓 사용
    const deptId = parseInt(localStorage.getItem('deptId'), 10);
    const token = localStorage.getItem('token');
    this.isAllowed = token && !isNaN(deptId) && deptId >= 3 && deptId <= 10;

    if (this.isAllowed) {
      // 페이지 로드 시 자동 연결 시도
      this.autoConnect();
      
      // 페이지 가시성 변경 감지 (탭 전환 등)
      if (typeof document !== 'undefined' && document.addEventListener) {
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
      }
      
      // 주기적 연결 상태 체크 시작
      this.startConnectionMonitoring();
    } else {
      console.log('WebSocketService: deptId', deptId, '웹소켓 미사용');
    }
  }
  
  // 연결 상태 모니터링 시작
  startConnectionMonitoring() {
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
    }
    
    this.connectionCheckInterval = setInterval(() => {
      if (this.isAllowed && !this.isReconnecting) {
        const token = localStorage.getItem('token');
        
        // 토큰이 없거나 연결이 끊어진 경우
        if (!token) {
          console.log('토큰이 없어 웹소켓 연결 해제');
          this.disconnect();
          return;
        }
        
        // 연결이 끊어진 경우 재연결 시도
        if (!this.isConnected()) {
          console.log('웹소켓 연결이 끊어짐 - 재연결 시도');
          this.autoConnect();
        }
      }
    }, 10000); // 10초마다 체크
  }
  
  // 연결 상태 모니터링 중지
  stopConnectionMonitoring() {
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
      this.connectionCheckInterval = null;
    }
  }
  
  // 앱 초기화 시 호출되는 함수
  init() {
    if (!this.isAllowed) {
      console.log('WebSocketService.init: deptId 미허용, 초기화 중단');
      return;
    }
    console.log('WebSocketService 초기화 중...');
    this.autoConnect();
  }
  
  // 자동 연결 함수
  autoConnect() {
    if (!this.isAllowed || this.isReconnecting) return;
    
    // 토큰이 있으면 자동 연결
    const token = localStorage.getItem('token');
    if (token && !this.connected) {
      console.log('자동 웹소켓 연결 시도...');
      this.connect(token, 
        () => {
          console.log('자동 웹소켓 연결 성공');
          this.reconnectCount = 0; // 성공 시 재연결 카운트 리셋
        }, 
        (error) => {
          console.error('자동 웹소켓 연결 실패:', error);
        }
      );
    }
  }
  
  // 페이지 가시성 변경 처리
  handleVisibilityChange() {
    if (!this.isAllowed) return;
    
    if (!document.hidden) {
      // 페이지가 다시 보이게 되었을 때
      console.log('페이지 가시성 변경 - 연결 상태 확인');
      
      // 잠시 후 연결 상태 확인 (브라우저가 안정화될 시간을 줌)
      setTimeout(() => {
        if (!this.isConnected()) {
          console.log('페이지 가시성 변경으로 연결 재시도');
          this.autoConnect();
        }
      }, 1000);
    }
  }

  connect(token, onConnectCallback, onErrorCallback) {
    if (!this.isAllowed) {
      console.log('WebSocketService.connect: deptId 미허용, 연결 중단');
      return;
    }
    
    // 토큰이 없는 경우 연결을 시도하지 않음
    if (!token) {
      console.log('토큰이 없어 웹소켓 연결을 시도하지 않습니다.');
      if (onErrorCallback) onErrorCallback(new Error('토큰이 없습니다.'));
      return;
    }

    // 이미 연결 중이거나 연결되어 있는 경우
    if (this.isReconnecting) {
      console.log('이미 재연결 시도 중입니다.');
      return;
    }
    
    if (this.connected && this.stompClient && this.stompClient.connected) {
      console.log('이미 웹소켓에 연결되어 있습니다.');
      if (onConnectCallback) onConnectCallback();
      return;
    }
    
    this.isReconnecting = true;
    this.connectCallback = onConnectCallback;
    this.errorCallback = onErrorCallback;

    // 알림 권한 요청
    this.requestNotificationPermission();

    // 이전 연결 해제
    if (this.stompClient) {
      try {
        this.stompClient.deactivate();
      } catch (e) {
        console.warn('이전 웹소켓 연결 해제 중 오류:', e);
      }
    }

    // 웹소켓 연결 생성
    const socket = new SockJS(process.env.REACT_APP_WS_URL || 'https://api.corepos.store/ws');
    
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: function (str) {
        // console.log("STOMP: " + str);
      },
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.stompClient.onConnect = (frame) => {
      this.connected = true;
      this.isReconnecting = false;
      this.reconnectCount = 0;
      this.lastPingTime = Date.now();
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
      this.isReconnecting = false;
      this.connected = false;
      
      // 인증 오류인 경우 토큰 문제일 수 있음
      if (frame.headers && frame.headers.message && 
          (frame.headers.message.includes('Authentication') || 
           frame.headers.message.includes('Unauthorized'))) {
        console.error('인증 오류 - 토큰을 확인하세요');
        // 토큰 관련 오류 시 재연결 시도하지 않음
        return;
      }
      
      if (this.errorCallback) this.errorCallback(frame);
      
      // 일반적인 오류의 경우 재연결 시도
      this.scheduleReconnect();
    };

    this.stompClient.onWebSocketClose = (event) => {
      console.log('웹소켓 연결이 닫힘:', event);
      this.connected = false;
      this.isReconnecting = false;
      
      // 정상적인 종료가 아닌 경우 재연결 시도
      if (event.code !== 1000) { // 1000은 정상 종료 코드
        this.scheduleReconnect();
      }
    };

    this.stompClient.onWebSocketError = (error) => {
      console.error('웹소켓 오류:', error);
      this.connected = false;
      this.isReconnecting = false;
      this.scheduleReconnect();
    };

    try {
      this.stompClient.activate();
    } catch (error) {
      console.error('웹소켓 활성화 오류:', error);
      this.isReconnecting = false;
      this.scheduleReconnect();
    }
  }
  
  // 재연결 스케줄링
  scheduleReconnect() {
    if (!this.isAllowed || this.isReconnecting) return;
    
    if (this.reconnectCount < this.maxReconnectAttempts) {
      this.reconnectCount++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectCount - 1); // 지수 백오프
      
      console.log(`웹소켓 재연결 시도 ${this.reconnectCount}/${this.maxReconnectAttempts} (${delay}ms 후)`);
      
      setTimeout(() => {
        const token = localStorage.getItem('token');
        if (token) {
          this.connect(token, this.connectCallback, this.errorCallback);
        }
      }, delay);
    } else {
      console.error('웹소켓 재연결 시도 횟수 초과');
      this.isReconnecting = false;
    }
  }

  // 알림 권한 요청 함수
  requestNotificationPermission() {
    if (!this.isAllowed) return;
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
    if (!this.isAllowed) return Promise.resolve([]);
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
    if (!this.isAllowed) return;
    this._subscribe('/topic/chat/rooms/update', (updatedRoom) => {
      console.log('채팅방 정보 업데이트됨:', updatedRoom);
      // 채팅방 목록 캐시 갱신
      this.updateUserRoomsCache();
    });
  }

  // 글로벌 채팅 메시지 구독
  subscribeToGlobalMessages() {
    if (!this.isAllowed) return;
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
    } catch (error) {
      console.error('글로벌 메시지 구독 오류:', error);
    }
  }
  
  // 메시지 알림 처리 로직 분리
  processMessageNotification(message, isSentByMe) {
    if (!this.isAllowed) return;
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
    if (!this.isAllowed) return;
    
    console.log('웹소켓 연결 해제 시작');
    this.isReconnecting = false;
    this.stopConnectionMonitoring();
    
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
    if (!this.isAllowed) return;
    console.log(`구독 등록: ${destination}`);
    this.subscriptions[destination] = callback;
    
    if (this.connected && this.stompClient && this.stompClient.connected) {
      return this._subscribe(destination, callback);
    } else {
      console.warn(`웹소켓 연결이 없어 나중에 구독 예정: ${destination}`);
    }
  }

  _subscribe(destination, callback) {
    if (!this.isAllowed) return;
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
    if (!this.isAllowed) return;
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
    if (!this.isAllowed) return;
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
    return this.isAllowed && this.connected && this.stompClient && this.stompClient.connected;
  }
  
  // 강제 재연결 메서드 (외부에서 호출 가능)
  forceReconnect() {
    if (!this.isAllowed) return;
    
    console.log('강제 재연결 시도');
    this.disconnect();
    this.reconnectCount = 0;
    
    setTimeout(() => {
      this.autoConnect();
    }, 1000);
  }
}

// 싱글톤 인스턴스 생성
const webSocketService = new WebSocketService();
export default webSocketService; 