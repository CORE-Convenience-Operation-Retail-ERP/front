import React, { useEffect, useState } from "react";
import { deleteOrder, fetchOrderList, removeOrder } from "../../../service/store/OrderService";
import OrderListCom from "../../../components/store/order/OrderListCom";
import StoreSearchBar from "../../../components/store/common/StoreSearchBar";
import Pagination from "../../../components/store/common/Pagination";
import { useNavigate } from "react-router-dom";
import {PageTitle, PageWrapper} from "../../../features/store/styles/common/PageLayout";

// 공통: Null, 빈 값 제거
const cleanParams = (params) =>
  Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== null && v !== undefined && v !== ''));

function OrderListCon() {
  const [orders, setOrders] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const loadOrders = async () => {
    try {
      const params = cleanParams({ ...searchParams, page });
      const res = await fetchOrderList(params);
      setOrders(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      alert("발주 내역을 불러오는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page, searchParams]);

  const handleSearch = (filters) => {
    setPage(0); 
    setSearchParams(filters);
  };

  const handleNavigate = (orderId) => navigate(`/store/order/detail/${orderId}`);
  const handleEdit = (orderId) => navigate(`/store/order/update/${orderId}`);

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
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await removeOrder(orderId);
      alert("발주가 삭제되었습니다.");
      loadOrders();
    } catch (err) {
      alert("삭제 실패: " + err);
    }
  };

  // 검색 필터 옵션 정의
  const filterOptions = [
    { key: 'orderId', label: '발주번호', type: 'text' },
    { key: 'orderStatus', label: '상태', type: 'select', options: [
        { value: '', label: '전체' },
        { value: 0, label: '대기중' },
        { value: 1, label: '입고완료' },
        { value: 2, label: '부분입고' },
        { value: 3, label: '승인완료' },
        { value: 9, label: '취소됨' },
    ]},
    { key: 'date-range', label: '기간', type: 'date-range' }
  ];

  const getOrderStatusLabel = (status) => {
    switch (status) {
      case 0: return "대기중";
      case 1: return "입고완료";
      case 2: return "부분입고";
      case 3: return "승인완료";
      case 9: return "취소됨";
      default: return "대기중";
    }
  };

  return (
    <PageWrapper>
      <PageTitle>| 발주 목록</PageTitle>
      <div style={{ display: "flex", justifyContent: "flex-end" , marginRight: "1rem",marginBottom: "-1.5rem" }}>
        <StoreSearchBar filterOptions={filterOptions} onSearch={handleSearch} />
      </div>
      <OrderListCom
          orderList={orders}
          onRowClick={handleNavigate}
          getOrderStatusLabel={getOrderStatusLabel}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
          onCancleClick={handleCancle}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
      />
    </PageWrapper>
  );
}

export default OrderListCon;