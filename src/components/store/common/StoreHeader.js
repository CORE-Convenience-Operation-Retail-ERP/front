import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Header,
    RightSection,
    IconWrap,
    LogoImage,
    MailIcon,
    BellIcon,
    LogoutIcon,
    BuildingIcon,
} from '../../../features/store/styles/common/StoreHeader.styled';


function StoreHeader({ userInfo, onLogout, onToggleNotifications }) {


    const [hoveredIcon, setHoveredIcon] = useState(null);
    const navigate = useNavigate();

    // if (!userInfo) return null;

    return (
        <Header>
            <LogoImage src="/core_logo.png" alt="Core 로고" />
            <RightSection>

                {/* Mail */}
                <IconWrap
                    $hoverbg="#dbeafe" // 연파랑
                    onMouseEnter={() => setHoveredIcon('mail')}
                    onMouseLeave={() => setHoveredIcon(null)}
                >
                    <MailIcon $hovered={hoveredIcon === 'mail'} />
                </IconWrap>

                {/* Bell */}
                <IconWrap
                    $hoverbg="#fef9c3" // 연노랑
                    onMouseEnter={() => setHoveredIcon('bell')}
                    onMouseLeave={() => setHoveredIcon(null)}
                >
                    <BellIcon $hovered={hoveredIcon === 'bell'} />
                </IconWrap>

                {/* 본사 이동 아이콘 (점주만 보임)  */}
                {userInfo?.workType === 3 && (
                    <IconWrap
                        $hoverbg="#ede9fe" // 연보라
                        onMouseEnter={() => setHoveredIcon('hq')}
                        onMouseLeave={() => setHoveredIcon(null)}
                        onClick={() => navigate('/headquarters/dashboard')}
                    >
                     
                        <BuildingIcon $hovered={hoveredIcon === 'hq'} />
                    </IconWrap>
                )}

                 {/* 직급 */}
                 <div style={{ fontSize: "14px", color: "#6b7280" }}>
                    {userInfo.workType === 3
                        ? `${userInfo.branchName || "지점명 없음"} 점주`
                        : "관리자"}
                </div>

                {/* Logout */}
                <IconWrap
                    $hoverbg="#ffe4e6" // 연다홍
                    onMouseEnter={() => setHoveredIcon('logout')}
                    onMouseLeave={() => setHoveredIcon(null)}
                    onClick={onLogout}
                    style={{ padding: "8px 12px", borderRadius: "50px" }}
                >
                    <LogoutIcon $hovered={hoveredIcon === 'logout'} />
                    <span style={{
                        marginLeft: "6px",
                        fontSize: "14px",
                        color: hoveredIcon === 'logout' ? '#fb7185' : '#6b7280',
                        transition: "color 0.3s ease"
                    }}>
                        Logout
                    </span>
                </IconWrap>

            </RightSection>
        </Header>
    );
}

export default StoreHeader;