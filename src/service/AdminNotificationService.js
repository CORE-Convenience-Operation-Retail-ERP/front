import axios from 'axios';

const API_URL = 'http://localhost:8080/api/notifications';

// uc54cub9bc uc0c1ud0dc uc800uc7a5uc18c
let notifications = [];
let unreadNotifications = 0;
let notificationCallbacks = [];

// ub85cuceec uc2a4ud1a0ub9acuc9c0uc5d0uc11c uc54cub9bc uc0c1ud0dc ucd08uae30ud654
function initializeFromLocalStorage() {
  try {
    const savedNotifications = localStorage.getItem('admin_notifications');
    if (savedNotifications) {
      notifications = JSON.parse(savedNotifications) || [];
      console.log('ub85cuceec uc2a4ud1a0ub9acuc9c0uc5d0uc11c uc54cub9bc uc0c1ud0dc ubd88ub7ecuc634:', notifications.length, 'uac1c');
    } else {
      console.log('ub85cuceec uc2a4ud1a0ub9acuc9c0uc5d0 uc800uc7a5ub41c uc54cub9bc uc0c1ud0dc uc5c6uc74c');
      notifications = [];
    }
    
    const savedUnreadCount = localStorage.getItem('admin_unread_notifications');
    if (savedUnreadCount) {
      unreadNotifications = parseInt(savedUnreadCount) || 0;
      console.log('uc77duc9c0 uc54auc740 uc54cub9bc uac1cuc218:', unreadNotifications);
    } else {
      unreadNotifications = 0;
    }
  } catch (e) {
    console.error('ub85cuceec uc2a4ud1a0ub9acuc9c0 uc77duae30 uc624ub958:', e);
    notifications = [];
    unreadNotifications = 0;
  }
}

// ucd08uae30ud654 uc2e4ud589
initializeFromLocalStorage();

class AdminNotificationService {
  constructor() {
    // uc0dduc131uc790uc5d0uc11cub3c4 ub85cuceec uc2a4ud1a0ub9acuc9c0uc5d0uc11c uc0c1ud0dc ucd08uae30ud654
    initializeFromLocalStorage();
    console.log('AdminNotificationService ucd08uae30ud654 uc644ub8cc, ud604uc7ac uc54cub9bc uac1cuc218:', notifications.length);
    
    // uc804uc5ed window uac1duccb4uc5d0 uc11cube44uc2a4 ub4f1ub85d (uc6f9uc18cucf13 uc5f0ub3d9uc744 uc704ud574)
    if (typeof window !== 'undefined') {
      window.adminNotificationService = this;
      console.log('window uac1duccb4uc5d0 adminNotificationService ub4f1ub85d uc644ub8cc');
    }
    
    // uc0dduc131uc790uc5d0uc11c uc11cubc84uc5d0uc11c uc54cub9bc ub370uc774ud130 uac00uc838uc624uae30
    this.initializeFromServer();
  }
  
  // uc11cubc84uc5d0uc11c uc54cub9bc ub370uc774ud130 uac00uc838uc624uae30 uc2dcuc791
  initializeFromServer() {
    console.log('uc11cubc84uc5d0uc11c uc54cub9bc ub370uc774ud130 uac00uc838uc624uae30 uc2dcuc791');
    
    // ud1a0ud070 uc5c6uc73cuba74 uc2e4ud589 uc548ud568
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('ud1a0ud070uc774 uc5c6uc5b4 uc11cubc84uc5d0uc11c uc54cub9bc uac00uc838uc624uae30 uc2e4ud328');
      return;
    }
    
    // uc77duc9c0 uc54auc740 uc54cub9bc uac00uc838uc624uae30
    this.fetchUnreadNotifications()
      .then(() => {
        console.log('uc77duc9c0 uc54auc740 uc54cub9bc uac00uc838uc624uae30 uc131uacf5');
      })
      .catch(error => {
        console.error('uc77duc9c0 uc54auc740 uc54cub9bc uac00uc838uc624uae30 uc624ub958:', error);
      });
      
