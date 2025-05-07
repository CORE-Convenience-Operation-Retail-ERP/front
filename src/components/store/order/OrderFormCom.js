import React from 'react';
import {
  OrderTable,
  OrderHead,
  OrderTh,
  OrderTd,
  Btn,
  HighlightId
} from '../../../features/store/styles/order/Order.styled';

function OrderFormCom({
  productList = [],
  selectedItems = [],
  setSelectedItems,
  onSubmit,
  isEdit = false,
  page = 0,
  totalPages = 1,
  onPageChange
}) {
  const getQty = (productId) => {
    const found = selectedItems.find(i => i.productId === productId);
    return found ? found.quantity : '';
  };

  const handleQuantityChange = (product, quantity) => {
    const updated = [...selectedItems];
    const existing = updated.find(i => i.productId === product.productId);

    if (existing) {
      existing.quantity = quantity;
    } else {
      updated.push({
        productId: product.productId,
        productName: product.productName,
        quantity,
        unitPrice: product.unitPrice
      });
    }

    const filtered = updated.filter(i => i.quantity > 0);
    setSelectedItems(filtered);
  };

  const getTotal = () => {
    let totalQty = 0;
    let totalAmount = 0;
    selectedItems.forEach(item => {
      totalQty += item.quantity;
      totalAmount += item.quantity * item.unitPrice;
    });
    console.log('set',selectedItems)
    return { totalQty, totalAmount };
  };

  const { totalQty, totalAmount } = getTotal();
  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      {/* 왼쪽: 상품 목록 */}
      <div style={{ flex: 2 }}>
        <h3>상품 목록</h3>
        <OrderTable>
          <OrderHead>
            <tr>
              <OrderTh>ID</OrderTh>
              <OrderTh>상품명</OrderTh>
              <OrderTh>단가</OrderTh>
              <OrderTh>재고</OrderTh>
              <OrderTh>임계치</OrderTh>
              <OrderTh>수량</OrderTh>
            </tr>
          </OrderHead>
          <tbody>
            {productList.map(product => (
              <tr key={product.productId}>
                <OrderTd><HighlightId>{product.productId}</HighlightId></OrderTd>
                <OrderTd>{product.productName}</OrderTd>
                <OrderTd>{product.unitPrice.toLocaleString()}</OrderTd>
                <OrderTd>{product.stockQty}</OrderTd>
                <OrderTd>{product.proStockLimit}</OrderTd>
                <OrderTd>
                  <input
                    type="number"
                    min="0"
                    max={product.proStockLimit}
                    value={getQty(product.productId)}
                    onChange={(e) =>
                      handleQuantityChange(
                        product,
                        parseInt(e.target.value || 0)
                      )
                    }
                  />
                </OrderTd>
              </tr>
            ))}
          </tbody>
        </OrderTable>
        {/* 페이징 */}
        <div style={{ marginTop: '1rem' }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i)}
              style={{ marginRight: '0.5rem', fontWeight: i === page ? 'bold' : 'normal' }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* 오른쪽: 선택한 상품 */}
      <div style={{ flex: 1 }}>
        <h3>선택한 상품 요약</h3>
        <ul>
          {selectedItems.map(item => (
            <li key={item.productId}>
              {item.proName} / 수량: {item.quantity} / 금액: {(item.unitPrice * item.quantity).toLocaleString()}원
            </li>
          ))}
        </ul>
        <p><strong>총 수량:</strong> {totalQty}</p>
        <p><strong>총 금액:</strong> {totalAmount.toLocaleString()}원</p>
        <Btn onClick={onSubmit}>{isEdit ? '수정 완료' : '발주 등록'}</Btn>
      </div>
    </div>
  );
}

export default OrderFormCom;