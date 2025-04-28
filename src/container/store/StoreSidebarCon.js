import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StoreSidebar from '../../components/store/StoreSidebar';
import {
    Home as HomeIcon,
    Inventory as InventoryIcon,
    ShoppingCart as ShoppingCartIcon,
    People as PeopleIcon,
    CreditCard as CreditCardIcon,
    BarChart as BarChartIcon
} from '@mui/icons-material';

const sidebarMenus = [
    { name: '홈', path: '/home', icon: <HomeIcon /> },
    {
        name: '재고 관리', icon: <InventoryIcon />, submenu: [
            { name: '재고 현황', path: '/inventory/current' },
            { name: '폐기 관리', path: '/inventory/disposal' },
        ]
    },
    {
        name: '발주 관리', icon: <ShoppingCartIcon />, submenu: [
            { name: '발주 등록', path: '/order/register' },
            { name: '발주 현황', path: '/order/list' },
        ]
    },
    {
        name: '인사 관리', icon: <PeopleIcon />, submenu: [
            { name: '직원 관리', path: '/hr/employee' },
            { name: '스케줄 관리', path: '/hr/schedule' },
            { name: '급여 관리', path: '/hr/salary' },
        ]
    },
    { name: '매출 관리', path: '/sales', icon: <CreditCardIcon /> },
    {
        name: '통계 관리', icon: <BarChartIcon />, submenu: [
            { name: '발주 통계', path: '/stats/order' },
            { name: '상품별 매출 순위', path: '/stats/sales' },
        ]
    },
];

function StoreSidebarContainer() {
    const [hoverMenu, setHoverMenu] = useState('');
    const navigate = useNavigate();

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
        />
    );
}

export default StoreSidebarContainer;
