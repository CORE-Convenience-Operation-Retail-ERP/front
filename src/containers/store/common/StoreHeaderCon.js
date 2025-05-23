import { useState, useEffect } from "react";
import StoreHeader from '../../../components/store/common/StoreHeader';
import axios from "../../../service/axiosInstance";

function HeaderContainer() {
  const loginUser = JSON.parse(localStorage.getItem("loginUser")) || {};
  const storeName = localStorage.getItem("storeName") || "";

  const [userInfo, setUserInfo] = useState({
    branchName: storeName,
    workType: loginUser.workType || null,
    userName: loginUser.name || "",
    mailCount: 0,
    notificationCount: 0,
    notifications: [],
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('/api/notifications/unread');
        const unreadNotices = res.data.filter(n => n.eventType === 'NOTICE' && !n.isRead);
        setUserInfo(prev => ({
          ...prev,
          notifications: res.data,
          notificationCount: unreadNotices.length,
        }));
      } catch (e) {
        console.error("알림 조회 실패", e);
      }
    };

    fetchNotifications();
  }, []);


    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('empId');
      localStorage.removeItem('deptId');
      localStorage.removeItem('empName');
      localStorage.removeItem('deptName');
      localStorage.removeItem('role');
      localStorage.removeItem('storeId');
      localStorage.removeItem('storeName');
        window.location.href = "/login";
    };


  return (
    <StoreHeader
      userInfo={userInfo}
      onLogout={handleLogout}
    />
  );
}

export default HeaderContainer;
