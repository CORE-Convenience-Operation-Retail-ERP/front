import { useState, useEffect } from "react";
import StoreHeader from '../../../components/store/common/StoreHeader';
import axios from "../../../service/axiosInstance";

function HeaderContainer() {
  const loginUser = JSON.parse(localStorage.getItem('loginUser')) || {};
  const branchNameFromStorage = localStorage.getItem('branchName') || "";

  const [userInfo, setUserInfo] = useState({
    branchName: branchNameFromStorage,
    workType: loginUser.workType || null,
    userName: loginUser.name || "",
    mailCount: 0,
    notificationCount: 0,
    notifications: [],
  });

  // const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // useEffect(() => {
  //   async function fetchUserInfo() {
  //     try {
  //       const token = localStorage.getItem('token');
  //       if (token && token.split('.').length === 3) {
  //         try {
  //           const base64Url = token.split('.')[1];
  //           const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //           const jsonPayload = decodeURIComponent(
  //             atob(base64)
  //               .split('')
  //               .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
  //               .join('')
  //           );
  //           const decoded = JSON.parse(jsonPayload);
  //           console.log("✅ 디코딩된 JWT payload:", decoded);
  //         } catch (e) {
  //           console.warn("❌ 토큰 디코딩 실패", e);
  //         }
  //       } else {
  //         console.warn("❗ 올바른 토큰 형식이 아님 (split 실패 또는 null)");
  //       }

  //       const response = await axios.get('/api/store/notifications');

  //       if (response.data) {
  //         setUserInfo(prev => ({
  //           ...prev,
  //           notificationCount: response.data.notificationCount || 0,
  //           notifications: response.data.notifications || [],
  //           branchName: branchNameFromStorage,
  //           workType: loginUser.workType || null
  //         }));
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch notifications:', error);
  //     }
  //   }

  //   fetchUserInfo();
  // }, [branchNameFromStorage]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem('branchName');
        window.location.href = "/login";
    };

  // const toggleNotifications = () => {
  //   setIsNotificationOpen(prev => !prev);
  // };

  // const removeNotification = async (index) => {
  //   try {
  //     await axios.delete(`/api/store/notifications/${index}`);
  //     setUserInfo(prev => ({
  //       ...prev,
  //       notificationCount: prev.notificationCount - 1,
  //       notifications: prev.notifications.filter((_, i) => i !== index)
  //     }));
  //   } catch (error) {
  //     console.error('Failed to remove notification:', error);
  //   }
  // };

  return (
    <StoreHeader
      userInfo={userInfo}
      // isNotificationOpen={isNotificationOpen}
      onLogout={handleLogout}
      // onToggleNotifications={toggleNotifications}
      // onRemoveNotification={removeNotification}
    />
  );
}

export default HeaderContainer;
