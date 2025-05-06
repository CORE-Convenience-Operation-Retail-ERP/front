import {
    OrderTable,
    OrderHead,
    OrderTh,
    OrderTd,
    HighlightId,
  } from '../../../features/store/styles/order/Order.styled';

function OrderListCom({ orderList, onRowClick }) {
    return (
      <OrderTable>
        <OrderHead>
          <tr>
            <OrderTh>발주번호</OrderTh>
            <OrderTh>총 수량</OrderTh>
            <OrderTh>총 금액</OrderTh>
            <OrderTh>상태</OrderTh>
          </tr>
        </OrderHead>
        <tbody>
          {orderList.map(order => (
            <tr
            key={order.orderId}
            style={{ cursor: 'pointer' }}
            onClick={() => onRowClick(order.orderId)}
          >
              <OrderTd><HighlightId>{order.orderId}</HighlightId></OrderTd>
              <OrderTd>{order.totalQuantity}</OrderTd>
              <OrderTd>{order.totalAmount.toLocaleString()}원</OrderTd>
              <OrderTd>{order.orderStatus === 0 ? '요청됨' : '입고완료'}</OrderTd>
            </tr>
          ))}
        </tbody>
      </OrderTable>
    );
  }
  
  export default OrderListCom;
  