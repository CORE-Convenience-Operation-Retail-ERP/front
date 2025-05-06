import React from 'react';
import { Wrapper, Table } from '../../../features/store/styles/order/Order.styled';

function OrderRegisterCom({ productList, onQuantityChange, onSubmit }) {
  if (!productList || productList.length === 0) {
    return <p>상품 정보가 없습니다.</p>;
  }

  return (
    <Wrapper>
      <h2>📦 발주 등록</h2>
      <Table>
        <thead>
          <tr>
            <th>상품명</th>
            <th>임계치</th>
            <th>원가</th>
            <th>매장재고</th>
            <th>발주 수량</th>
          </tr>
        </thead>
        <tbody>
          {productList.map((product, index) => (
            <tr key={product.productId}>
              <td>{product.productName}</td>
              <td>{product.proStockLimit?.toLocaleString()}개</td>
              <td>{product.unitPrice?.toLocaleString()}원</td>
              <td>{product.stockQty?.toLocaleString()}개</td>
              <td>
                <input
                  type="number"
                  min="0"
                  max={product.proStockLimit}
                  value={product.orderQty}
                  onChange={(e) => onQuantityChange(index, e.target.value)}
                  style={{ width: '60px', textAlign: 'right' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <button onClick={onSubmit}>발주 등록</button>
    </Wrapper>
  );
}

export default OrderRegisterCom;