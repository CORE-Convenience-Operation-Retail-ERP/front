import { MailIcon, BellIcon } from "./IconSet";

function HeaderRightSection({ userInfo, onLogout, onToggleNotifications }) {
    return (
        <div className="right-section">
            <button onClick={onLogout} className="logout-button">Logout</button>

            <div className="icon-wrap">
                <MailIcon size={22} />
                {userInfo.mailCount > 0 && <span className="badge">{userInfo.mailCount}</span>}
            </div>

            <div className="icon-wrap" onClick={onToggleNotifications}>
                <BellIcon size={22} />
                {userInfo.notificationCount > 0 && <span className="badge">{userInfo.notificationCount}</span>}
            </div>

            <span className="total-text">
        총 {userInfo.notificationCount}개 접수
      </span>
        </div>
    );
}

export default HeaderRightSection;
