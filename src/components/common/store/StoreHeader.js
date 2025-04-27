import {
    Header,
    Logo,
    RightSection,
    LogoutButton,
    IconWrap,
    TotalText
} from '../../../css/store/StoreHeader.styled';

import { MailIcon, BellIcon, LogoutIcon } from './IconSet'; // LogoutIcon도 추가!!

function StoreHeader({ userInfo, onLogout, onToggleNotifications }) {
    return (
        <Header>
            <Logo>CORE</Logo>

            <RightSection>
                <LogoutButton onClick={onLogout}>
                    <LogoutIcon size={20} style={{ marginRight: "5px" }} />
                    Logout
                </LogoutButton>

                <IconWrap>
                    <MailIcon size={22} />
                </IconWrap>

                <IconWrap onClick={onToggleNotifications}>
                    <BellIcon size={22} />
                </IconWrap>

                <TotalText>총 {userInfo.notificationCount}개 접수</TotalText>
            </RightSection>
        </Header>
    );
}

export default StoreHeader;
