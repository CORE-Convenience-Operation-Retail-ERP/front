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
      
      // 글로벌 채팅 메시지 구독
      this.subscribeToGlobalMessages();
      
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
          
          // 알림 항상 추가 (조건 수정)
          chatService.addUnreadMessage();
            
          // 브라우저 알림 표시 (조건 수정)
          if (Notification.permission === 'granted') {
            const notification = new Notification('새 메시지 알림', {
              body: `${message.senderName || '알 수 없음'}: ${message.content}`,
              icon: '/core_logo.png',
              badge: '/core_badge.png',
              image: message.senderImg || '/message_image.png',
              tag: `chat-${message.roomId}`,
              requireInteraction: true,
              vibrate: [200, 100, 200],
              dir: 'auto',
              silent: false,
              data: {
                roomId: message.roomId,
                messageId: message.messageId,
                senderId: message.senderId
              }
            });
            
            // 알림 클릭 이벤트 추가
            notification.onclick = function() {
              window.focus();
              if (message.roomId) {
                window.location.href = `/chat/room/${message.roomId}`;
              } else {
                window.location.href = '/chat';
              }
            };
          } else if (Notification.permission !== 'denied') {
            // 알림 권한 요청
            Notification.requestPermission();
          }
        }
      });
    } catch (error) {
      console.error('글로벌 메시지 구독 오류:', error);
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