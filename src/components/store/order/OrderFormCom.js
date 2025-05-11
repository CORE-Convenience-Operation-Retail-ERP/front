import React, { useMemo } from "react";
import {
  OrderTable,
  OrderHead,
  OrderTh,
  OrderTd,
  Btn,
  HighlightId,
} from "../../../features/store/styles/order/Order.styled";

function OrderFormCom({
  productList = [],
  selectedItems = [],
  setSelectedItems,
  onSubmit,
  isEdit = false,
  storeOptions = [],
  selectedStoreId = "",
  onStoreChange = () => {},
}) {
  const getQuantity = (productId) =>
    selectedItems.find(item => item.productId === productId)?.quantity || '';

  const handleQuantityChange = (product, quantity) => {
    setSelectedItems(prev => {
      const exists = prev.some(item => item.productId === product.productId);
      const updatedItem = {
        productId: product.productId,
        productName: product.productName,
        quantity,
        unitPrice: product.unitPrice,
      };

      return exists
        ? prev.map(item => item.productId === product.productId ? updatedItem : item)
        : [...prev, updatedItem];
    });
  };

  const { totalQty, totalAmount } = useMemo(() => {
    return selectedItems.reduce(
      (acc, item) => ({
        totalQty: acc.totalQty + item.quantity,
        totalAmount: acc.totalAmount + item.quantity * item.unitPrice,
      }),
      { totalQty: 0, totalAmount: 0 }
    );
  }, [selectedItems]);

  const handleSubmitClick = async () => {
    try {
      await onSubmit();
    } catch (err) {
      alert(err?.message || "처리 중 오류 발생");
    }
  };

  return (
    <div>
      {localStorage.getItem("role") === "ROLE_HQ" && (
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ marginRight: "8px" }}>매장 선택:</label>
          <select value={selectedStoreId} onChange={onStoreChange}>
            <option value="">전체 매장</option>
            {storeOptions.map(store => (
              <option key={store.storeId} value={store.storeId}>
                {store.storeName}
              </option>
            ))}
          </select>
        </div>
      )}

      <div style={{ display: "flex", gap: "2rem" }}>
        {/* 상품 목록 */}
        <div style={{ flex: 2 }}>
          <h3>상품 목록</h3>
          <OrderTable>
            <OrderHead>
              <tr>
                <OrderTh>ID</OrderTh>
                <OrderTh>상품명</OrderTh>
                <OrderTh>바코드</OrderTh>
                <OrderTh>카테고리</OrderTh>
                <OrderTh>단가</OrderTh>
                <OrderTh>재고</OrderTh>
                <OrderTh>임계치</OrderTh>
                <OrderTh>수량</OrderTh>
              </tr>
            </OrderHead>
            <tbody>
              {productList.length > 0 ? (
                productList.map(product => {
                  const isSelected = selectedItems.some(
                    item => item.productId === product.productId
                  );
                  return (
                    <tr
                      key={product.productId}
                      style={{
                        backgroundColor: isSelected ? "#f5fffa" : "transparent",
                      }}
                    >
                      <OrderTd><HighlightId>{product.productId}</HighlightId></OrderTd>
                      <OrderTd>{product.productName}</OrderTd>
                      <OrderTd>{product.barcode || "-"}</OrderTd>
                      <OrderTd>{product.categoryName || "-"}</OrderTd>
                      <OrderTd>{product.unitPrice.toLocaleString()}</OrderTd>
                      <OrderTd>{product.stockQty}</OrderTd>
                      <OrderTd>{product.proStockLimit}</OrderTd>
                      <OrderTd>
                        <input
                          type="number"
                          min="0"
                          max={product.proStockLimit}
                          value={getQuantity(product.productId)}
                          onChange={(e) =>
                            handleQuantityChange(
                              product,
                              Math.max(0, parseInt(e.target.value || 0))
                            )
                          }
                        />
                      </OrderTd>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <OrderTd colSpan={8} style={{ textAlign: "center", padding: "20px" }}>
                    상품이 없습니다.
                  </OrderTd>
                </tr>
              )}
            </tbody>
          </OrderTable>
        </div>

        {/* 선택 상품 요약 */}
        <div style={{ flex: 1 }}>
          <h3>상품 요약</h3>
          <ul>
            {selectedItems.map(item => (
              <li key={item.productId}>
                {item.productName} / 수량: {item.quantity} / 금액:{" "}
                {(item.unitPrice * item.quantity).toLocaleString()}원
              </li>
            ))}
          </ul>
          <p><strong>총 수량:</strong> {totalQty}</p>
          <p><strong>총 금액:</strong> {totalAmount.toLocaleString()}원</p>
          <Btn onClick={handleSubmitClick}>
            {isEdit ? "수정 완료" : "발주 등록"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

export default OrderFormCom;