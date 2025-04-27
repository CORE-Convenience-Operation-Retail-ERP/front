import { useState, useEffect } from "react";
import StoreHeader from '../../components/common/store/StoreHeader';

function HeaderContainer() {
    const [userInfo, setUserInfo] = useState({
        userName: "",
        mailCount: 0,
        notificationCount: 0,
        notifications: [],
    });

    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    useEffect(() => {
        async function fetchUserInfo() {
            // API 호출
        }
        fetchUserInfo();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const toggleNotifications = () => {
        setIsNotificationOpen((prev) => !prev);
    };

    const removeNotification = (index) => {
        // 알림 삭제
    };

    return (
        <StoreHeader
            userInfo={userInfo}
            isNotificationOpen={isNotificationOpen}
            onLogout={handleLogout}
            onToggleNotifications={toggleNotifications}
            onRemoveNotification={removeNotification}
        />
    );
}

export default HeaderContainer;
