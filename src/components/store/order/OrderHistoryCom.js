import {
    OrderTable,
    OrderHead,
    OrderTh,
    OrderTd,
    HighlightId,
  } from '../../../features/store/styles/order/Order.styled';
  
  function OrderHistoryCom({ itemList }) {
    console.log("🧾 상세 아이템 리스트:", itemList);

    if (!itemList || itemList.length === 0) {
      return <p>상세 내역이 없습니다.</p>;
    }
  
    return (
      <OrderTable>
        <OrderHead>
          <tr>
            <OrderTh>상품명</OrderTh>
            <OrderTh>주문 수량</OrderTh>
            <OrderTh>단가</OrderTh>
            <OrderTh>총 금액</OrderTh>
            <OrderTh>입고 상태</OrderTh>
          </tr>
        </OrderHead>
        <tbody>
          {itemList.map((item, idx) => (
            <tr key={idx}>
              <OrderTd>{item.productName}</OrderTd>
              <OrderTd>{item.orderQuantity}</OrderTd>
              <OrderTd>{item.unitPrice.toLocaleString()}원</OrderTd>
              <OrderTd>{item.totalPrice.toLocaleString()}원</OrderTd>
              <OrderTd>
                {item.orderState === 0
                  ? '대기'
                  : item.orderState === 1
                  ? '입고완료'
                  : '기타'}
              </OrderTd>
            </tr>
          ))}
        </tbody>
      </OrderTable>
    );
  }
  
  export default OrderHistoryCom;  