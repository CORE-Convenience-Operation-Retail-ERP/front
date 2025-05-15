import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.subscriptions = {};
    this.connected = false;
    this.connectCallback = null;
    this.errorCallback = null;
  }

  connect(token, onConnectCallback, onErrorCallback) {
    // 토큰이 없는 경우 연결을 시도하지 않음
    if (!token) {
      console.log('토큰이 없어 웹소켓 연결을 시도하지 않습니다.');
      if (onErrorCallback) onErrorCallback(new Error('토큰이 없습니다.'));
      return;
    }

    if (this.connected) {
      if (onConnectCallback) onConnectCallback();
      return;
    }
    
    this.connectCallback = onConnectCallback;
    this.errorCallback = onErrorCallback;

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
      console.log('Connected to WebSocket server:', frame);
      
      // 이전에 구독했던 채널 재구독
      Object.keys(this.subscriptions).forEach(destination => {
        const callback = this.subscriptions[destination];
        this._subscribe(destination, callback);
      });
      
      if (this.connectCallback) this.connectCallback();
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP Error:', frame);
      if (this.errorCallback) this.errorCallback(frame);
    };

    this.stompClient.activate();
  }

  disconnect() {
    if (this.stompClient && this.connected) {
      this.stompClient.deactivate();
      this.connected = false;
      this.subscriptions = {};
    }
  }

  subscribe(destination, callback) {
    this.subscriptions[destination] = callback;
    
    if (this.connected) {
      this._subscribe(destination, callback);
    }
  }

  _subscribe(destination, callback) {
    return this.stompClient.subscribe(destination, (message) => {
      const parsedMessage = JSON.parse(message.body);
      callback(parsedMessage);
    });
  }

  unsubscribe(destination) {
    if (this.subscriptions[destination]) {
      delete this.subscriptions[destination];
    }
  }

  sendMessage(destination, message) {
    if (this.connected) {
      this.stompClient.publish({
        destination: destination,
        body: JSON.stringify(message),
        headers: { 'content-type': 'application/json' }
      });
    } else {
      console.error('WebSocket is not connected. Cannot send message.');
    }
  }

  isConnected() {
    return this.connected;
  }
}

// 싱글톤 인스턴스 생성
const webSocketService = new WebSocketService();
export default webSocketService; 