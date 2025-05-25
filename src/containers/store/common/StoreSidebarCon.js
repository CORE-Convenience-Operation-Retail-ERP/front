import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StoreSidebar from '../../../components/store/common/StoreSidebar';
import {
    Home as HomeIcon,
    Inventory as InventoryIcon,
    ShoppingCart as ShoppingCartIcon,
    People as PeopleIcon,
    CreditCard as CreditCardIcon,
    BarChart as BarChartIcon
} from '@mui/icons-material';

const sidebarMenus = [
    { name: '홈', path: '/store/home', icon: <HomeIcon /> },
    {
        name: '재고 관리', icon: <InventoryIcon />, submenu: [
        { name: '재고 현황', path: '/store/stock/list' },
        { name: '입출고 기록', path: '/store/stock/flow/search' },
        { name: '폐기 관리', path: '/store/inventory/disposal' },
        ]
    },
    {
        name: '발주 관리', icon: <ShoppingCartIcon />, submenu: [
            { name: '발주 등록', path: '/store/order/register' },
            { name: '발주 현황', path: '/store/order/list' },
            { name: '입고 현황', path: '/store/stock/in-history' },
        ]
    },
    {
        name: '인사 관리', icon: <PeopleIcon />, submenu: [
            { name: '직원 관리', path: '/store/parttimer/list' },
            { name: '스케줄 관리', path: '/store/hr/schedule' },
            { name: '급여 관리', path: '/store/hr/salary' },
            { name: '근태 관리', path: '/store/attendance' },
        ]
    },
    { 
        name: '매출 관리', icon: <CreditCardIcon />, submenu : [
            { name: '매출 정산', path: '/store/sales/summary' },
            { name: '거래 내역', path: '/store/sales/transactions' },
        ]
    },
    {
        name: '통계 관리', icon: <BarChartIcon />, submenu: [
            { name: '통합 통계', path: '/store/statistics' },
            { name: '발주 통계', path: '/store/stats/order' },
            { name: '상품별 매출 순위', path: '/store/stats/product' },
            { name: '카테고리별 매출 추이', path: '/store/stats/category' },
            { name: '시간대별 매출 통계', path: '/store/stats/time' },
        ]
    },
];

function StoreSidebarContainer() {
    const [hoverMenu, setHoverMenu] = useState('');
    const navigate = useNavigate();
    const location = useLocation(); // 현재 주소 가져오기
    const currentPath = location.pathname; // 현재 경로

    const handleMouseEnter = (menuName) => {
        setHoverMenu(menuName);
    };

    const handleMouseLeave = () => {
        setHoverMenu('');
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <StoreSidebar
            menus={sidebarMenus}
            hoverMenu={hoverMenu}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onNavigate={handleNavigate}
            activeMenu={currentPath}
        />
    );
}

export default StoreSidebarContainer;
