import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatRoomList from './ChatRoomList';
import ChatRoom from './ChatRoom';
import chatService from '../../service/ChatService';
import webSocketService from '../../service/WebSocketService';
import { FaUserFriends, FaUsers, FaEllipsisV } from 'react-icons/fa';

const ChatModal = ({ isOpen, onClose }) => {
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChatList, setShowChatList] = useState(true);
  const [showNewChatForm, setShowNewChatForm] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [unreadMessagesByRoom, setUnreadMessagesByRoom] = useState({});
  const [showRoomMenu, setShowRoomMenu] = useState(false);

  // 모달 닫기 처리 함수
  const handleClose = () => {
    setCurrentRoomId(null);
    setShowChatList(true);
    setShowNewChatForm(false);
    onClose();
  };

  // 앱 초기화 시 웹소켓 연결 설정
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('로그인이 필요합니다.');
      return;
    }
    
    if (!webSocketService.isConnected()) {
      console.log('웹소켓 연결 시도');
      webSocketService.autoConnect();
    }
    
    return () => {
      // 의도적으로 연결을 유지
    };
  }, []);

  // 모달이 열리거나 닫힐 때 처리
  useEffect(() => {
    if (isOpen) {
      loadChatRooms();
      loadEmployees();
    }
  }, [isOpen]);

  // 채팅방 목록 로드 함수
  const loadChatRooms = () => {
    setLoading(true);
    chatService.getChatRooms()
      .then(response => {
        const sortedRooms = sortRoomsByLatestMessage(response.data);
        setChatRooms(sortedRooms);
        setLoading(false);
      })
      .catch(error => {
        console.error('채팅방 목록 로드 오류:', error);
        setLoading(false);
      });
  };

  // 채팅방을 최근 메시지 순으로 정렬
  const sortRoomsByLatestMessage = (roomsList) => {
    return [...roomsList].sort((a, b) => {
      const timeA = a.lastMessageTime || a.createdAt || '0';
      const timeB = b.lastMessageTime || b.createdAt || '0';
      return new Date(timeB) - new Date(timeA);
    });
  };

  // 새 메시지가 도착했을 때 채팅방 정보 업데이트
  const updateRoomWithNewMessage = (roomId, message) => {
    setChatRooms(prevRooms => {
      const roomIndex = prevRooms.findIndex(room => room.roomId === roomId);
      if (roomIndex === -1) {
        loadChatRooms();
        return prevRooms;
      }
      
      const updatedRooms = [...prevRooms];
      updatedRooms[roomIndex] = {
        ...updatedRooms[roomIndex],
        lastMessage: message.content,
        lastMessageTime: message.sentAt
      };
      
      return sortRoomsByLatestMessage(updatedRooms);
    });
  };

  // 웹소켓 메시지 구독
  useEffect(() => {
    const handleNewMessage = (message) => {
      if (message.roomId && isOpen) {
        updateRoomWithNewMessage(message.roomId, message);
      }
    };
    
    webSocketService.subscribe('/topic/chat/messages/modal', handleNewMessage);
    
    return () => {
      webSocketService.unsubscribe('/topic/chat/messages/modal');
    };
  }, [isOpen]);

  const loadEmployees = () => {
    chatService.getHeadquartersEmployees()
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error('직원 목록 로드 오류:', error);
      });
  };

  const handleRoomSelect = (roomId) => {
    setCurrentRoomId(roomId);
    // 채팅방 선택 시 해당 방의 안읽은 메시지 초기화
    chatService.markRoomMessagesAsRead(roomId);
  };

  const handleBackToList = () => {
    setCurrentRoomId(null);
    setShowChatList(true);
    setShowNewChatForm(false);
    setShowRoomMenu(false);
    loadChatRooms();
  };

  // 새 채팅방 생성 화면으로 전환
  const handleCreateNewChat = () => {
    setShowNewChatForm(true);
    setRoomName('');
    setSelectedEmployees([]);
  };

  const handleEmployeeSelect = (empId) => {
    if (selectedEmployees.includes(empId)) {
      setSelectedEmployees(selectedEmployees.filter(id => id !== empId));
    } else {
      setSelectedEmployees([...selectedEmployees, empId]);
    }
  };

  const createChatRoom = () => {
    if (selectedEmployees.length === 0) {
      alert('대화 상대를 선택해주세요.');
      return;
    }

    const roomType = selectedEmployees.length > 1 ? 'GROUP' : 'INDIVIDUAL';
    const name = roomType === 'GROUP' && roomName.trim() ? 
                roomName : 
                '새 채팅방';

    chatService.createChatRoom(name, roomType, selectedEmployees)
      .then(response => {
        setShowNewChatForm(false);
        handleRoomSelect(response.data.roomId);
      })
      .catch(error => {
        console.error('채팅방 생성 오류:', error);
        alert('채팅방 생성에 실패했습니다.');
      });
  };

  // 채팅방 나가기 처리
  const handleLeaveRoom = () => {
    if (!currentRoomId) return;
    
    if (window.confirm('정말로 채팅방을 나가시겠습니까?')) {
      const empName = localStorage.getItem('empName');
      
      chatService.leaveChatRoom(currentRoomId)
        .then(() => {
          // 퇴장 메시지 전송
          const leaveMessage = {
            roomId: Number(currentRoomId),
            content: `${empName}님이 퇴장하였습니다.`,
            messageType: 'LEAVE'
          };
          
          webSocketService.sendMessage('/app/chat.sendMessage', leaveMessage);
          
          // 채팅 목록으로 이동
          handleBackToList();
        })
        .catch(error => {
          console.error('채팅방 나가기 오류:', error);
          alert('채팅방 나가기에 실패했습니다.');
        });
    }
  };

  // 룸 메뉴 토글
  const toggleRoomMenu = () => {
    setShowRoomMenu(!showRoomMenu);
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
            $isSelected={currentRoomId === room.roomId}
          >
            <RoomTypeIcon>
              {room.roomType === 'INDIVIDUAL' ? 
                <FaUserFriends color="#4a6cf7" size={20} /> : 
                <FaUsers color="#4a6cf7" size={20} />
              }
            </RoomTypeIcon>
            <RoomInfo>
              <RoomName>{room.roomName || '이름 없는 채팅방'}</RoomName>
              <LastMessageWrapper>
                <LastMessage>{room.lastMessage || '새 채팅방'}</LastMessage>
                <LastMessageTime>
                  {room.lastMessageTime ? new Date(room.lastMessageTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                </LastMessageTime>
              </LastMessageWrapper>
              <RoomMembers>
                {room.members ? room.members.length : 0}명 참여 중
              </RoomMembers>
            </RoomInfo>
            {unreadMessagesByRoom[room.roomId] > 0 && (
              <UnreadBadge>{unreadMessagesByRoom[room.roomId]}</UnreadBadge>
            )}
          </ChatRoomItem>
        ))}
      </RoomListContainer>
    );
  };

  // 새 채팅방 생성 폼 렌더링
  const renderNewChatForm = () => {
    return (
      <NewChatForm>
        <h3>새 채팅방</h3>
        {selectedEmployees.length > 1 && (
          <InputField>
            <label>채팅방 이름</label>
            <input 
              type="text" 
              value={roomName} 
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="채팅방 이름을 입력하세요"
            />
          </InputField>
        )}
        
        <EmployeeList>
          <h4>대화 상대 선택</h4>
          {employees.map(employee => (
            <EmployeeItem 
              key={employee.empId}
              $selected={selectedEmployees.includes(employee.empId)}
              onClick={() => handleEmployeeSelect(employee.empId)}
            >
              <ProfileImage>
                {employee.empImg ? 
                  <img src={employee.empImg} alt={employee.empName} /> : 
                  <div className="initials">{employee.empName.charAt(0)}</div>
                }
              </ProfileImage>
              <EmployeeInfo>
                <div className="name">{employee.empName}</div>
                <div className="role">{employee.deptName} - {employee.empRole}</div>
              </EmployeeInfo>
              <Checkbox checked={selectedEmployees.includes(employee.empId)} />
            </EmployeeItem>
          ))}
        </EmployeeList>
        
        <ButtonContainer>
          <CancelButton onClick={handleBackToList}>취소</CancelButton>
          <CreateButton onClick={createChatRoom}>채팅방 생성</CreateButton>
        </ButtonContainer>
      </NewChatForm>
    );
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {currentRoomId ? '채팅' : (showNewChatForm ? '새 채팅방' : '채팅 목록')}
          </ModalTitle>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalHeader>
        
        <ModalBody>
          {currentRoomId ? (
            <ChatRoomWrapper>
              <ModalRoomHeader>
                <BackButton onClick={handleBackToList}>← 목록으로</BackButton>
                <MenuButton onClick={toggleRoomMenu}>
                  <FaEllipsisV />
                </MenuButton>
                {showRoomMenu && (
                  <MenuDropdown>
                    <MenuItem onClick={() => {
                      setShowRoomMenu(false);
                      const roomElement = document.querySelector('.chat-room-component');
                      if (roomElement) {
                        const inviteButton = roomElement.querySelector('.invite-button');
                        if (inviteButton) {
                          inviteButton.click();
                        } else {
                          alert('초대 기능을 사용할 수 없습니다.');
                        }
                      }
                    }}>
                      초대하기
                    </MenuItem>
                    <MenuItem onClick={() => {
                      setShowRoomMenu(false);
                      handleLeaveRoom();
                    }}>
                      나가기
                    </MenuItem>
                  </MenuDropdown>
                )}
              </ModalRoomHeader>
              <ChatRoom 
                roomId={currentRoomId} 
                isInModal={true}
                onBackClick={handleBackToList}
              />
            </ChatRoomWrapper>
          ) : showNewChatForm ? (
            renderNewChatForm()
          ) : (
            <>
              <ChatListHeader>
                <NewChatButton onClick={handleCreateNewChat}>새 채팅방</NewChatButton>
              </ChatListHeader>
              {renderChatRooms()}
            </>
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
  position: relative;
`;

const ModalRoomHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 16px;
  padding: 5px 10px;
  
  &:hover {
    color: #333;
  }
`;

const MenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 15px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 120px;
  z-index: 10;
`;

const MenuItem = styled.div`
  padding: 8px 15px;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #4a6cf7;
  font-weight: bold;
  cursor: pointer;
  text-align: left;
  padding: 5px 0;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ChatListHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
`;

const NewChatButton = styled.button`
  background-color: #4a6cf7;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background-color: #3a5ce5;
  }
`;

const RoomListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
`;

const RoomTypeIcon = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
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

const LastMessageWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
`;

const LastMessage = styled.div`
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
`;

const LastMessageTime = styled.div`
  font-size: 11px;
  color: #999;
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
  background-color: ${props => props.$isSelected ? '#f0f7ff' : 'white'};
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const RoomName = styled.div`
  font-weight: bold;
`;

const NewChatForm = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  
  h3 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #333;
  }
  
  h4 {
    margin-top: 20px;
    margin-bottom: 10px;
    color: #555;
  }
`;

const InputField = styled.div`
  margin-bottom: 15px;
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
  }
  
  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #4a6cf7;
    }
  }
