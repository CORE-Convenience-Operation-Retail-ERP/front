import { useState, useEffect } from "react";
import StoreHeader from '../../../components/store/common/StoreHeader';
import axios from 'axios';

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

    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    useEffect(() => {
        async function fetchUserInfo() {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get('/api/store/notifications', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data) {
                    const storedBranchName = localStorage.getItem('branchName') || "";

                    setUserInfo(prev => ({
                        ...prev,
                        notificationCount: response.data.notificationCount || 0,
                        notifications: response.data.notifications || [],
                        branchName: localStorage.getItem('branchName') || "",
                        workType: JSON.parse(localStorage.getItem('loginUser'))?.workType || null
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        }

        fetchUserInfo();
    }, [branchNameFromStorage]);  // 의존성에 넣어줘야 더 안전함

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem('branchName');
        window.location.href = "/login";
    };

    const toggleNotifications = () => {
        setIsNotificationOpen(prev => !prev);
    };

    const removeNotification = async (index) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await axios.delete(`/api/store/notifications/${index}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setUserInfo(prev => ({
                ...prev,
                notificationCount: prev.notificationCount - 1,
                notifications: prev.notifications.filter((_, i) => i !== index)
            }));
        } catch (error) {
            console.error('Failed to remove notification:', error);
        }
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
