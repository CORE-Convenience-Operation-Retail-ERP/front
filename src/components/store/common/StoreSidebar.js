import {
    Sidebar,
    SidebarMenu,
    MenuItem,
    MenuButton,
    MenuIcon,
    Submenu,
    SubmenuItem,
    SidebarFooter,
    FooterContent,
    FooterDetail,
    FooterLine
} from '../../../features/store/styles/common/StoreSidebar.styled';

function StoreSidebar({ menus, hoverMenu, onMouseEnter, onMouseLeave, onNavigate, activeMenu }) {
    return (
        <Sidebar>
            <SidebarMenu>
                {menus.map((menu, idx) => {
                    const isActive = activeMenu === menu.path;
                    const hasActiveSubmenu = menu.submenu?.some(sub => activeMenu === sub.path);

                    return (
                        <MenuItem
                            key={idx}
                            onMouseEnter={() => onMouseEnter(menu.name)}
                            onMouseLeave={onMouseLeave}
                        >
                            <MenuButton
                                isActive={isActive || hasActiveSubmenu} // 메인 메뉴 active 처리
                                onClick={() => {
                                    if (!menu.submenu) {
                                        onNavigate(menu.path);
                                    }
                                }}
                            >
                                {menu.icon && (
                                    <MenuIcon>
                                        {menu.icon}
                                    </MenuIcon>
                                )}
                                <span>{menu.name}</span>
                            </MenuButton>

                            {menu.submenu && (
                                <Submenu isOpen={hoverMenu === menu.name || hasActiveSubmenu}>
                                    {menu.submenu.map((sub, subIdx) => {
                                        const isSubActive = activeMenu === sub.path; // 하위 메뉴 active 처리

                                        return (
                                            <SubmenuItem
                                                key={subIdx}
                                                isActive={isSubActive}
                                                onClick={() => onNavigate(sub.path)}
                                                onMouseEnter={() => onMouseEnter(menu.name)}
                                                onMouseLeave={onMouseLeave}
                                            >
                                                {sub.name}
                                            </SubmenuItem>
                                        );
                                    })}
                                </Submenu>
                            )}
                        </MenuItem>
                    );
                })}
            </SidebarMenu>

            {/* Footer */}
            <SidebarFooter>
                <FooterContent>
                    @ CORE ERP
                    <FooterLine />
                </FooterContent>

                <FooterDetail>
                    <span style={{ fontWeight: 700 }}>CORE ERP 시스템 v1.0</span><br />
                    문의 : core@company.com<br />
                    전화 : 1234-5678<br />
                    주소 : 서울특별시 강남구 테헤란로 123<br />
                    운영시간: 월-금 09:00-18:00
                </FooterDetail>
            </SidebarFooter>
        </Sidebar>
    );
}

export default StoreSidebar;