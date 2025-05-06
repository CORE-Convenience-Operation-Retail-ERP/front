import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { completePartialItems, fetchOrderDetail, completeOrder} from "../../../service/store/OrderService";
import OrderHistoryCom from "../../../components/store/order/OrderHistoryCom";

function OrderHistoryCon() {
  const { id: orderId } = useParams();
  const [items, setItems] = useState([]);
  const [partialItems, setPartialItems] = useState([]);
  const navigate = useNavigate();

  // 1. 상세 데이터 불러오기
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

  // 2. 체크박스 토글
  const handleCheckboxChange = (itemId) => {
    setPartialItems((prev) =>
      prev.some((i) => i.itemId === itemId)
        ? prev.filter((i) => i.itemId !== itemId)
        : [...prev, { itemId, inQuantity: 0, reason: "" }]
    );
  };

  // 3. 수량 입력
  const handleQuantityChange = (itemId, value) => {
    setPartialItems((prev) =>
      prev.map((i) =>
        i.itemId === itemId ? { ...i, inQuantity: parseInt(value) || 0 } : i
      )
    );
  };

  // 4. 사유 입력
  const handleReasonChange = (itemId, value) => {
    setPartialItems((prev) =>
      prev.map((i) =>
        i.itemId === itemId ? { ...i, reason: value } : i
      )
    );
  };

  // 5. 부분 입고 처리
  const handlePartialSubmit = async () => {
    if (partialItems.length === 0) {
      alert("입고할 항목을 선택해주세요.");
      return;
    }
  
    // 유효성 검사
    for (let selected of partialItems) {
      const origin = items.find((i) => i.itemId === selected.itemId);
      if (!origin) continue;
  
      if (selected.inQuantity > origin.orderQuantity) {
        alert(`상품ID ${origin.productId}의 입고 수량이 주문 수량을 초과합니다.`);
        return;
      }
  
      if (
        selected.inQuantity < origin.orderQuantity &&
        (!selected.reason || selected.reason.trim() === "")
      ) {
        alert(`상품ID ${origin.productId}의 입고 수량이 부족한 경우, 사유를 입력해야 합니다.`);
        return;
      }
    }
  
    // 전송
    try {
      await completePartialItems(orderId, partialItems);
      alert("부분 입고 완료!");
      navigate("/store/order/list");
    } catch (err) {
      alert("부분 입고 실패");
    }
  };
  

  const handleCancelSelection = () => {
    setPartialItems([]);
  };
  
  const handleCompleteOrder = async () => {
    try {
      await completeOrder(orderId);
      alert("전체 입고 처리 완료!");
      navigate(-1);
    } catch (e) {
      alert("전체 입고 실패");
    }
  };

  return (
<OrderHistoryCom
  itemList={items}
  partialItems={partialItems}
  onCheckboxChange={handleCheckboxChange}
  onQuantityChange={handleQuantityChange}
  onReasonChange={handleReasonChange}
  onSubmitPartial={handlePartialSubmit}
  onSubmitComplete={handleCompleteOrder}
  onCancelSelection={handleCancelSelection}
  navigate={navigate}
/>
  );
}

export default OrderHistoryCon;