`;

const EmployeeList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const EmployeeItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
  background-color: ${props => props.$selected ? '#f0f4ff' : 'transparent'};
  
  &:hover {
    background-color: ${props => props.$selected ? '#e6edff' : '#f5f5f5'};
  }
`;

const ProfileImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .initials {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #4a6cf7;
    color: white;
    font-weight: bold;
  }
`;

const EmployeeInfo = styled.div`
  flex: 1;
  
  .name {
    font-weight: bold;
    margin-bottom: 3px;
  }
  
  .role {
    font-size: 12px;
    color: #666;
  }
`;

const Checkbox = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${props => props.checked ? '#4a6cf7' : '#ddd'};
  background-color: ${props => props.checked ? '#4a6cf7' : 'white'};
  position: relative;
  
  &::after {
    content: '';
    display: ${props => props.checked ? 'block' : 'none'};
    width: 6px;
    height: 12px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    position: absolute;
    top: 2px;
    left: 6px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const CreateButton = styled.button`
  background-color: #4a6cf7;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: bold;
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background-color: #3a5ce5;
  }
`;

const CancelButton = styled.button`
  background-color: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const UnreadBadge = styled.div`
  background-color: #ff3b30;
  color: white;
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 0 6px;
  margin-left: 8px;
`;

export default ChatModal; 