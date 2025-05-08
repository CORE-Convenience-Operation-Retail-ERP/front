import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchOrderDetail,
  registerOrder,
  updateOrder,
  fetchOrderProductList,
} from "../../../service/store/OrderService";
import OrderFormCom from "../../../components/store/order/OrderFormCom";
import Pagination from "../../../components/store/common/Pagination";

function OrderFormCon() {
  const { id: orderId } = useParams();
  const isEdit = !!orderId;
  const navigate = useNavigate();

  const PAGE_SIZE = 10;

  const [allProducts, setAllProducts] = useState([]); // 전체 상품
  const [selectedItems, setSelectedItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // 전체 상품 불러오기
  const loadProducts = useCallback(async () => {
    try {
      const res = await fetchOrderProductList({ page: 0, size: 1000 });
      const products = res.data.content || [];
      setAllProducts(products);
      setTotalPages(Math.ceil(products.length / PAGE_SIZE));
    } catch {
      alert("상품 정보를 불러오지 못했습니다.");
    }
  }, []);

  // 기존 발주 불러오기
  const loadInitialOrder = useCallback(async () => {
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
    } catch {
      alert("기존 발주 조회 실패");
      navigate("/store/order/list");
    } finally {
      setLoading(false);
    }
  }, [isEdit, orderId, navigate]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadInitialOrder();
  }, [loadInitialOrder]);

  // 수량 변경 핸들러
  const handleQuantityChange = (product, quantity) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.productId === product.productId);
      const updatedItem = {
        productId: product.productId,
        productName: product.productName || exists?.productName || "상품명 없음",
        unitPrice: product.unitPrice || exists?.unitPrice || 0,
        quantity,
      };

      const merged = exists
          ? prev.map(i => i.productId === product.productId ? updatedItem : i)
          : [...prev, updatedItem];

      return merged;
    });
  };

  // 제출 핸들러
  const handleSubmit = async () => {
    const items = selectedItems
        .filter(item => item.quantity > 0)
        .map(({ productId, quantity, unitPrice }) => ({
          productId,
          quantity,
          unitPrice,
        }));

    if (items.length === 0) {
      alert("1개 이상의 유효한 상품을 선택해주세요.");
      return;
    }

    try {
      if (isEdit) {
        await updateOrder(orderId, items);
        alert("발주 수정 완료!");
      } else {
        await registerOrder({
          storeId: localStorage.getItem("storeId"),
          items,
        });
        alert("발주 등록 완료!");
      }
      navigate("/store/order/list");
    } catch (err) {
      alert(typeof err === "string" ? err : err.message || "처리 실패");
    }
  };

  if (loading) return <div>로딩 중...</div>;

  const currentProducts = allProducts.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
      <>
        <OrderFormCom
            productList={currentProducts}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            onSubmit={handleSubmit}
            isEdit={isEdit}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
        />
        <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
        />
      </>
  );
}

export default OrderFormCon;
