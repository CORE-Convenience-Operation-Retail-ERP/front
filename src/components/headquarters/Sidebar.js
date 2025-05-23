import React, { useState, useEffect } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Collapse,
  Box,
  styled,
  Tooltip
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  {
    text: '상품/재고 관리',
    path: '/headquarters/products',
    subMenus: [
      { text: '전체 제품 관리', path: '/headquarters/products/all' },
      { text: '상세 제품 관리', path: '/headquarters/products/detail' },
      { text: '통합 재고 모니터링', path: '/headquarters/products/integrated-stock' }
    ],
    hoverBoxBottom: { bottom: -45, width: 80, height: 30 },
  },
  {
    text: '인사 관리',
    path: '/headquarters/hr',
    subMenus: [
      { text: '사원 목록', path: '/headquarters/hr/employees' },
      { text: '사원 정보 관리', path: '/headquarters/hr/employee-management' },
      { text: '마이 페이지', path: '/headquarters/hr/my-page' },
      { text: '연차 신청 관리', path: '/headquarters/hr/annual-leave' },
    ],
    hoverBoxBottom: { bottom: -65, width: 81, height: 35 },
  },
  {
    text: '지점 관리',
    path: '/headquarters/branches',
    subMenus: [
      { text: '지점 목록', path: '/headquarters/branches/list' },
      { text: '지점 문의 관리', path: '/headquarters/branches/inquiry' },
      { text: '지점 매출 분석', path: '/headquarters/branches/sales-analysis' },
      { text: '지점 재고 현황', path: '/headquarters/branches/stock-monitering' },
      { text: '지점 통계', path: '/headquarters/branches/statistics' }
    ],
    hoverBoxBottom: { bottom: -88, width: 88  , height: 40 },
  },
  {
    text: '게시판',
    path: '/headquarters/board',
    subMenus: [
      { text: '공지 사항', path: '/headquarters/board/notice' },
      { text: '건의 사항', path: '/headquarters/board/suggestions' },
      { text: '점포 문의 사항', path: '/headquarters/board/store-inquiries' }
      
    ],
    hoverBoxBottom: { bottom: -45, width: 80, height: 25 },
  }
];

const StyledDrawer = styled(Drawer)({
  '& .MuiDrawer-paper': {
    width: 220,
    boxSizing: 'border-box',
    background: 'transparent',
    border: 'none',
    height: '100vh',
    marginTop: 0,
    position: 'fixed',
    zIndex: 1200,
  },
});

const SidebarContainer = styled(Box)({
  height: '100vh',
  background: '#6FC3ED',
  borderRadius: '0 25px 25px 0',
  padding: '120px 0 40px 0',
  position: 'fixed',
  width: 220,
  left: 0,
  top: 0,
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: '#6FC3ED',
    borderRadius: '0 50px 50px 0',
    zIndex: -1,
  }
});

const MenuContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'hasSubmenu' && prop !== 'submenuHeight'
})(({ isActive, hasSubmenu, submenuHeight }) => ({
  position: 'relative',
  marginBottom: '60px',
  marginLeft: '40px',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: isActive && hasSubmenu ? `calc(40% + ${submenuHeight}px)` : '4px',
    background: isActive ? 'white' : 'transparent',
    borderRadius: '25px 0 0 25px',
    opacity: isActive ? 1 : 0,
    transition: 'all 0.3s ease-in-out',
    zIndex: 0,
  }
}));

const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'isActive'
})(({ isActive }) => ({
  padding: '12px 24px',
  position: 'relative',
  zIndex: 1,
  height: '44px',
  fontFamily: 'Pretendard, sans-serif',
  '&:hover': {
    backgroundColor: 'transparent',
  },
  fontFamily: 'Pretendard, sans-serif',
  '& .MuiTypography-root': {
    fontFamily: 'Pretendard, sans-serif',
    fontSize: '21px',
    color: isActive ? '#1A237E' : 'white',
    transition: 'color 0.3s ease-in-out',
    fontWeight: isActive ? 700 : 400,
  }
}));

const SubMenuList = styled(List)({
  padding: '4px 0 4px 24px',
  position: 'relative',
  zIndex: 1,
  fontFamily: 'Pretendard, sans-serif',
  '& .MuiListItem-root': {
    padding: '8px 24px',
    height: '36px',
    '& .MuiTypography-root': {
      fontFamily: 'Pretendard, sans-serif',
      fontSize: '14px',
      color: '#1A237E',
    },
    '&:hover': {
      '& .MuiTypography-root': {
        fontWeight: 900,
      }
    }
  }
});

