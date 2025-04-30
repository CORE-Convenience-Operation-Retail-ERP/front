import { FiBox, FiClipboard, FiUser, FiBarChart2 } from 'react-icons/fi';
import MenuCard from './MenuCard';

const HomeCom = () => {
  return (
    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '30px' }}>
      <MenuCard icon={<FiBox />} label="재고관리" to="/store/inventory" />
      <MenuCard icon={<FiClipboard />} label="발주내역" to="/store/orders" />
      <MenuCard icon={<FiUser />} label="직원관리" to="/store/staff" />
      <MenuCard icon={<FiBarChart2 />} label="매출관리" to="/store/sales" />
    </div>
  );
};

export default HomeCom;
