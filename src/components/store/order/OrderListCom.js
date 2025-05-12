import {
  OrderTable,
  OrderHead,
  OrderTh,
  OrderTd,
  HighlightId,
  Btn,
} from '../../../features/store/styles/order/Order.styled';

function OrderListCom({ orderList, onRowClick, getOrderStatusLabel, onEditClick, onDeleteClick, onCancleClick }) {
  const userRole = localStorage.getItem("role");

  const renderCell = (order, content) => (
    <OrderTd onClick={() => onRowClick(order.orderId)}>{content}</OrderTd>
  );

  const renderActionButtons = (order) => {
    const isPending = order.orderStatus === 0;
    return (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {isPending && <Btn onClick={() => onEditClick(order.orderId)}>수정</Btn>}
        {userRole === "ROLE_HQ" && (
          <Btn onClick={() => onCancleClick(order.orderId)}>취소</Btn>
        )}
        {isPending && userRole === "ROLE_STORE" && (
          <Btn onClick={() => onDeleteClick(order.orderId)}>삭제</Btn>
        )}
      </div>
    );
  };
  return (
    <OrderTable>
      <OrderHead>
        <tr>
          <OrderTh>발주번호</OrderTh>
          <OrderTh>총 수량</OrderTh>
          <OrderTh>총 금액</OrderTh>
          <OrderTh>입고 일자</OrderTh>
          <OrderTh>상태</OrderTh>
          <OrderTh>작업</OrderTh>
        </tr>
      </OrderHead>
      <tbody>
        {orderList.map(order => (
          <tr key={order.orderId} style={{ cursor: 'pointer' }}>
            {renderCell(order, <HighlightId>{order.orderId}</HighlightId>)}
            {renderCell(order, order.totalQuantity)}
            {renderCell(order, `${order.totalAmount?.toLocaleString() || 0}원`)}
            {renderCell(order, order.orderDate ? new Date(order.orderDate).toLocaleString() : '-')}
            {renderCell(order, getOrderStatusLabel(order.orderStatus))}
            <OrderTd>{renderActionButtons(order)}</OrderTd>
          </tr>
        ))}
      </tbody>
    </OrderTable>
  );
}

export default OrderListCom;