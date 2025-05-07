import React from 'react';

function OrderQuantityInput({ product, quantity, onChange }) {
  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    const maxQty = product.proStockLimit;
    const safeQty = isNaN(value) ? 0 : Math.min(value, maxQty);
    onChange(product.productId, safeQty);
  };

  return (
    <div>
      <input
        type="number"
        min="0"
        max={product.proStockLimit}
        value={quantity}
        onChange={handleChange}
      />
      <small style={{ color: '#999' }}>
        최대 {product.proStockLimit}개까지 입력 가능합니다
      </small>
    </div>
  );
}

export default OrderQuantityInput;
