import { useEffect, useState } from "react";
import OrderRegisterCom from "../../../components/store/order/OrderRegisterCom";
import { useNavigate } from "react-router-dom";
import { registerOrder, fetchOrderProductList } from "../../../service/store/OrderService";
import Pagination from "../../../components/store/common/Pagination"; 


function OrderRegisterCon() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);  
  const [totalPages, setTotalPages] = useState(1); 

  // [1] 상품 + 재고 리스트 불러오기
  const loadProducts = async () => {
    try {
      const res = await fetchOrderProductList({ page }); 
      const list = res.data.content || [];
      const initial = list.map(p => ({
        ...p,
        orderQty: 0,
      }));
      setProducts(initial);
      setTotalPages(res.data.totalPages);  
    } catch (err) {
      alert("상품 정보를 불러올 수 없습니다.");
    }
  };
  
  useEffect(() => {
    loadProducts();
  }, [page]);

  // [2] 수량 변경 핸들러
  const handleQuantityChange = (index, value) => {
    const updated = [...products];
    updated[index].orderQty = parseInt(value || 0);
    setProducts(updated);
  };

  // [3] 발주 등록
  const handleSubmit = async () => {
    const selectedItems = products
      .filter(p => p.orderQty > 0)
      .map(p => ({
        productId: p.productId,
        quantity: p.orderQty,
        unitPrice: p.unitPrice
      }));

    if (selectedItems.length === 0) {
      alert("1개 이상의 상품을 선택해주세요.");
      return;
    }

    try {
      await registerOrder({
        storeId: localStorage.getItem("storeId"), 
        items: selectedItems
      });
      alert("발주 등록 성공!");
      navigate("/store/order/list");
    } catch (err) {
      alert("발주 등록 실패");
    }
  };

  return (
    <>
    <OrderRegisterCom
      productList={products}
      onQuantityChange={handleQuantityChange}
      onSubmit={handleSubmit}
    />
    <Pagination
    currentPage={page}
    totalPages={totalPages}
    onPageChange={(newPage) => setPage(newPage)}
  />
  </>
  );
}

export default OrderRegisterCon;