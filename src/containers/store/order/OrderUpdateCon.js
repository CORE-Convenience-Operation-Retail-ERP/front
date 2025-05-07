import { useEffect, useState } from "react";
import { fetchOrderDetail, fetchOrderProductList, updateOrder } from "../../../service/store/OrderService";
import { useParams, useNavigate } from "react-router-dom";
import OrderFormCom from "../../../components/store/order/OrderFormCom";

function OrderUpdateCon() {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const [productList, setProductList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrderDetail(orderId)
      .then(res => {
        const items = res.data.map(i => ({
          productId: i.productId,
          quantity: i.orderQuantity,
          unitPrice: i.unitPrice
        }));
        setSelectedItems(items);
      })
      .catch(() => alert("상세 조회 실패"));

    fetchOrderProductList({ page, size: 10 })
      .then(res => {
        setProductList(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(() => alert("상품 목록 실패"));
  }, [orderId, page]);

  const handleQuantityChange = (productId, quantity, unitPrice) => {
    const updated = [...selectedItems];
    const idx = updated.findIndex(i => i.productId === productId);

    if (idx !== -1) {
      updated[idx].quantity = quantity;
    } else {
      updated.push({ productId, quantity, unitPrice });
    }
    setSelectedItems(updated.filter(i => i.quantity > 0));
  };

  const handleSubmit = async () => {
    if (selectedItems.length === 0) return alert("상품을 선택하세요.");

    await updateOrder(orderId, selectedItems);
    alert("수정 완료");
    navigate("/store/order/list");
  };

  return (
    <OrderFormCom
      productList={productList}
      selectedItems={selectedItems}
      setSelectedItems={setSelectedItems}
      onQuantityChange={handleQuantityChange}
      onSubmit={handleSubmit}
      isEdit={true}
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
    />
  );
}
export default OrderUpdateCon;