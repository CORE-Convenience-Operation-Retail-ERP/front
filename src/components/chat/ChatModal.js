import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatRoomList from './ChatRoomList';
import ChatRoom from './ChatRoom';
import chatService from '../../service/ChatService';

const ChatModal = ({ isOpen, onClose }) => {
  const [currentRoomId, setCurrentRoomId] = useState(null);

  // 모달이 열리면 읽음 처리
  useEffect(() => {
    if (isOpen) {
      chatService.markMessagesAsRead();
      console.log('채팅 모달 열림 - 읽음 처리');
    }
  }, [isOpen]);

  const handleRoomSelect = (roomId) => {
    setCurrentRoomId(roomId);
  };

  const handleBackToList = () => {
    setCurrentRoomId(null);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {currentRoomId ? '채팅' : '채팅 목록'}
          </ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
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
            <ChatRoomList 
              isInModal={true} 
              onRoomSelect={handleRoomSelect}
            />
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

export default ChatModal; 