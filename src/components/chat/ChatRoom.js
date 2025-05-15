import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import chatService from '../../service/ChatService';
import webSocketService from '../../service/WebSocketService';

const ChatRoom = ({ roomId: propRoomId, isInModal = false, onBackClick }) => {
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  const params = useParams();
  const routeRoomId = params?.roomId;
  const roomId = propRoomId || routeRoomId;
  
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const processedMessagesRef = useRef(new Set()); // 이미 처리된 메시지 ID를 추적
  const isActiveRoomRef = useRef(true); // 현재 채팅방이 활성화 상태인지 추적

  // 활성 상태 관리
  useEffect(() => {
    isActiveRoomRef.current = true; // 컴포넌트 마운트 시 활성화
    console.log('채팅방 활성화 상태: 활성화됨');
    
    return () => {
      isActiveRoomRef.current = false; // 컴포넌트 언마운트 시 비활성화
      console.log('채팅방 활성화 상태: 비활성화됨');
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('로그인이 필요합니다.');
      return;
    }
    
    // 사용자 정보 가져오기 (로컬 스토리지에서 개별 필드로)
    try {
      const empId = localStorage.getItem('empId');
      const empName = localStorage.getItem('empName');
      const deptId = localStorage.getItem('deptId');
      
      if (!empId || !deptId) {
        setError('사용자 정보가 없습니다. 다시 로그인해주세요.');
        return;
      }
      
      // 본사 직원(deptId 4~10)인지 확인
      const deptIdNum = parseInt(deptId);
      if (deptIdNum < 4 || deptIdNum > 10) {
        setError('본사 직원만 채팅 기능을 사용할 수 있습니다.');
        return;
      }
      
      // 사용자 정보 객체 생성
      setUser({
        empId: parseInt(empId),
        empName: empName,
        deptId: deptIdNum
      });
      
    } catch (err) {
      console.error('사용자 정보를 불러오는데 실패했습니다.', err);
      setError('사용자 정보를 불러오는데 실패했습니다.');
      return;
    }

    // 다른 방에서 왔을 경우 처리된 메시지 목록 초기화
    processedMessagesRef.current = new Set();
    setMessages([]);

    // 페이지 접속 시 현재 채팅방만 읽음 처리
    chatService.markRoomMessagesAsRead(roomId);

    // 웹소켓 연결
    webSocketService.connect(token, 
      () => {
        loadChatRoomData();
        
        // 메시지 구독
        webSocketService.subscribe(`/topic/chat/room/${roomId}`, (message) => {
          // 메시지 ID(또는 sentAt + senderId)가 있는지 확인하고 중복 제거
          const messageId = message.messageId || `${message.sentAt}_${message.senderId}_${message.content}`;
          
          if (!processedMessagesRef.current.has(messageId)) {
            processedMessagesRef.current.add(messageId);
            setMessages(prevMessages => [...prevMessages, message]);
            scrollToBottom();
            
            // WebSocketService에서 글로벌 알림을 처리하므로 여기서는 처리하지 않음
            console.log('채팅방에서 메시지 처리됨', {
              content: message.content, 
              messageId
            });
          } else {
            console.log('중복 메시지 감지됨:', messageId);
          }
        });
      }, 
      (error) => {
        console.error('웹소켓 연결 실패:', error);
        setError('웹소켓 연결에 실패했습니다.');
        setLoading(false);
      }
    );

    // 페이지 포커스 변경 감지
    const handleFocus = () => {
      console.log('페이지 포커스 - 채팅방 활성화');
      isActiveRoomRef.current = true;
      chatService.markRoomMessagesAsRead(roomId);
    };
    
    const handleBlur = () => {
      console.log('페이지 블러 - 채팅방 비활성화');
      isActiveRoomRef.current = false;
    };
    
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // 브라우저 알림 권한 요청
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        console.log('알림 권한 상태:', permission);
      });
    } else {
      console.log('현재 알림 권한 상태:', Notification.permission);
    }

    return () => {
      // 구독 해제
      webSocketService.unsubscribe(`/topic/chat/room/${roomId}`);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [roomId, navigate, isInModal]);

  const loadChatRoomData = () => {
    // 채팅방 정보 로드
    chatService.getChatRoom(roomId)
      .then(roomResponse => {
        setRoom(roomResponse.data);
        
        // 채팅 메시지 로드
        return chatService.getChatMessages(roomId);
      })
      .then(messagesResponse => {
        const loadedMessages = messagesResponse.data.reverse(); // 오래된 메시지부터 표시
        
        // 초기 로드된 메시지 ID를 Set에 추가
        loadedMessages.forEach(msg => {
          const messageId = msg.messageId || `${msg.sentAt}_${msg.senderId}_${msg.content}`;
          processedMessagesRef.current.add(messageId);
        });
        
        setMessages(loadedMessages);
        setLoading(false);
        scrollToBottom();
      })
      .catch(error => {
        console.error('채팅방 데이터 로드 오류:', error);
        setError('채팅방 데이터를 불러오는데 실패했습니다.');
        setLoading(false);
      });
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (newMessage.trim() === '') return;
    
    const messageData = {
      roomId: Number(roomId),
      content: newMessage,
      messageType: 'CHAT'
    };

    // 웹소켓으로 메시지 전송
    webSocketService.sendMessage('/app/chat.sendMessage', messageData);
    
    // 입력 필드 초기화
    setNewMessage('');
  };

  const handleBackClick = () => {
    if (isInModal && onBackClick) {
      onBackClick();
    } else {
      navigate('/chat');
    }
  };

  if (loading) {
    return <Container isInModal={isInModal}><p>로딩 중...</p></Container>;
  }

  if (error) {
    return <Container isInModal={isInModal}><p>오류: {error}</p></Container>;
  }

  return (
    <Container isInModal={isInModal}>
      {!isInModal && (
        <Header>
          <BackButton onClick={handleBackClick}>{'< 뒤로'}</BackButton>
          <RoomInfo>
            <h2>{room?.roomName}</h2>
            <MemberCount>{room?.members?.length || 0}명 참여</MemberCount>
          </RoomInfo>
        </Header>
      )}

      <MessagesContainer ref={messagesContainerRef} isInModal={isInModal}>
        {messages.map((message, index) => (
          <MessageItem 
            key={index} 
            isCurrentUser={user && message.senderId === user.empId}
            messageType={message.messageType}
          >
            {message.messageType === 'JOIN' ? (
              <SystemMessage>{message.content}</SystemMessage>
            ) : (
              <>
                {(!user || message.senderId !== user.empId) && (
                  <SenderName>{message.senderName}</SenderName>
                )}
                <MessageContent isCurrentUser={user && message.senderId === user.empId}>
                  {message.content}
                </MessageContent>
                <MessageTime>
                  {new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </MessageTime>
              </>
            )}
          </MessageItem>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <MessageInputForm onSubmit={handleSendMessage}>
        <MessageInput 
          type="text" 
          value={newMessage} 
          onChange={handleMessageChange} 
          placeholder="메시지를 입력하세요"
        />
        <SendButton type="submit" disabled={!newMessage.trim()}>전송</SendButton>
      </MessageInputForm>
    </Container>
  );
};

// 스타일 컴포넌트
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f7fa;
  
  ${props => props.isInModal && `
    padding-top: 0;
  `}
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #4a6cf7;
  font-weight: bold;
  cursor: pointer;
  margin-right: 15px;
  padding: 5px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const RoomInfo = styled.div`
  flex: 1;
  
  h2 {
    margin: 0;
    font-size: 18px;
  }
`;

const MemberCount = styled.div`
  font-size: 12px;
  color: #888;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  ${props => props.isInModal && `
    height: calc(100% - 65px);
  `}
`;

const MessageItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isCurrentUser ? 'flex-end' : 'flex-start'};
  max-width: 80%;
  align-self: ${props => props.isCurrentUser ? 'flex-end' : 'flex-start'};
  
  ${props => props.messageType === 'JOIN' && `
    align-self: center;
    margin: 10px 0;
  `}
`;

const SystemMessage = styled.div`
  background-color: #f0f0f0;
  color: #666;
  padding: 8px 12px;
  border-radius: 15px;
  font-size: 12px;
  text-align: center;
`;

const SenderName = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  padding-left: 10px;
`;

const MessageContent = styled.div`
  background-color: ${props => props.isCurrentUser ? '#4a6cf7' : 'white'};
  color: ${props => props.isCurrentUser ? 'white' : '#333'};
  padding: 10px 15px;
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
`;

const MessageTime = styled.div`
  font-size: 10px;
  color: #999;
  margin-top: 4px;
  padding: 0 10px;
`;

const MessageInputForm = styled.form`
  display: flex;
  padding: 15px;
  background-color: white;
  border-top: 1px solid #eee;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #4a6cf7;
  }
`;

const SendButton = styled.button`
  background-color: #4a6cf7;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0 20px;
  margin-left: 10px;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background-color: #3a5ce5;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export default ChatRoom; 