const SUBMENU_ITEM_HEIGHT = 36; // 서브메뉴 한 줄 높이
const SUBMENU_VERTICAL_PADDING = 4; // 서브메뉴 위아래 패딩

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [submenuHeights, setSubmenuHeights] = useState({});
  const [submenuOpened, setSubmenuOpened] = useState({});

  // 현재 경로에 해당하는 상위 메뉴 index 찾기
  const getActiveMenuIndex = () => {
    for (let i = 0; i < menuItems.length; i++) {
      if (menuItems[i].subMenus.some(sub => sub.path === location.pathname)) {
        return i;
      }
    }
    return null;
  };
  const activeMenuIndex = getActiveMenuIndex();

  // 서브메뉴 예상 높이 계산 함수
  const getExpectedSubmenuHeight = (item) => {
    if (!item.subMenus || item.subMenus.length === 0) return 0;
    return item.subMenus.length * SUBMENU_ITEM_HEIGHT + SUBMENU_VERTICAL_PADDING * 2;
  };

  useEffect(() => {
    if (activeMenuIndex !== null) {
      const item = menuItems[activeMenuIndex];
      const expectedHeight = getExpectedSubmenuHeight(item);
      setSubmenuHeights(prev => ({
        ...prev,
        [activeMenuIndex]: expectedHeight
      }));
      setHoveredMenu(activeMenuIndex);
    }
  }, [activeMenuIndex, location.pathname]);

  const handleMenuHover = (index) => {
    // 미리 예상 높이로 세팅
    const item = menuItems[index];
    const expectedHeight = getExpectedSubmenuHeight(item);
    setSubmenuHeights(prev => ({
      ...prev,
      [index]: expectedHeight
    }));
    setHoveredMenu(index);
  };

  const handleMenuLeave = () => {
    setHoveredMenu(null);
  };

  const handleSubMenuClick = (path, e) => {
    e.stopPropagation();
    navigate(path);
  };

  // onEntered에서 실제 높이로 보정 (혹시 다를 경우)
  const updateSubmenuHeight = (index, height) => {
    if (submenuHeights[index] !== height) {
      setSubmenuHeights(prev => ({
        ...prev,
        [index]: height
      }));
    }
  };

  return (
    <StyledDrawer variant="permanent">
      <SidebarContainer>
        <List sx={{ padding: 0 }}>
          {menuItems.map((item, index) => {
            // 현재 메뉴가 활성화(hovered or 경로 일치) 상태인지
            const isActiveMenu = hoveredMenu === index || activeMenuIndex === index;
            return (
              <MenuContainer
                key={item.text}
                onMouseEnter={() => handleMenuHover(index)}
                onMouseLeave={handleMenuLeave}
                isActive={isActiveMenu}
                hasSubmenu={item.subMenus.length > 0}
                submenuHeight={submenuHeights[index] || 0}
              >
                <StyledListItem button="true" isActive={isActiveMenu}>
                  <ListItemText primary={item.text} />
                </StyledListItem>
                <Collapse
                  in={isActiveMenu}
                  timeout={300}
                  onEntered={() => setSubmenuOpened(prev => ({ ...prev, [index]: true }))}
                >
                  <SubMenuList>
                    {item.subMenus.map((subItem) => {
                      const isActiveSub = location.pathname === subItem.path;
                      return (
                        <ListItem
                          button="true"
                          key={subItem.text}
                          onClick={(e) => handleSubMenuClick(subItem.path, e)}
                          sx={{
                            borderBottom: isActiveSub ? '2px solid #1A237E' : 'none',
                            fontWeight: isActiveSub ? 700 : 400,
                          }}
                        >
                          <ListItemText
                            primary={subItem.text}
                            sx={{
                              fontWeight: isActiveSub ? 700 : 400,
                              color: isActiveSub ? '#1A237E' : undefined,
                            }}
                          />
                        </ListItem>
                      );
                    })}
                  </SubMenuList>
                </Collapse>
              </MenuContainer>
            );
          })}
        </List>
        {/* 푸터 : CORE */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 32,
            left: 0,
            width: '100%',
            textAlign: 'center',
            zIndex: 2,
            pointerEvents: 'auto'
          }}
        >
          <Tooltip
            title={
              <Box sx={{ p: 1, bgcolor: 'white', color: '#1A237E', borderRadius: 2, fontSize: 14 }}>
                <span style={{ fontWeight: 700 }}>CORE ERP 시스템 v1.0</span><br />
                문의   : core@company.com<br />
                전화   : 1234-5678<br />
                주소   : 서울특별시 강남구 테헤란로 123<br />
                운영시간: 월-금 09:00-18:00
              </Box>
            }
            placement="top"
            enterDelay={200}
            sx={{
              '& .MuiTooltip-tooltip': {
                border: '2px solid #222',
                boxShadow: 'none',
                backgroundColor: 'white',
                color: '#1A237E',
              },
              '& .MuiTooltip-arrow': {
                color: 'white',
              }
            }}
          >
            <span style={{
              fontFamily: 'Pretendard, sans-serif',
              fontWeight: 400,
              color: 'white',
              fontSize: '16px',
              letterSpacing: '1px',
              cursor: 'pointer'
            }}>
              &copy; CORE
            </span>
          </Tooltip>
        </Box>
      </SidebarContainer>
    </StyledDrawer>
  );
};

export default Sidebar; 