import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import chatService, { markMessagesAsRead, searchMessages } from '../../service/ChatService';
import webSocketService from '../../service/WebSocketService';
import { FaEllipsisV, FaUserPlus, FaSignOutAlt, FaUsers } from 'react-icons/fa';

const ChatRoom = forwardRef(({ roomId: propRoomId, isInModal = false, onBackClick, showMembers, setShowMembers, roomMembers }, ref) => {
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
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const menuRef = useRef(null);
  const processedMessagesRef = useRef(new Set()); // 이미 처리된 메시지 ID를 추적

  // 새로운 기능 상태들
  const [typingUsers, setTypingUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null); // 어떤 메시지에 이모지 피커를 보여줄지
  
  const typingTimerRef = useRef(null);

  // 외부에서 호출할 함수 노출
  useImperativeHandle(ref, () => ({
    toggleInviteForm: () => toggleInviteForm()
  }));

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

        // 읽음 상태 구독
        webSocketService.subscribe(`/topic/chat/room/${roomId}/read`, (updatedMessage) => {
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.messageId === updatedMessage.messageId ? updatedMessage : msg
            )
          );
        });

        // 타이핑 상태 구독
        webSocketService.subscribe(`/topic/chat/room/${roomId}/typing`, (typingData) => {
          if (typingData.senderId !== user.empId) {
            if (typingData.isTyping) {
              setTypingUsers(prev => {
                if (!prev.includes(typingData.senderName)) {
                  return [...prev, typingData.senderName];
                }
                return prev;
              });
            } else {
              setTypingUsers(prev => prev.filter(name => name !== typingData.senderName));
            }
          }
        });

        // 이모지 반응 구독
        webSocketService.subscribe(`/topic/chat/room/${roomId}/reaction`, (reactionData) => {
          setMessages(prevMessages => 
            prevMessages.map(msg => {
              if (msg.messageId === reactionData.messageId) {
                // 반응 업데이트 로직
                const updatedReactions = { ...msg.reactions };
                const emoji = reactionData.emoji;
                const userId = reactionData.userId.toString();
                
                if (reactionData.action === 'add') {
                  if (!updatedReactions[emoji]) {
                    updatedReactions[emoji] = [];
                  }
                  if (!updatedReactions[emoji].includes(userId)) {
                    updatedReactions[emoji].push(userId);
                  }
                } else if (reactionData.action === 'remove') {
                  if (updatedReactions[emoji]) {
                    updatedReactions[emoji] = updatedReactions[emoji].filter(id => id !== userId);
                    if (updatedReactions[emoji].length === 0) {
                      delete updatedReactions[emoji];
                    }
                  }
                }
                
                return { ...msg, reactions: updatedReactions };
              }
              return msg;
            })
          );
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
      webSocketService.unsubscribe(`/topic/chat/room/${roomId}/read`);
      webSocketService.unsubscribe(`/topic/chat/room/${roomId}/typing`);
      webSocketService.unsubscribe(`/topic/chat/room/${roomId}/reaction`);
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
    
    // 타이핑 상태 중지
    handleTypingStop();
    
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
          // 모든 직원 목록을 불러오고, 이미 채팅방에 있는 직원은 표시만 다르게 함
          const currentMemberIds = room.members.map(member => member.empId);
          const allEmployees = response.data.map(emp => ({
            ...emp,
            isInRoom: currentMemberIds.includes(emp.empId)
          }));
          setEmployees(allEmployees);
          setSelectedEmployees([]);
        })
        .catch(error => {
          console.error('직원 목록 로드 오류:', error);
          alert('직원 목록을 불러오는데 실패했습니다.');
        });
    }
  };

  const handleEmployeeSelect = (empId) => {
    // 해당 직원 찾기
    const employee = employees.find(emp => emp.empId === empId);
    
    // 이미 채팅방에 있는 직원이면 선택 불가
    if (employee && employee.isInRoom) {
      return;
    }
    
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
    
    // 로딩 상태 표시
    const loadingMessage = document.createElement('div');
    loadingMessage.style.position = 'fixed';
    loadingMessage.style.top = '50%';
    loadingMessage.style.left = '50%';
    loadingMessage.style.transform = 'translate(-50%, -50%)';
    loadingMessage.style.padding = '15px 20px';
    loadingMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    loadingMessage.style.color = 'white';
    loadingMessage.style.borderRadius = '5px';
    loadingMessage.style.zIndex = '1000';
    loadingMessage.textContent = '초대 중...';
    document.body.appendChild(loadingMessage);
    
    console.log(`초대하기 - 선택된 직원: ${selectedEmployees.join(', ')}`);
    
    chatService.inviteUsersToRoom(roomId, selectedEmployees)
      .then(() => {
        console.log('초대 성공');
        // 초대 메시지 생성
        const inviteMessage = {
          roomId: Number(roomId),
          content: `${user.empName}님이 새로운 멤버를 초대했습니다.`,
          messageType: 'JOIN'
        };
        
        webSocketService.sendMessage('/app/chat.sendMessage', inviteMessage);
        
        // 로딩 메시지 제거
        try {
          document.body.removeChild(loadingMessage);
        } catch (e) {
          console.error('로딩 메시지 제거 오류:', e);
        }
        
        // 폼 닫기 및 채팅방 정보 새로고침
        setShowInviteForm(false);
        loadChatRoomData();
        
        // 성공 메시지 표시
        setTimeout(() => {
          alert('선택한 멤버를 채팅방에 초대했습니다.');
        }, 100);
      })
      .catch(error => {
        console.error('초대 오류:', error);
        
        // 로딩 메시지 제거
        try {
          document.body.removeChild(loadingMessage);
        } catch (e) {
          console.error('로딩 메시지 제거 오류:', e);
        }
        
        // 자세한 오류 메시지 표시
        let errorMessage = '초대에 실패했습니다.';
        if (error.response) {
          console.log('Error response:', error.response);
          if (error.response.data && error.response.data.message) {
            errorMessage += ` (${error.response.data.message})`;
          } else if (error.response.status === 403) {
            errorMessage += ' (권한이 없습니다)';
          } else if (error.response.status === 404) {
            errorMessage += ' (채팅방 또는 사용자를 찾을 수 없습니다)';
          }
        }
        
        alert(errorMessage);
      });
  };

  // 참여 인원 모달 닫기
  const handleCloseMembers = () => setShowMembers && setShowMembers(false);

  // 타이핑 상태 처리
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    // 타이핑 시작 알림
    webSocketService.sendMessage('/app/chat.typing', {
      roomId: Number(roomId),
      isTyping: true
    });
    
    // 기존 타이머 클리어
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    
    // 3초 후 타이핑 중지
    typingTimerRef.current = setTimeout(() => {
      handleTypingStop();
    }, 3000);
  };

  const handleTypingStop = () => {
    webSocketService.sendMessage('/app/chat.typing', {
      roomId: Number(roomId),
      isTyping: false
    });
    
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
  };

  // 이모지 반응 처리
  const handleEmojiReaction = (messageId, emoji) => {
    const message = messages.find(m => m.messageId === messageId);
    const currentUserReactions = message?.reactions?.[emoji] || [];
    const hasReacted = currentUserReactions.includes(user.empId.toString());
    
    webSocketService.sendMessage('/app/chat.reaction', {
      messageId: messageId,
      emoji: emoji,
      action: hasReacted ? 'remove' : 'add'
    });
    
    setShowEmojiPicker(null);
  };

  // 메시지 검색
  const handleSearch = async () => {
    if (searchTerm.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    
    try {
      const results = await searchMessages(roomId, searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('검색 실패:', error);
    }
  };

  // 검색어 변경 시 자동 검색
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

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
          <BackButton onClick={handleBackClick}>{'< 목록으로'}</BackButton>
          <RoomInfo>
            <h2>{room?.roomName}</h2>
          </RoomInfo>
          <MenuWrapper ref={menuRef}>
            <ShowMembersButton onClick={() => setShowMembers(true)}>
              <FaUsers /> 인원 {room?.members?.length || 0}명
            </ShowMembersButton>
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
        <InviteFormContainer $isInModal={isInModal}>
          <InviteFormHeader>
            <h3>대화상대 초대</h3>
            <CloseButton onClick={toggleInviteForm}>×</CloseButton>
          </InviteFormHeader>
          <EmployeeList $isInModal={isInModal}>
            {employees.length === 0 ? (
              <EmptyMessage>초대할 수 있는 직원이 없습니다.</EmptyMessage>
            ) : (
              employees.map(employee => (
                <EmployeeItem 
                  key={employee.empId}
                  $selected={selectedEmployees.includes(employee.empId)}
                  $disabled={employee.isInRoom}
                  onClick={() => handleEmployeeSelect(employee.empId)}
                >
                  <ProfileImage $disabled={employee.isInRoom}>
                    {employee.empImg ? 
                      <img src={employee.empImg} alt={employee.empName} /> : 
                      <div className="initials">{employee.empName.charAt(0)}</div>
                    }
                  </ProfileImage>
                  <EmployeeInfo $disabled={employee.isInRoom}>
                    <div className="name">{employee.empName}</div>
                    <div className="role">{employee.deptName} - {employee.empRole}</div>
                    {employee.isInRoom && <div className="status">이미 참여 중</div>}
                  </EmployeeInfo>
                  {!employee.isInRoom && (
                    <Checkbox checked={selectedEmployees.includes(employee.empId)} />
                  )}
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

      {!isInModal && showMembers && (
        <MembersOverlay onClick={handleCloseMembers}>
          <MembersModal onClick={e => e.stopPropagation()}>
            <h3>참여 인원</h3>
            <ul>
              {room?.members && room.members.length > 0 ? (
                room.members.map(member => (
                  <li key={member.empId}>
                    <ProfileImg src={member.empImg} alt={member.empName} />
                    <span>{member.empName} ({member.deptName} / {member.empRole})</span>
                  </li>
                ))
              ) : (
                <li>참여 인원이 없습니다.</li>
              )}
            </ul>
            <CloseButton onClick={handleCloseMembers}>닫기</CloseButton>
          </MembersModal>
        </MembersOverlay>
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
                  <MessageActions>
                    <EmojiButton onClick={() => setShowEmojiPicker(message.messageId)}>
                      😊
                    </EmojiButton>
                    {user && message.senderId === user.empId && message.isRead && (
                      <ReadStatus>✓✓</ReadStatus>
                    )}
                    {user && message.senderId === user.empId && !message.isRead && (
                      <ReadStatus $unread>✓</ReadStatus>
                    )}
                  </MessageActions>
                </MessageContent>
                
                {/* 이모지 반응 표시 */}
                {message.reactions && Object.keys(message.reactions).length > 0 && (
                  <ReactionsContainer>
                    {Object.entries(message.reactions).map(([emoji, users]) => (
                      <ReactionButton 
                        key={emoji}
                        onClick={() => handleEmojiReaction(message.messageId, emoji)}
                        $hasReacted={users.includes(user.empId.toString())}
                      >
                        {emoji} {users.length}
                      </ReactionButton>
                    ))}
                  </ReactionsContainer>
                )}
                
                {/* 이모지 피커 */}
                {showEmojiPicker === message.messageId && (
                  <EmojiPicker>
                    {['👍', '❤️', '😂', '😮', '😢', '😡'].map(emoji => (
                      <EmojiOption 
                        key={emoji}
                        onClick={() => handleEmojiReaction(message.messageId, emoji)}
                      >
                        {emoji}
                      </EmojiOption>
                    ))}
                  </EmojiPicker>
                )}
                
                <MessageTime>
                  {new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </MessageTime>
              </>
            )}
          </MessageItem>
        ))}
        
        {/* 타이핑 인디케이터 */}
        {typingUsers.length > 0 && (
          <TypingIndicator>
            {typingUsers.join(', ')}님이 입력 중<TypingDots>...</TypingDots>
          </TypingIndicator>
        )}
        
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <MessageInputForm onSubmit={handleSendMessage}>
        <MessageInput 
          type="text" 
          value={newMessage} 
          onChange={handleInputChange} 
          placeholder="메시지를 입력하세요"
        />
        <SendButton type="submit" disabled={!newMessage.trim()}>전송</SendButton>
      </MessageInputForm>
    </Container>
  );
});

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
  z-index: 100;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  ${props => props.$isInModal && `
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding-bottom: 80px;
    z-index: 150;
  `}
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
  max-height: ${props => props.$isInModal ? 'calc(100% - 120px)' : 'calc(100% - 100px)'};
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
  cursor: ${props => props.$disabled ? 'default' : 'pointer'};
  border-radius: 4px;
  background-color: ${props => {
    if (props.$disabled) return '#f0f0f0';
    return props.$selected ? '#f0f4ff' : 'transparent';
  }};
  opacity: ${props => props.$disabled ? 0.7 : 1};
  
  &:hover {
    background-color: ${props => {
      if (props.$disabled) return '#f0f0f0';
      return props.$selected ? '#e6edff' : '#f5f5f5';
    }};
  }
`;

const ProfileImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  overflow: hidden;
  opacity: ${props => props.$disabled ? 0.7 : 1};
  
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
    background-color: ${props => props.$disabled ? '#aaaaaa' : '#4a6cf7'};
    color: white;
    font-weight: bold;
  }
`;

const EmployeeInfo = styled.div`
  flex: 1;
  
  .name {
    font-weight: bold;
    margin-bottom: 3px;
    color: ${props => props.$disabled ? '#777777' : 'inherit'};
  }
  
  .role {
    font-size: 12px;
    color: ${props => props.$disabled ? '#999999' : '#666'};
  }
  
  .status {
    font-size: 11px;
    color: #888;
    font-style: italic;
    margin-top: 2px;
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
  padding-top: 15px;
  border-top: 1px solid #eee;
  margin-top: auto;
  background-color: white;
  width: 100%;
`;

const InviteButton = styled.button`
  background-color: #4a6cf7;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  
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
  font-size: 14px;
  
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

const ShowMembersButton = styled.button`
  background: none;
  border: none;
  color: #4a6cf7;
  margin-left: 10px;
  cursor: pointer;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  &:hover { text-decoration: underline; }
`;

const MembersOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MembersModal = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 30px 24px 20px 24px;
  min-width: 300px;
  max-width: 90vw;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  h3 { margin-top: 0; }
  ul { list-style: none; padding: 0; margin: 0 0 16px 0; }
  li { display: flex; align-items: center; margin-bottom: 10px; }
  span { margin-left: 10px; }
`;

const ProfileImg = styled.img`
  width: 32px; height: 32px; border-radius: 50%; object-fit: cover;
  background: #eee;
`;

const ModalRoomHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 10px 15px 0 15px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  position: sticky;
  top: 0;
  z-index: 20;
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  color: #666;
  font-style: italic;
  font-size: 14px;
  padding: 10px 0;
`;

const TypingDots = styled.span`
  margin-left: 5px;
  animation: blink 1.5s infinite;
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;

const MessageActions = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  display: flex;
  gap: 5px;
  opacity: 0;
  transition: opacity 0.2s;
`;

const EmojiButton = styled.button`
  background: white;
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const ReadStatus = styled.span`
  font-size: 12px;
  color: ${props => props.$unread ? '#6c757d' : '#28a745'};
  margin-left: 5px;
`;

const ReactionsContainer = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 5px;
  flex-wrap: wrap;
`;

const ReactionButton = styled.button`
  background-color: ${props => props.$hasReacted ? '#e3f2fd' : '#f8f9fa'};
  border: 1px solid ${props => props.$hasReacted ? '#2196f3' : '#ddd'};
  border-radius: 12px;
  padding: 2px 6px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.$hasReacted ? '#bbdefb' : '#e9ecef'};
  }
`;

const EmojiPicker = styled.div`
  position: absolute;
  top: -40px;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 5px;
  display: flex;
  gap: 5px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 100;
`;

const EmojiOption = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

export default ChatRoom;