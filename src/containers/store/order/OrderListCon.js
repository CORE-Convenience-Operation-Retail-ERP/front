import { useEffect, useState } from "react";
import {deleteOrder, fetchOrderList, removeOrder} from "../../../service/store/OrderService";
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
      case 0:
        return "대기중";
      case 1:
        return "입고완료";
      case 2:
        return "부분입고";
      case 3:
        return "승인완료";
      case 9:
        return "취소됨";
      default:
        return "대기중";
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page]);

  const handleNavigate = (orderId) => {
    navigate(`/store/order/detail/${orderId}`);
  };

  const handleEdit = (orderId) => {
    navigate(`/store/order/update/${orderId}`);
  };

  const handleCancle = async (orderId) => {
    if (!window.confirm("정말 취소하시겠습니까?")) return;

    try {
      await deleteOrder(orderId);
      alert("취소되었습니다.");
      loadOrders();
    } catch (err) {
      alert("취소 실패: " + err);
    }
  };

  const handleDelete = async (orderId) => {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await removeOrder(orderId);
      alert("발주가 삭제되었습니다.");
      loadOrders(); // 삭제 후 목록 갱신
    } catch (err) {
      alert("삭제 실패: " + err);
    }
  };


  return (
    <>
      <OrderListCom 
        orderList={orders} 
        onRowClick={handleNavigate} 
        getOrderStatusLabel={getOrderStatusLabel}
        onEditClick={handleEdit}
        onDeleteClick={handleDelete}
        onCancleClick={handleCancle}
      />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
}

export default OrderListCon;
