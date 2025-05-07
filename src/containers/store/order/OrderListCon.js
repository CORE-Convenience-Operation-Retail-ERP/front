import { useEffect, useState } from "react";
import { fetchOrderList } from "../../../service/store/OrderService";
import OrderListCom from "../../../components/store/order/OrderListCom";
import Pagination from "../../../components/store/common/Pagination";
import { useNavigate } from "react-router-dom";

function OrderListCon() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const loadOrders = async () => {
    try {
      const res = await fetchOrderList({ page });
      setOrders(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      alert("발주 내역을 불러오는 데 실패했습니다.");
    }
  };

  const getOrderStatusLabel = (status) => {
    switch (status) {
      case 1: return "입고완료";
      case 2: return "부분입고중";
      default: return "대기중";
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page]);

  const handleNavigate = (orderId) => {
    navigate(`/store/order/detail/${orderId}`);
  };

  return (
    <>
      <OrderListCom orderList={orders} onRowClick={handleNavigate} getOrderStatusLabel={getOrderStatusLabel}/>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
}

export default OrderListCon;
