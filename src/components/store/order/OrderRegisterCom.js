// ✅ OrderRegisterCom - register & update 공용 버전
import { useMemo } from 'react';
import {
  Wrapper,
  OrderTable,
  OrderHead,
  OrderTh,
  OrderTd,
  HighlightId,
  Btn
} from '../../../features/store/styles/order/Order.styled';

function OrderRegisterCom({
  mode = 'register', // 'register' | 'update'
  productList = [],
  onQuantityChange,
  onSubmit,
  selectedItems = []
}) {
  const isUpdate = mode === 'update';

  // ▶ 총합 계산
  const summary = useMemo(() => {
    const filtered = productList.filter(p => p.orderQty > 0);
    const totalQuantity = filtered.reduce((sum, p) => sum + p.orderQty, 0);
    const totalAmount = filtered.reduce((sum, p) => sum + (p.orderQty * p.unitPrice), 0);
    return { totalQuantity, totalAmount };
  }, [productList]);

  return (
    <Wrapper>
      <h2>{isUpdate ? '발주 수정' : '발주 등록'}</h2>

      {/* ▶ 요약 정보 */}
      <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
        총 수량: {summary.totalQuantity}개 | 총 금액: {summary.totalAmount.toLocaleString()}원
      </div>

      {/* ▶ 상품 목록 테이블 */}
      <OrderTable>
        <OrderHead>
          <tr>
            <OrderTh>상품명</OrderTh>
            <OrderTh>단가</OrderTh>
            <OrderTh>재고</OrderTh>
            <OrderTh>수량</OrderTh>
          </tr>
        </OrderHead>
        <tbody>
          {productList.map((product, index) => (
            <tr key={product.productId}>
              <OrderTd>{product.productName}</OrderTd>
              <OrderTd>{product.unitPrice.toLocaleString()}원</OrderTd>
              <OrderTd>{product.stockQty}개</OrderTd>
              <OrderTd>
                <input
                  type="number"
                  value={product.orderQty}
                  min={0}
                  style={{ width: '60px' }}
                  onChange={(e) => onQuantityChange(index, e.target.value)}
                />
              </OrderTd>
            </tr>
          ))}
        </tbody>
      </OrderTable>

      {/* ▶ 등록 or 수정 버튼 */}
      <div style={{ marginTop: '1rem' }}>
        <Btn onClick={onSubmit} className={isUpdate ? 'btn-partial' : 'btn-complete'}>
          {isUpdate ? '수정하기' : '등록하기'}
        </Btn>
      </div>
    </Wrapper>
  );
}

export default OrderRegisterCom;