    // ucd94uac00ub85c ucd5cuadfc ubaa8ub4e0 uc54cub9bc uac00uc838uc624uae30
    this.fetchNotifications(0, 50)
      .then(() => {
        console.log('ubaa8ub4e0 uc54cub9bc uac00uc838uc624uae30 uc131uacf5');
      })
      .catch(error => {
        console.error('ubaa8ub4e0 uc54cub9bc uac00uc838uc624uae30 uc624ub958:', error);
      });
  }

  // uc54cub9bc ucd94uac00
  addNotification(notification) {
    console.log('uc0c8 uc54cub9bc ucd94uac00:', notification);
    
    // uc774ubbf8 uc788ub294 uc54cub9bcuc778uc9c0 ud655uc778
    const existingIndex = notifications.findIndex(n => n.id === notification.id);
    
    if (existingIndex >= 0) {
      // uc774ubbf8 uc788ub294 uc54cub9bcuc774uba74 uc5c5ub370uc774ud2b8
      notifications[existingIndex] = notification;
      console.log('uae30uc874 uc54cub9bc uc5c5ub370uc774ud2b8:', notification.id);
    } else {
      // uc0c8 uc54cub9bcuc774uba74 ucd94uac00
      notifications.unshift(notification);
      
      // uc77duc9c0 uc54auc740 uc54cub9bcuc774uba74 uac1cuc218 uc99duac00
      if (!notification.isRead && !notification.read) {
        unreadNotifications++;
      }
      
      console.log('uc0c8 uc54cub9bc ucd94uac00ub428, uc77duc9c0 uc54auc740 uac1cuc218:', unreadNotifications);
    }
    
    this.saveToLocalStorage();
    this.notifyCallbacks();
  }

  // ud2b9uc815 uc54cub9bc uc77duc74c ucc98ub9ac
  markAsRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && (!notification.isRead && !notification.read)) {
      notification.isRead = true;
      notification.read = true;
      unreadNotifications = Math.max(0, unreadNotifications - 1);
      
      // API ud638ucd9cub85c uc11cubc84uc5d0ub3c4 uc77duc74c ucc98ub9ac
      axios.patch(`${API_URL}/${notificationId}/read`, {}, {
        headers: this.getAuthHeader()
      }).catch(error => {
        console.error('uc54cub9bc uc77duc74c ucc98ub9ac uc624ub958:', error);
      });
      
      this.saveToLocalStorage();
      this.notifyCallbacks();
    }
  }

  // ubaa8ub4e0 uc54cub9bc uc77duc74c ucc98ub9ac
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
      
      // API ud638ucd9cub85c uc11cubc84uc5d0ub3c4 uc77duc74c ucc98ub9ac
      axios.patch(`${API_URL}/read-all`, {}, {
        headers: this.getAuthHeader()
      }).catch(error => {
        console.error('ubaa8ub4e0 uc54cub9bc uc77duc74c ucc98ub9ac uc624ub958:', error);
      });
      
      this.saveToLocalStorage();
      this.notifyCallbacks();
    }
  }

  // uc11cubc84uc5d0uc11c uc54cub9bc ubaa9ub85d uc870ud68c
  fetchNotifications(page = 0, size = 20) {
    console.log('uc11cubc84uc5d0uc11c uc54cub9bc ubaa9ub85d uc870ud68c uc2dcuc791');
    return axios.get(API_URL, {
      params: { page, size },
      headers: this.getAuthHeader()
    }).then(response => {
      console.log('uc54cub9bc ubaa9ub85d uc870ud68c uc131uacf5:', response.data.length, 'uac1c');
      
      if (page === 0) { // ucc98uc74c ud398uc774uc9c0ub294 ub300uccb4
        notifications = response.data;
      } else { // ucd94uac00 ud398uc774uc9c0ub294 ubcd1ud569
        const newIds = new Set(response.data.map(n => n.id));
        const filteredNotifications = notifications.filter(n => !newIds.has(n.id));
        notifications = [...filteredNotifications, ...response.data];
      }
      
      this.saveToLocalStorage();
      this.notifyCallbacks();
      return response.data;
    });
  }

  // uc11cubc84uc5d0uc11c uc77duc9c0 uc54auc740 uc54cub9bc uc870ud68c
  fetchUnreadNotifications() {
    console.log('uc11cubc84uc5d0uc11c uc77duc9c0 uc54auc740 uc54cub9bc uc870ud68c uc2dcuc791');
    return axios.get(`${API_URL}/unread`, {
      headers: this.getAuthHeader()
    }).then(response => {
      const unreadNotifs = response.data;
      console.log('uc77duc9c0 uc54auc740 uc54cub9bc uc870ud68c uc131uacf5:', unreadNotifs.length, 'uac1c');
      
      // uc77duc9c0 uc54auc740 uc54cub9bcub9cc uc5c5ub370uc774ud2b8
      unreadNotifs.forEach(newNotif => {
        const existingIndex = notifications.findIndex(n => n.id === newNotif.id);
        if (existingIndex >= 0) {
          notifications[existingIndex] = newNotif;
        } else {
          notifications.unshift(newNotif);
        }
      });
      
      // uc77duc9c0 uc54auc740 uc54cub9bc uac1cuc218 uc5c5ub370uc774ud2b8
      unreadNotifications = unreadNotifs.length;
      
      this.saveToLocalStorage();
      this.notifyCallbacks();
      
      return unreadNotifs;
    });
  }

  // uc77duc9c0 uc54auc740 uc54cub9bc uac1cuc218 uc870ud68c
  fetchUnreadCount() {
    console.log('uc11cubc84uc5d0uc11c uc77duc9c0 uc54auc740 uc54cub9bc uac1cuc218 uc870ud68c uc2dcuc791');
    return axios.get(`${API_URL}/count`, {
      headers: this.getAuthHeader()
    }).then(response => {
      unreadNotifications = response.data.count;
      console.log('uc77duc9c0 uc54auc740 uc54cub9bc uac1cuc218 uc870ud68c uc131uacf5:', unreadNotifications);
      
      this.saveToLocalStorage();
      this.notifyCallbacks();
      return unreadNotifications;
    });
  }

  // uc0c8ub85cuace0uce68 - uc11cubc84uc5d0uc11c ubaa8ub4e0 uc54cub9bc ub370uc774ud130 ub2e4uc2dc uac00uc838uc624uae30
  refresh() {
    console.log('uc54cub9bc ub370uc774ud130 uc0c8ub85cuace0uce68 uc2dcuc791');
    return Promise.all([
      this.fetchUnreadNotifications(),
      this.fetchNotifications(0, 50)
    ])
    .then(() => {
      console.log('uc54cub9bc ub370uc774ud130 uc0c8ub85cuace0uce68 uc644ub8cc');
      return true;
    });
  }

  // ucf5cubc31 ub4f1ub85d (ChatServiceuc640 ub3d9uc77cud55c ud328ud134)
  onNotificationsChange(callback) {
    notificationCallbacks.push(callback);
    
    // uc989uc2dc ud604uc7ac uc0c1ud0dc ubc18uc601
    callback(unreadNotifications, notifications);
    
    // ucf5cubc31 uc81cuac70 ud568uc218 ubc18ud658
    return () => {
      notificationCallbacks = notificationCallbacks.filter(cb => cb !== callback);
    };
  }

  // ucf5cubc31 ud638ucd9c ub0b4ubd80 uba54uc11cub4dc
  notifyCallbacks() {
    notificationCallbacks.forEach(callback => 
      callback(unreadNotifications, notifications)
    );
  }

  // ub85cuceec uc2a4ud1a0ub9acuc9c0uc5d0 uc800uc7a5
  saveToLocalStorage() {
    localStorage.setItem('admin_notifications', JSON.stringify(notifications));
    localStorage.setItem('admin_unread_notifications', unreadNotifications.toString());
  }

  // uc778uc99d ud5e4ub354 uc0dduc131
  getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  // ubaa8ub4e0 uc54cub9bc ubc18ud658
  getAllNotifications() {
    return [...notifications];
  }
  
  // uc77duc9c0 uc54auc740 uc54cub9bc uac1cuc218 ubc18ud658
  getUnreadCount() {
    return unreadNotifications;
  }
}

// uc2f1uae00ud1a4 uc778uc2a4ud134uc2a4 uc0dduc131
const adminNotificationService = new AdminNotificationService();
export default adminNotificationService; 