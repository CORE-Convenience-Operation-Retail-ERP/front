import {
  OrderTable,
  OrderHead,
  OrderTh,
  OrderTd,
  HighlightId,
  Btn
} from '../../../features/store/styles/order/Order.styled';

function OrderHistoryCom({
  itemList,
  partialItems,
  onCheckboxChange,
  onQuantityChange,
  onReasonChange,
  onSubmitPartial,
  onSubmitComplete,
  onCancelSelection,
  navigate
}) {
  return (
    <>
      <OrderTable>
        <OrderHead>
          <tr>
            <OrderTh>선택</OrderTh>
            <OrderTh>상품ID</OrderTh>
            <OrderTh>주문수량</OrderTh>
            <OrderTh>단가</OrderTh>
            <OrderTh>총액</OrderTh>
            <OrderTh>입고 수량</OrderTh>
            <OrderTh>사유</OrderTh>
          </tr>
        </OrderHead>
        <tbody>
        {itemList?.map((item) => {
          const selected = partialItems.find((i) => i.itemId === item.itemId) || {};
          return (
            <tr key={item.itemId}>
              <OrderTd>
                <input
                  type="checkbox"
                  checked={!!selected.itemId}
                  onChange={() => onCheckboxChange(item.itemId)}
                />
              </OrderTd>
              <OrderTd><HighlightId>{item.productId}</HighlightId></OrderTd>
              <OrderTd>{item.orderQuantity}</OrderTd>
              <OrderTd>{item.unitPrice.toLocaleString()}원</OrderTd>
              <OrderTd>{item.totalPrice.toLocaleString()}원</OrderTd>
              <OrderTd>
              <input
                type="number"
                min={1}
                max={item.orderQuantity}
                value={selected.inQuantity || ''}
                onChange={(e) => onQuantityChange(item.itemId, e.target.value)}
                disabled={!selected.itemId}
                />
              </OrderTd>
              <OrderTd>
              <input
                type="text"
                value={selected.reason || ''}
                onChange={(e) => onReasonChange(item.itemId, e.target.value)}
                disabled={
                  !selected.itemId ||
                  selected.inQuantity === item.orderQuantity || // 전체 수량이면 사유 입력 불필요
                  selected.inQuantity === 0
                }
              />
              </OrderTd>
            </tr>
          );
        })}
      </tbody>
      </OrderTable>
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <Btn className="btn-partial" onClick={onSubmitPartial}   disabled={partialItems.length === 0}
        >부분 입고 처리</Btn>
        <Btn className="btn-complete" onClick={onSubmitComplete}>전체 입고 처리</Btn>
        <Btn className="btn-cancel" onClick={onCancelSelection}>선택 취소</Btn>
        <Btn className="btn-back" onClick={() => navigate(-1)}>이전으로</Btn>
      </div>

      </>
        );
}

export default OrderHistoryCom;