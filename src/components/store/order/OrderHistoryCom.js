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
                             partTimers,
                             selectedPartTimerId,
                             setSelectedPartTimerId,
                             onCheckboxChange,
                             onQuantityChange,
                             onReasonChange,
                             handleSubmitStockIn,
                             onCancelSelection,
                             onSelectAllChange,
                             navigate
                         }) {
    const handleSelectAll = (e) => {
        onSelectAllChange(e.target.checked);
    };

    const getPartialItem = (itemId) =>
        partialItems.find((i) => i.itemId === itemId) || {};

    return (
        <>
            <label htmlFor="partTimer">입고 담당자 선택</label>
            <select
                id="partTimer"
                value={selectedPartTimerId || ''}
                onChange={(e) => setSelectedPartTimerId(Number(e.target.value))}
            >
                <option value="">-- 알바 선택 --</option>
                {partTimers.map((pt) => (
                    <option key={pt.partTimerId} value={pt.partTimerId}>
                        {pt.partName} ({pt.position})
                    </option>
                ))}
            </select>

            <OrderTable>
                <OrderHead>
                    <tr>
                        <OrderTh>
                            <input type="checkbox" onChange={handleSelectAll} />
                        </OrderTh>
                        <OrderTh>상품명</OrderTh>
                        <OrderTh>주문수량</OrderTh>
                        <OrderTh>입고됨</OrderTh>
                        <OrderTh>단가</OrderTh>
                        <OrderTh>총액</OrderTh>
                        <OrderTh>입고 수량</OrderTh>
                        <OrderTh>사유</OrderTh>
                    </tr>
                </OrderHead>
                <tbody>
                {itemList.map((item) => {
                    const {
                        itemId,
                        productName,
                        orderQuantity,
                        receivedQuantity = 0,
                        unitPrice,
                        totalPrice
                    } = item;

                    const remainingQty = orderQuantity - receivedQuantity;
                    const selected = getPartialItem(itemId);
                    const isDisabled = remainingQty <= 0;

                    return (
                        <tr key={itemId}>
                            <OrderTd>
                                <input
                                    type="checkbox"
                                    checked={!!selected.itemId}
                                    disabled={isDisabled}
                                    onChange={() => onCheckboxChange(itemId, remainingQty)}
                                />
                            </OrderTd>
                            <OrderTd>
                                <HighlightId>{productName}</HighlightId>
                            </OrderTd>
                            <OrderTd>{orderQuantity}</OrderTd>
                            <OrderTd>{receivedQuantity}</OrderTd>
                            <OrderTd>{unitPrice.toLocaleString()}원</OrderTd>
                            <OrderTd>{totalPrice.toLocaleString()}원</OrderTd>
                            <OrderTd>
                                <div style={{ fontSize: '12px', color: 'gray' }}>
                                    남음: {remainingQty}
                                </div>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    min="0"
                                    max={remainingQty}
                                    value={
                                        selected.inQuantity !== undefined
                                            ? selected.inQuantity
                                            : ''
                                    }
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '') {
                                            onQuantityChange(item.itemId, undefined);
                                        } else {
                                            onQuantityChange(item.itemId, value);
                                        }
                                    }}
                                    disabled={isDisabled}
                                />
                            </OrderTd>
                            <OrderTd>
                                <input
                                    type="text"
                                    value={selected.reason || ''}
                                    onChange={(e) => onReasonChange(itemId, e.target.value)}
                                    disabled={
                                        !selected.itemId ||
                                        selected.inQuantity === remainingQty ||
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
                <Btn className="btn-submit" onClick={handleSubmitStockIn}>
                    입고 처리
                </Btn>
                <Btn className="btn-back" onClick={() => navigate(-1)}>
                    이전으로
                </Btn>
            </div>
        </>
    );
}

export default OrderHistoryCom;
