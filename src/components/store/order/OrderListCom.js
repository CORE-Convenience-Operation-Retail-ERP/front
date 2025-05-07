import {
  OrderTable,
  OrderHead,
  OrderTh,
  OrderTd,
  HighlightId,
  Btn,
} from '../../../features/store/styles/order/Order.styled';

function OrderListCom({ orderList, onRowClick, getOrderStatusLabel, onEditClick }) {
  return (
    <OrderTable>
      <OrderHead>
        <tr>
          <OrderTh>발주번호</OrderTh>
          <OrderTh>총 수량</OrderTh>
          <OrderTh>총 금액</OrderTh>
          <OrderTh>입고 일자</OrderTh>
          <OrderTh>상태</OrderTh>
          <OrderTh>수정</OrderTh>
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
              {order.orderStatus !== 1 && (
                <Btn onClick={() => onEditClick(order.orderId)}>수정</Btn>
              )}
            </OrderTd>
          </tr>
        ))}
      </tbody>
    </OrderTable>
  );
}

export default OrderListCom;