import {
    Wrapper,
    OrderTable,
    OrderHead,
    OrderTh,
    OrderTd,
    Btn
  } from '../../../features/store/styles/order/Order.styled.js';
  
  function OrderUpdateCom({ productList, selectedItems, setSelectedItems, onSubmit }) {
    // 수량 변경 핸들러
    const handleQuantityChange = (productId, value) => {
      const quantity = parseInt(value, 10) || 0;
      setSelectedItems(prev => {
        const exists = prev.find(item => item.productId === productId);
        if (exists) {
          return prev.map(item =>
            item.productId === productId ? { ...item, quantity } : item
          );
        } else {
          const product = productList.find(p => p.productId === productId);
          return [...prev, { productId, quantity, unitPrice: product.unitPrice }];
        }
      });
    };
  
    // 상품 선택 제거
    const handleRemove = (productId) => {
      setSelectedItems(prev => prev.filter(item => item.productId !== productId));
    };
  
    return (
      <Wrapper>
        <h2>발주 수정</h2>
  
        <OrderTable>
          <OrderHead>
            <tr>
              <OrderTh>상품명</OrderTh>
              <OrderTh>단가</OrderTh>
              <OrderTh>수량</OrderTh>
              <OrderTh>총액</OrderTh>
              <OrderTh>삭제</OrderTh>
            </tr>
          </OrderHead>
          <tbody>
            {selectedItems.map(item => {
              const product = productList.find(p => p.productId === item.productId);
              if (!product) return null;
              return (
                <tr key={item.productId}>
                  <OrderTd>{product.productName}</OrderTd>
                  <OrderTd>{item.unitPrice.toLocaleString()}원</OrderTd>
                  <OrderTd>
                    <input
                      type="number"
                      value={item.quantity}
                      min={1}
                      onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                    />
                  </OrderTd>
                  <OrderTd>{(item.quantity * item.unitPrice).toLocaleString()}원</OrderTd>
                  <OrderTd>
                    <Btn className="btn-cancel" onClick={() => handleRemove(item.productId)}>
                      삭제
                    </Btn>
                  </OrderTd>
                </tr>
              );
            })}
          </tbody>
        </OrderTable>
  
        <div style={{ marginTop: '1rem' }}>
          <Btn className="btn-complete" onClick={onSubmit}>수정 완료</Btn>
          <Btn className="btn-back" onClick={() => window.history.back()}>돌아가기</Btn>
        </div>
      </Wrapper>
    );
  }
  
  export default OrderUpdateCom;  