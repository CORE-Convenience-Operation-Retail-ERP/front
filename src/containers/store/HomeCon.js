import React, { useState, useEffect } from 'react';
import HomeCom from '../../components/store/main/HomeCom';


const HomeCon = () => {
  const [sales, setSales] = useState(385400);
  const [prevSales, setPrevSales] = useState(355000);
  const [alerts, setAlerts] = useState([
    '재고 부족 상품 3건',
    '폐기 예정 상품 2건',
    '입고 미완료 발주 1건'
  ]);

  const rate = ((sales - prevSales) / prevSales) * 100;

  return (
    <HomeCom sales={sales} rate={rate} alerts={alerts} />
  );
};

export default HomeCon;
