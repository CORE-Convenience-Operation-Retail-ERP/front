import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import chatService from '../../service/ChatService';
import webSocketService from '../../service/WebSocketService';

const ChatRoomList = ({ isInModal = false, onRoomSelect }) => {
  const [rooms, setRooms] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewChatForm, setShowNewChatForm] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  
  const navigate = useNavigate();
  const stopPollingRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    // 로그인 상태 확인 (개별 필드로 확인)
    try {
      const empId = localStorage.getItem('empId');
      const deptId = localStorage.getItem('deptId');
      
      if (!empId || !deptId) {
        setError('사용자 정보가 없습니다. 다시 로그인해주세요.');
        setLoading(false);
        return;
      }
      
      // 본사 직원(deptId 4~10)인지 확인
      const deptIdNum = parseInt(deptId);
      if (deptIdNum < 4 || deptIdNum > 10) {
        setError('본사 직원만 채팅 기능을 사용할 수 있습니다.');
        setLoading(false);
        return;
      }
      
    } catch (err) {
      console.error('사용자 정보를 불러오는데 실패했습니다.', err);
      setError('사용자 정보를 불러오는데 실패했습니다.');
      setLoading(false);
      return;
    }

    // 웹소켓 연결
    webSocketService.connect(token, 
      () => {
        console.log('웹소켓 연결 성공');
        loadEmployees();
        
        // 폴링 방식으로 채팅방 목록 업데이트 (5초마다)
        stopPollingRef.current = chatService.pollChatRooms(5000, (roomsData) => {
          // 최근 메시지 순으로 정렬
          const sortedRooms = sortRoomsByLatestMessage(roomsData);
          setRooms(sortedRooms);
          if (loading) setLoading(false);
        });
        
        // 채팅방 업데이트를 위한 여러 가능한 토픽 구독 시도
        try {
          // 채팅방 업데이트 구독
          webSocketService.subscribe('/topic/chat/rooms/update', (event) => {
            console.log('채팅방 업데이트 이벤트 수신:', event);
            if (event.eventType === 'MESSAGE_RECEIVED') {
              // 메시지가 도착한 채팅방 정보 업데이트
              updateRoomWithNewMessage(event.roomId, event.message);
            }
          });
          
          // 다른 가능한 토픽도 구독
          webSocketService.subscribe('/topic/chat/rooms', (event) => {
            console.log('채팅방 일반 이벤트 수신:', event);
            // 방 목록 갱신
            loadRoomsAndSort();
          });
          
          webSocketService.subscribe('/topic/chat/message', (message) => {
            console.log('일반 메시지 이벤트 수신:', message);
            if (message.roomId) {
              updateRoomWithNewMessage(message.roomId, message);
            }
          });
        } catch (err) {
          console.error('웹소켓 구독 오류:', err);
        }
      }, 
      (error) => {
        console.error('웹소켓 연결 실패:', error);
        setError('웹소켓 연결에 실패했습니다.');
        setLoading(false);
      }
    );

    return () => {
      // 폴링 중지
      if (stopPollingRef.current) {
        stopPollingRef.current();
      }
      webSocketService.unsubscribe('/topic/chat/rooms/update');
      webSocketService.unsubscribe('/topic/chat/rooms');
      webSocketService.unsubscribe('/topic/chat/message');
      webSocketService.disconnect();
    };
  }, [loading]);

  // 채팅방 로드 및 정렬
  const loadRoomsAndSort = () => {
    chatService.getChatRooms()
      .then(response => {
        const sortedRooms = sortRoomsByLatestMessage(response.data);
        setRooms(sortedRooms);
      })
      .catch(error => {
        console.error('채팅방 목록 로드 오류:', error);
      });
  };

  // 채팅방을 최근 메시지 순으로 정렬
  const sortRoomsByLatestMessage = (roomsList) => {
    return [...roomsList].sort((a, b) => {
      // lastMessageTime이 없는 경우 createdAt 사용
      const timeA = a.lastMessageTime || a.createdAt || '0';
      const timeB = b.lastMessageTime || b.createdAt || '0';
      
      // 내림차순 정렬 (최신이 위로)
      return new Date(timeB) - new Date(timeA);
    });
  };

  // 새 메시지가 도착했을 때 채팅방 정보 업데이트
  const updateRoomWithNewMessage = (roomId, message) => {
    console.log('채팅방 메시지 업데이트:', {roomId, message});
    setRooms(prevRooms => {
      // 해당 채팅방 찾기
      const roomIndex = prevRooms.findIndex(room => room.roomId === roomId);
      if (roomIndex === -1) {
        // 채팅방이 없으면 목록 다시 로드
        loadRoomsAndSort();
        return prevRooms;
      }
      
      // 새 채팅방 목록 생성
      const updatedRooms = [...prevRooms];
      
      // 채팅방 정보 업데이트
      updatedRooms[roomIndex] = {
        ...updatedRooms[roomIndex],
        lastMessage: message.content,
        lastMessageTime: message.sentAt
      };
      
      // 최근 메시지 순으로 정렬
      return sortRoomsByLatestMessage(updatedRooms);
    });
  };

  const loadEmployees = () => {
    chatService.getHeadquartersEmployees()
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error('직원 목록 로드 오류:', error);
      });
  };

  const handleRoomClick = (roomId) => {
    if (isInModal && onRoomSelect) {
      // 모달에서 사용할 경우 콜백 함수 호출
      onRoomSelect(roomId);
    } else {
      // 페이지로 이동
      navigate(`/chat/room/${roomId}`);
    }
  };

  const toggleNewChatForm = () => {
    setShowNewChatForm(!showNewChatForm);
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
        toggleNewChatForm();
        
        // 채팅방으로 이동 또는 선택
        if (isInModal && onRoomSelect) {
          onRoomSelect(response.data.roomId);
        } else {
          navigate(`/chat/room/${response.data.roomId}`);
        }
      })
      .catch(error => {
        console.error('채팅방 생성 오류:', error);
        alert('채팅방 생성에 실패했습니다.');
      });
  };

  if (loading) {
    return <Container isInModal={isInModal}><p>로딩 중...</p></Container>;
  }

  if (error) {
    return <Container isInModal={isInModal}><p>오류: {error}</p></Container>;
  }

  return (
    <Container isInModal={isInModal}>
      <Header>
        <h2>채팅</h2>
        <NewChatButton onClick={toggleNewChatForm}>
          {showNewChatForm ? '취소' : '새 채팅'}
        </NewChatButton>
      </Header>

      {showNewChatForm ? (
        <NewChatForm>
          <h3>새 채팅</h3>
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
                selected={selectedEmployees.includes(employee.empId)}
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
          
          <CreateButton onClick={createChatRoom}>채팅방 생성</CreateButton>
        </NewChatForm>
      ) : (
        <RoomList>
          {rooms.length === 0 ? (
            <p>참여 중인 채팅방이 없습니다.</p>
          ) : (
            rooms.map(room => (
              <RoomItem key={room.roomId} onClick={() => handleRoomClick(room.roomId)}>
                <RoomName>{room.roomName}</RoomName>
                <LastMessage>{room.lastMessage || '새 채팅방'}</LastMessage>
                <MemberCount>{room.members?.length || 0}명 참여</MemberCount>
                <LastMessageTime>
                  {room.lastMessageTime ? new Date(room.lastMessageTime).toLocaleString() : ''}
                </LastMessageTime>
              </RoomItem>
            ))
          )}
        </RoomList>
      )}
    </Container>
  );
};

// 스타일 컴포넌트
const Container = styled.div`
  padding: 20px;
  height: 100%;
  background-color: #f5f7fa;
  
  ${props => props.isInModal && `
    overflow-y: auto;
  `}
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h2 {
    margin: 0;
    color: #333;
  }
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

const RoomList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RoomItem = styled.div`
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const RoomName = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 5px;
`;

const LastMessage = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MemberCount = styled.div`
  font-size: 12px;
  color: #888;
`;

const LastMessageTime = styled.div`
  font-size: 12px;
  color: #888;
  text-align: right;
`;

const NewChatForm = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
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
  background-color: ${props => props.selected ? '#f0f4ff' : 'transparent'};
  
  &:hover {
    background-color: ${props => props.selected ? '#e6edff' : '#f5f5f5'};
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
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    position: absolute;
    top: 2px;
    left: 6px;
    transform: rotate(45deg);
  }
`;

const CreateButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #4a6cf7;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background-color: #3a5ce5;
  }
`;

export default ChatRoomList; 