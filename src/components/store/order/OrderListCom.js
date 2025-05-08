import {
  OrderTable,
  OrderHead,
  OrderTh,
  OrderTd,
  HighlightId,
  Btn,
} from '../../../features/store/styles/order/Order.styled';

function OrderListCom({ orderList, onRowClick, getOrderStatusLabel, onEditClick, onDeleteClick,onCancleClick }) {
  const userRole = localStorage.getItem("role");
  return (
    <OrderTable>
      <OrderHead>
        <tr>
          <OrderTh>발주번호</OrderTh>
          <OrderTh>총 수량</OrderTh>
          <OrderTh>총 금액</OrderTh>
          <OrderTh>입고 일자</OrderTh>
          <OrderTh>상태</OrderTh>
          <OrderTh></OrderTh>
        </tr>
      </OrderHead>
      <tbody>
        {orderList.map(order => (
          <tr key={order.orderId} style={{ cursor: 'pointer' }}>
            <OrderTd onClick={() => onRowClick(order.orderId)}>
              <HighlightId>{order.orderId}</HighlightId>
            </OrderTd>
            <OrderTd onClick={() => onRowClick(order.orderId)}>
              {order.totalQuantity}
            </OrderTd>
            <OrderTd onClick={() => onRowClick(order.orderId)}>
              {order.totalAmount.toLocaleString()}원
            </OrderTd>
            <OrderTd onClick={() => onRowClick(order.orderId)}>
              {new Date(order.orderDate).toLocaleString()}
            </OrderTd>
            <OrderTd onClick={() => onRowClick(order.orderId)}>
              {getOrderStatusLabel(order.orderStatus)}
            </OrderTd>
            <OrderTd>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {order.orderStatus === 0 || userRole === "ROLE_HQ" && (
                    <Btn onClick={() => onEditClick(order.orderId)}>수정</Btn>
                )}
                {userRole === "ROLE_HQ" && (
                    <Btn onClick={() => onCancleClick(order.orderId)}>취소</Btn>
                )}
                {order.orderStatus === 0 && userRole === "ROLE_STORE" && (
                    <Btn onClick={() => onDeleteClick(order.orderId)}>삭제</Btn>
                )}
              </div>
            </OrderTd>
          </tr>
        ))}
      </tbody>
    </OrderTable>
  );
}

export default OrderListCom;