import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchOrderDetail,
  registerOrder,
  updateOrder,
  fetchOrderProductList,
} from "../../../service/store/OrderService";
import OrderFormCom from "../../../components/store/order/OrderFormCom";

function OrderFormCon() {
  const { id: orderId } = useParams(); // 없으면 등록, 있으면 수정
  const isEdit = !!orderId;
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // 전체 상품 + 재고 목록
  const loadProducts = async () => {
    try {
      const res = await fetchOrderProductList({ page });
      const list = res.data.content || [];
      setProducts(list);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      alert("상품 정보를 불러오지 못했습니다.");
    }
  };

  // 기존 발주 내역 불러오기
  const loadInitialOrder = async () => {
    if (!isEdit) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetchOrderDetail(orderId);
      const mapped = res.data.map(item => ({
        productId: item.productId,
        quantity: item.orderQuantity,
        unitPrice: item.unitPrice,
        productName: item.productName,
      }));
      setSelectedItems(mapped);
      setLoading(false);
    } catch (err) {
      alert("기존 발주 조회 실패");
      navigate("/store/order/list");
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page]);

  useEffect(() => {
    loadInitialOrder();
  }, [orderId]);

  // 수량 변경
  const handleQuantityChange = (productId, quantity, unitPrice) => {
    const product = products.find(p => p.productId === productId);
    const productName = product?.productName || product?.proName || '';

    setSelectedItems(prev => {
      const exists = prev.find(i => i.productId === productId);
      if (exists) {
        return prev.map(i =>
          i.productId === productId ? { ...i, quantity } : i
        );
      } else {
        return [...prev, { productId, productName, quantity, unitPrice }];
      }
    });
  };

  // 등록 or 수정
  const handleSubmit = async () => {
    const payload = selectedItems.map(item => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));

    if (payload.length === 0) {
      alert("1개 이상 선택해주세요");
      return;
    }

    try {
      if (isEdit) {
        await updateOrder(orderId, JSON.stringify({ items: payload }, null, 2));
        alert("발주 수정 완료");
      } else {
        await registerOrder({
          storeId: localStorage.getItem("storeId"),
          items: payload,
        });
        alert("발주 등록 완료");
      }
      
      navigate("/store/order/list");
    } catch (err) {
      alert(isEdit ? "수정 실패" : "등록 실패");
    }
  };

  if (loading) return <div>로딩중...</div>;

  return (
    <OrderFormCom
      productList={products}
      selectedItems={selectedItems}
      setSelectedItems={setSelectedItems}
      onSubmit={handleSubmit}
      onQuantityChange={handleQuantityChange}
      isEdit={isEdit}
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
    />
  );
}

export default OrderFormCon;