import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatRoomList from './ChatRoomList';
import ChatRoom from './ChatRoom';
import chatService from '../../service/ChatService';

const ChatModal = ({ isOpen, onClose }) => {
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadMessagesByRoom, setUnreadMessagesByRoom] = useState({});

  // 모달 닫기 처리 함수 (currentRoomId 초기화 추가)
  const handleClose = () => {
    setCurrentRoomId(null); // 채팅방 ID 초기화
    onClose(); // 상위 컴포넌트의 onClose 호출
  };

  // 채팅방 목록 로드
  useEffect(() => {
    if (isOpen) {
      loadChatRooms();
      
      // 채팅 모달이 열릴 때 웹소켓 연결이 끊어져 있다면 재연결 시도
      const webSocketService = require('../../service/WebSocketService').default;
      if (!webSocketService.isConnected()) {
        console.log('채팅 모달 열림 - 웹소켓 재연결 시도');
        webSocketService.autoConnect();
      }
    }
  }, [isOpen]);

  // 채팅방 목록 로드 함수
  const loadChatRooms = () => {
    setLoading(true);
    chatService.getChatRooms()
      .then(response => {
        console.log('채팅방 목록 로드됨:', response.data);
        setChatRooms(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('채팅방 목록 로드 오류:', error);
        setLoading(false);
      });
  };

  // 안 읽은 메시지 상태 구독
  useEffect(() => {
    const unsubscribe = chatService.onUnreadMessagesChange((total, byRoom) => {
      setUnreadMessagesByRoom(byRoom);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const handleRoomSelect = (roomId) => {
    setCurrentRoomId(roomId);
    // 채팅방 선택 시 해당 채팅방의 메시지만 읽음 처리 (ChatRoom 컴포넌트에서 처리)
  };

  const handleBackToList = () => {
    setCurrentRoomId(null);
  };

  // 채팅방 목록 렌더링
  const renderChatRooms = () => {
    if (loading) {
      return <LoadingMessage>채팅방 목록을 불러오는 중...</LoadingMessage>;
    }
    
    if (chatRooms.length === 0) {
      return <EmptyMessage>참여 중인 채팅방이 없습니다.</EmptyMessage>;
    }
    
    return (
      <RoomListContainer>
        {chatRooms.map(room => (
          <ChatRoomItem 
            key={room.roomId} 
            onClick={() => handleRoomSelect(room.roomId)}
            isSelected={currentRoomId === room.roomId}
          >
            <RoomInfo>
              <RoomName>{room.roomName || '이름 없는 채팅방'}</RoomName>
              <RoomMembers>{room.memberCount || 0}명 참여 중</RoomMembers>
            </RoomInfo>
            {unreadMessagesByRoom[room.roomId] > 0 && (
              <UnreadBadge>{unreadMessagesByRoom[room.roomId]}</UnreadBadge>
            )}
          </ChatRoomItem>
        ))}
      </RoomListContainer>
    );
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {currentRoomId ? '채팅' : '채팅 목록'}
          </ModalTitle>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalHeader>
        
        <ModalBody>
          {currentRoomId ? (
            <ChatRoomWrapper>
              <BackButton onClick={handleBackToList}>← 목록으로</BackButton>
              <ChatRoom 
                roomId={currentRoomId} 
                isInModal={true}
                onBackClick={handleBackToList}
              />
            </ChatRoomWrapper>
          ) : (
            renderChatRooms()
          )}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 80%;
  max-width: 800px;
  height: 80%;
  max-height: 700px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  
  &:hover {
    color: #333;
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const ChatRoomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #4a6cf7;
  font-weight: bold;
  cursor: pointer;
  text-align: left;
  padding: 10px 15px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const RoomListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
`;

const RoomInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const RoomMembers = styled.span`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
`;

const LoadingMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
`;

const EmptyMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
`;

const ChatRoomItem = styled.div`
  padding: 12px 15px;
  cursor: pointer;
  background-color: ${props => props.isSelected ? '#f0f7ff' : 'white'};
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const RoomName = styled.span`
  font-weight: bold;
`;

const UnreadBadge = styled.div`
  background-color: #f44336;
  color: white;
  font-size: 12px;
  font-weight: bold;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  margin-left: 8px;
`;

export default ChatModal; 