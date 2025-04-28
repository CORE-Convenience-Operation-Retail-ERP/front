import {
    Sidebar,
    SidebarMenu,
    MenuItem,
    MenuButton,
    Submenu,
    SubmenuItem,
    SidebarFooter,
    FooterLine
} from '../../features/store/styles/StoreSidebar.styled';



function StoreSidebar({ menus, hoverMenu, onMouseEnter, onMouseLeave, onNavigate }) {
    return (
        <Sidebar>
            <SidebarMenu>
                {menus.map((menu, idx) => (
                    <MenuItem
                        key={idx}
                        onMouseEnter={() => onMouseEnter(menu.name)}
                        onMouseLeave={onMouseLeave}
                    >
                        <MenuButton
                            onClick={() => {
                                if (!menu.submenu) {
                                    onNavigate(menu.path);
                                }
                            }}
                        >
                            {menu.icon && <span>{menu.icon}</span>}  {/* 아이콘 렌더링 추가 */}
                            <span>{menu.name}</span>
                        </MenuButton>

                        {menu.submenu && (
                            <Submenu isOpen={hoverMenu === menu.name}>
                                {menu.submenu.map((sub, subIdx) => (
                                    <SubmenuItem
                                        key={subIdx}
                                        onClick={() => onNavigate(sub.path)}
                                    >
                                        {sub.name}
                                    </SubmenuItem>
                                ))}
                            </Submenu>
                        )}
                    </MenuItem>
                ))}
            </SidebarMenu>

            <SidebarFooter>
                <div>© CORE</div>
                <FooterLine>───────────</FooterLine>
            </SidebarFooter>
        </Sidebar>
    );
}

export default StoreSidebar;