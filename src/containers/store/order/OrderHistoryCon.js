import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchOrderDetail } from "../../../service/store/OrderService";
import OrderHistoryCom from "../../../components/store/order/OrderHistoryCom";

function OrderHistoryCon() {
  
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const orderId = id;

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const res = await fetchOrderDetail(orderId);
        setItems(res.data);
      } catch (err) {
        alert("상세 내역 조회 실패");
      }
    };
    loadDetail();
  }, [orderId]);

  return <OrderHistoryCom itemList={items} />;
}

export default OrderHistoryCon;