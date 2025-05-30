import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL + '/api/notifications' || 'http://localhost:8080/api/notifications';

// 알림 상태 저장소
let notifications = [];
let unreadNotifications = 0;
let notificationCallbacks = [];

// 로컬 스토리지에서 알림 상태 초기화
function initializeFromLocalStorage() {
  try {
    const savedNotifications = localStorage.getItem('admin_notifications');
    if (savedNotifications) {
      notifications = JSON.parse(savedNotifications) || [];
      console.log('로컬 스토리지에서 알림 상태 불러옴:', notifications.length, '개');
    } else {
      console.log('로컬 스토리지에 저장된 알림 상태 없음');
      notifications = [];
    }
    
    const savedUnreadCount = localStorage.getItem('admin_unread_notifications');
    if (savedUnreadCount) {
      unreadNotifications = parseInt(savedUnreadCount) || 0;
      console.log('읽지 않은 알림 개수:', unreadNotifications);
    } else {
      unreadNotifications = 0;
    }
  } catch (e) {
    console.error('로컬 스토리지 읽기 오류:', e);
    notifications = [];
    unreadNotifications = 0;
  }
}

// 초기화 실행
initializeFromLocalStorage();

class AdminNotificationService {
  constructor() {
    // 생성자에서도 로컬 스토리지에서 알림 상태 초기화
    initializeFromLocalStorage();
    console.log('AdminNotificationService 초기화 완료, 현재 알림 개수:', notifications.length);
    
    // 전역 window 객체에 서비스 등록 (웹소켓 연동을 위해)
    if (typeof window !== 'undefined') {
      window.adminNotificationService = this;
      console.log('window 객체에 adminNotificationService 등록 완료');
    }
    
    // 생성자에서 서버에서 알림 데이터 가져오기
    this.initializeFromServer();
  }
  
  // 서버에서 알림 데이터 가져오기 시작
  initializeFromServer() {
    console.log('서버에서 알림 데이터 가져오기 시작');
    
    // 토큰 없으면 실행 안함
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('토큰이 없어 서버에서 알림 가져오기 실패');
      return;
    }
    
    // 읽지 않은 알림 가져오기
    this.fetchUnreadNotifications()
      .then(() => {
        console.log('읽지 않은 알림 가져오기 성공');
      })
      .catch(error => {
        console.error('읽지 않은 알림 가져오기 오류:', error);
      });
      
