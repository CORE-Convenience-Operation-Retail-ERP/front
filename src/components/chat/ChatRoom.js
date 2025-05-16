import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import chatService from '../../service/ChatService';
import webSocketService from '../../service/WebSocketService';
import { FaEllipsisV, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';

const ChatRoom = ({ roomId: propRoomId, isInModal = false, onBackClick }) => {
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [memberProfiles, setMemberProfiles] = useState({}); // 멤버 프로필 정보 캐시
  
  const params = useParams();
  const routeRoomId = params?.roomId;
  const roomId = propRoomId || routeRoomId;
  
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const menuRef = useRef(null);
  const processedMessagesRef = useRef(new Set()); // 이미 처리된 메시지 ID를 추적

  // 채팅방 입장 시 해당 채팅방의 알림 카운트를 초기화
  useEffect(() => {
    if (roomId) {
      chatService.markRoomMessagesAsRead(roomId);
    }
  }, [roomId]);

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

    // 웹소켓 연결
    webSocketService.connect(token, 
      () => {
        loadChatRoomData();
        
        // 메시지 구독
        webSocketService.subscribe(`/topic/chat/room/${roomId}`, (message) => {
          // 메시지 ID가 있는지 확인하고 중복 제거
          const messageId = message.messageId || `${message.sentAt}_${message.senderId}_${message.content}`;
          
          if (!processedMessagesRef.current.has(messageId)) {
            processedMessagesRef.current.add(messageId);
            setMessages(prevMessages => [...prevMessages, message]);
            scrollToBottom();
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

    return () => {
      // 구독 해제
      webSocketService.unsubscribe(`/topic/chat/room/${roomId}`);
    };
  }, [roomId, navigate, isInModal]);

  // 메뉴 외부 클릭 처리
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadChatRoomData = () => {
    // 채팅방 정보 로드
    chatService.getChatRoom(roomId)
      .then(roomResponse => {
        const roomData = roomResponse.data;
        setRoom(roomData);
        
        // 멤버 프로필 정보 캐싱
        const profiles = {};
        if (roomData.members && roomData.members.length > 0) {
          roomData.members.forEach(member => {
            profiles[member.empId] = {
              name: member.empName,
              img: member.empImg || null,
              deptName: member.deptName || '',
              empRole: member.empRole || ''
            };
          });
          setMemberProfiles(profiles);
        }
        
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

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLeaveRoom = () => {
    if (window.confirm('정말로 채팅방을 나가시겠습니까?')) {
      setShowMenu(false);
      
      chatService.leaveChatRoom(roomId)
        .then(() => {
          // 퇴장 메시지 전송
          const leaveMessage = {
            roomId: Number(roomId),
            content: `${user.empName}님이 퇴장하였습니다.`,
            messageType: 'LEAVE'
          };
          
          webSocketService.sendMessage('/app/chat.sendMessage', leaveMessage);
          
          // 이전 화면으로 이동
          handleBackClick();
        })
        .catch(error => {
          console.error('채팅방 나가기 오류:', error);
          alert('채팅방 나가기에 실패했습니다.');
        });
    }
  };

  const toggleInviteForm = () => {
    setShowInviteForm(!showInviteForm);
    setShowMenu(false);
    
    if (!showInviteForm) {
      // 초대 폼이 열릴 때 직원 목록 로드
      chatService.getHeadquartersEmployees()
        .then(response => {
          // 현재 방에 없는 직원만 필터링
          const currentMemberIds = room.members.map(member => member.empId);
          const filteredEmployees = response.data.filter(
            emp => !currentMemberIds.includes(emp.empId)
          );
          setEmployees(filteredEmployees);
          setSelectedEmployees([]);
        })
        .catch(error => {
          console.error('직원 목록 로드 오류:', error);
          alert('직원 목록을 불러오는데 실패했습니다.');
        });
    }
  };

  const handleEmployeeSelect = (empId) => {
    if (selectedEmployees.includes(empId)) {
      setSelectedEmployees(selectedEmployees.filter(id => id !== empId));
    } else {
      setSelectedEmployees([...selectedEmployees, empId]);
    }
  };

  const handleInviteUsers = () => {
    if (selectedEmployees.length === 0) {
      alert('초대할 직원을 선택해주세요.');
      return;
    }
    
    chatService.inviteUsersToRoom(roomId, selectedEmployees)
      .then(() => {
        // 초대 메시지 생성
        const inviteMessage = {
          roomId: Number(roomId),
          content: `${user.empName}님이 새로운 멤버를 초대했습니다.`,
          messageType: 'JOIN'
        };
        
        webSocketService.sendMessage('/app/chat.sendMessage', inviteMessage);
        
        // 폼 닫기 및 채팅방 정보 새로고침
        setShowInviteForm(false);
        loadChatRoomData();
      })
      .catch(error => {
        console.error('초대 오류:', error);
        alert('초대에 실패했습니다.');
      });
  };

  if (loading) {
    return <Container $isInModal={isInModal}><p>로딩 중...</p></Container>;
  }

  if (error) {
    return <Container $isInModal={isInModal}><p>오류: {error}</p></Container>;
  }

  return (
    <Container $isInModal={isInModal} className="chat-room-component">
      {!isInModal && (
        <Header>
          <BackButton onClick={handleBackClick}>{'< 뒤로'}</BackButton>
          <RoomInfo>
            <h2>{room?.roomName}</h2>
            <MemberCount>{room?.members?.length || 0}명 참여</MemberCount>
          </RoomInfo>
          <MenuWrapper ref={menuRef}>
            <MenuButton onClick={toggleMenu}>
              <FaEllipsisV />
            </MenuButton>
            {showMenu && (
              <MenuDropdown>
                <MenuItem onClick={toggleInviteForm} className="invite-button">
                  <FaUserPlus /> 초대하기
                </MenuItem>
                <MenuItem onClick={handleLeaveRoom}>
                  <FaSignOutAlt /> 나가기
                </MenuItem>
              </MenuDropdown>
            )}
          </MenuWrapper>
        </Header>
      )}

      {showInviteForm && (
        <InviteFormContainer>
          <InviteFormHeader>
            <h3>대화상대 초대</h3>
            <CloseButton onClick={toggleInviteForm}>×</CloseButton>
          </InviteFormHeader>
          <EmployeeList>
            {employees.length === 0 ? (
              <EmptyMessage>초대할 수 있는 직원이 없습니다.</EmptyMessage>
            ) : (
              employees.map(employee => (
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
              ))
            )}
          </EmployeeList>
          <InviteButtonContainer>
            <CancelButton onClick={toggleInviteForm}>취소</CancelButton>
            <InviteButton 
              onClick={handleInviteUsers}
              disabled={selectedEmployees.length === 0}
            >
              초대하기
            </InviteButton>
          </InviteButtonContainer>
        </InviteFormContainer>
      )}

      <MessagesContainer ref={messagesContainerRef} $isInModal={isInModal} $isOverlaid={showInviteForm}>
        {messages.map((message, index) => (
          <MessageItem 
            key={index} 
            $isCurrentUser={user && message.senderId === user.empId}
            $messageType={message.messageType}
          >
            {message.messageType === 'JOIN' || message.messageType === 'LEAVE' ? (
              <SystemMessage>{message.content}</SystemMessage>
            ) : (
              <>
                {(!user || message.senderId !== user.empId) && (
                  <SenderWrapper>
                    <SenderProfileImage>
                      {memberProfiles[message.senderId]?.img ? (
                        <img 
                          src={memberProfiles[message.senderId].img} 
                          alt={message.senderName} 
                        />
                      ) : (
                        <div className="initials">
                          {message.senderName ? message.senderName.charAt(0) : '?'}
                        </div>
                      )}
                    </SenderProfileImage>
                    <SenderName>{message.senderName}</SenderName>
                  </SenderWrapper>
                )}
                <MessageContent $isCurrentUser={user && message.senderId === user.empId}>
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
  position: relative;
  
  ${props => props.$isInModal && `
    padding-top: 0;
  `}
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
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

const MenuWrapper = styled.div`
  position: relative;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 18px;
  padding: 5px 10px;
  
  &:hover {
    color: #333;
  }
`;

const MenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  z-index: 10;
`;

const MenuItem = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const InviteFormContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  z-index: 5;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const InviteFormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  
  h3 {
    margin: 0;
    font-size: 18px;
  }
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

const EmployeeList = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 15px;
`;

const EmptyMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
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

const InviteButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const InviteButton = styled.button`
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

const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  ${props => props.$isInModal && `
    height: calc(100% - 65px);
    padding-bottom: 80px; /* 입력 영역을 위한 패딩 추가 */
  `}
  
  ${props => props.$isOverlaid && `
    filter: blur(3px);
    pointer-events: none;
  `}
`;

const MessageItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$isCurrentUser ? 'flex-end' : 'flex-start'};
  max-width: 80%;
  align-self: ${props => props.$isCurrentUser ? 'flex-end' : 'flex-start'};
  
  ${props => (props.$messageType === 'JOIN' || props.$messageType === 'LEAVE') && `
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

const SenderWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  padding-left: 10px;
`;

const SenderProfileImage = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 6px;
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
    font-weight: 500;
    font-size: 12px;
  }
`;

const SenderName = styled.div`
  font-size: 12px;
  color: #666;
`;

const MessageContent = styled.div`
  background-color: ${props => props.$isCurrentUser ? '#4a6cf7' : 'white'};
  color: ${props => props.$isCurrentUser ? 'white' : '#333'};
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
  position: sticky;
  bottom: 0;
  z-index: 5;
  width: 100%;
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