import { Inventory as InventoryIcon, ShoppingCart as ShoppingCartIcon,
        People as PeopleIcon, CreditCard as CreditCardIcon } from '@mui/icons-material';
import MenuCard from './MenuCard';
import CalendarBox from './CalendarBox';
import SalesSummaryCard from './SalesSummaryCard';


const HomeCom = ({ sales, rate, alerts }) => {
  return (
    <>
      {/* 상단 기능 카드 */}
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '30px' }}>
        <MenuCard icon={<InventoryIcon />} label="재고 관리" to="/store/inventory/current" />
        <MenuCard icon={<ShoppingCartIcon />} label="발주 관리" to="/store/order/list" />
        <MenuCard icon={<PeopleIcon />} label="인사 관리" to="/store/parttimer/list" />
        <MenuCard icon={<CreditCardIcon />} label="매출 관리" to="/store/sales" />
      </div>

      {/* 아래: 캘린더 + 매출 카드 */}
      <div style={{ display: 'flex', gap: '30px', justifyContent: 'center' }}>
      <CalendarBox />
      <SalesSummaryCard sales={sales} rate={rate} alerts={alerts} />
      </div>
    </>
  );

};

export default HomeCom;