    // 추가로 최근 모든 알림 가져오기
    this.fetchNotifications(0, 50)
      .then(() => {
        console.log('모든 알림 가져오기 성공');
      })
      .catch(error => {
        console.error('모든 알림 가져오기 오류:', error);
      });
  }

  // 알림 추가
  addNotification(notification) {
    console.log('[AdminNotificationService] addNotification 호출:', notification);
    console.log('새 알림 추가:', notification);
    
    // 이미 있는 알림인지 확인
    const existingIndex = notifications.findIndex(n => n.id === notification.id);
    
    if (existingIndex >= 0) {
      // 기존 알림 업데이트 (불변성 유지)
      notifications = [
        ...notifications.slice(0, existingIndex),
        notification,
        ...notifications.slice(existingIndex + 1)
      ];
      console.log('기존 알림 업데이트(불변성):', notification.id);
    } else {
      // 새 알림 추가 (불변성 유지)
      notifications = [notification, ...notifications];
      if (!notification.isRead && !notification.read) {
        unreadNotifications++;
      }
      console.log('새 알림 추가(불변성), 현재 unread:', unreadNotifications);
    }
    this.saveToLocalStorage();
    console.log('[AdminNotificationService] notifyCallbacks 호출 전, 콜백 수:', notificationCallbacks.length);
    this.notifyCallbacks();
  }

  // 특정 알림 읽음 처리
  markAsRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && (!notification.isRead && !notification.read)) {
      notification.isRead = true;
      notification.read = true;
      unreadNotifications = Math.max(0, unreadNotifications - 1);
      
      // API 호출로 서버에도 읽음 처리
      axios.patch(`${API_URL}/${notificationId}/read`, {}, {
        headers: this.getAuthHeader()
      }).catch(error => {
        console.error('알림 읽음 처리 오류:', error);
      });
      
      this.saveToLocalStorage();
      this.notifyCallbacks();
    }
  }

  // 모든 알림 읽음 처리
  markAllAsRead() {
    let updatedCount = 0;
    
    notifications.forEach(notification => {
      if (!notification.isRead && !notification.read) {
        notification.isRead = true;
        notification.read = true;
        updatedCount++;
      }
    });
    
    if (updatedCount > 0) {
      unreadNotifications = 0;
      
      // API 호출로 서버에도 읽음 처리
      axios.patch(`${API_URL}/read-all`, {}, {
        headers: this.getAuthHeader()
      }).catch(error => {
        console.error('모든 알림 읽음 처리 오류:', error);
      });
      
      this.saveToLocalStorage();
      this.notifyCallbacks();
    }
  }

  // 서버에서 알림 목록 조회
  fetchNotifications(page = 0, size = 20) {
    console.log('서버에서 알림 목록 조회 시작');
    return axios.get(API_URL, {
      params: { page, size },
      headers: this.getAuthHeader()
    }).then(response => {
      console.log('알림 목록 조회 성공:', response.data.length, '개');
      
      if (page === 0) { // 첫 페이지는 대체
        notifications = response.data;
      } else { // 추가 페이지는 병합
        const newIds = new Set(response.data.map(n => n.id));
        const filteredNotifications = notifications.filter(n => !newIds.has(n.id));
        notifications = [...filteredNotifications, ...response.data];
      }
      
      this.saveToLocalStorage();
      this.notifyCallbacks();
      return response.data;
    });
  }

  // 서버에서 읽지 않은 알림 조회
  fetchUnreadNotifications() {
    console.log('서버에서 읽지 않은 알림 조회 시작');
    return axios.get(`${API_URL}/unread`, {
      headers: this.getAuthHeader()
    }).then(response => {
      const unreadNotifs = response.data;
      console.log('읽지 않은 알림 조회 성공:', unreadNotifs.length, '개');
      
      // 읽지 않은 알림만 업데이트
      unreadNotifs.forEach(newNotif => {
        const existingIndex = notifications.findIndex(n => n.id === newNotif.id);
        if (existingIndex >= 0) {
          notifications[existingIndex] = newNotif;
        } else {
          notifications.unshift(newNotif);
        }
      });
      
      // 읽지 않은 알림 개수 업데이트
      unreadNotifications = unreadNotifs.length;
      
      this.saveToLocalStorage();
      this.notifyCallbacks();
      
      return unreadNotifs;
    });
  }

  // 읽지 않은 알림 개수 조회
  fetchUnreadCount() {
    console.log('서버에서 읽지 않은 알림 개수 조회 시작');
    return axios.get(`${API_URL}/count`, {
      headers: this.getAuthHeader()
    }).then(response => {
      unreadNotifications = response.data.count;
      console.log('읽지 않은 알림 개수 조회 성공:', unreadNotifications);
      
      this.saveToLocalStorage();
      this.notifyCallbacks();
      return unreadNotifications;
    });
  }

  // 새로고침 - 서버에서 모든 알림 데이터 다시 가져오기
  refresh() {
    console.log('알림 데이터 새로고침 시작');
    return Promise.all([
      this.fetchUnreadNotifications(),
      this.fetchNotifications(0, 50)
    ])
    .then(() => {
      console.log('알림 데이터 새로고침 완료');
      return true;
    });
  }

  // 구독 등록 (ChatService와 동일한 패턴)
  onNotificationsChange(callback) {
    notificationCallbacks.push(callback);
    
    // 즉시 현재 상태 반영
    callback(unreadNotifications, notifications);
    
    // 구독 해제 함수 반환
    return () => {
      notificationCallbacks = notificationCallbacks.filter(cb => cb !== callback);
    };
  }

  // 구독 호출 내부 메소드
  notifyCallbacks() {
    console.log('[AdminNotificationService] notifyCallbacks 실행, 콜백 수:', notificationCallbacks.length, 'unread:', unreadNotifications, 'notifs:', notifications.map(n => n.id));
    notificationCallbacks.forEach(callback => 
      callback(unreadNotifications, notifications)
    );
  }

  // 로컬 스토리지에 저장
  saveToLocalStorage() {
    localStorage.setItem('admin_notifications', JSON.stringify(notifications));
    localStorage.setItem('admin_unread_notifications', unreadNotifications.toString());
  }

  // 인증 헤더 생성
  getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  // 모든 알림 반환
  getAllNotifications() {
    return [...notifications];
  }
  
  // 읽지 않은 알림 개수 반환
  getUnreadCount() {
    return unreadNotifications;
  }
}

// 싱글톤 인스턴스 생성
const adminNotificationService = new AdminNotificationService();
export default adminNotificationService; 