import React from "react";

function InventoryRegisterCom({
                                  products = [],
                                  realQuantities = {},
                                  onQuantityChange,
                                  onRegister,
                                  partTimers = [],
                                  partTimerId,
                                  setPartTimerId,
                                  reason,
                                  setReason,
                              }) {

    return (
        <div>
            <h2>실사 등록</h2>

            {/* 담당자 및 사유 입력 */}
            <div style={{ marginBottom: "1rem" }}>
                <label>
                    담당자:
                    <select value={partTimerId} onChange={(e) => setPartTimerId(e.target.value)}>
                        <option value="">담당자 선택</option>
                        {partTimers.map((pt) => (
                            <option key={pt.partTimerId} value={pt.partTimerId}>
                                {pt.partName} (ID: {pt.partTimerId})
                            </option>
                        ))}
                    </select>
                </label>

                <label style={{ marginLeft: "2rem" }}>
                    사유:
                    <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} />
                </label>
            </div>

            {/* 상품 테이블 */}
            <table>
                <thead>
                <tr>
                    <th>상품명</th>
                    <th>바코드</th>
                    <th>현재 재고</th>
                    <th>매장 실사</th>
                    <th>창고 실사</th>
                    <th>총 재고</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product) => {
                    const barcode = product.barcode;
                    const storeValue = realQuantities[barcode]?.store;
                    const warehouseValue = realQuantities[barcode]?.warehouse;
                    const totalRealQty = (parseInt(storeValue || 0, 10)) + (parseInt(warehouseValue || 0, 10));
                    return (
                        <tr key={product.productId}>
                            <td>{product.productName}</td>
                            <td>{barcode}</td>
                            <td>{product.totalQuantity}</td>
                            <td>
                                <input
                                    type="number"
                                    placeholder="매장"
                                    value={storeValue ?? ""}
                                    onChange={(e) => onQuantityChange(barcode, "store", e.target.value === "" ? "" : Number(e.target.value))}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    placeholder="창고"
                                    value={warehouseValue ?? ""}
                                    onChange={(e) => onQuantityChange(barcode, "warehouse", e.target.value === "" ? "" : Number(e.target.value))}
                                />
                            </td>
                            <td style={{ fontWeight: "bold" }}>{totalRealQty}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            <button onClick={onRegister}>실사 등록</button>
        </div>
    );
}

export default InventoryRegisterCom;
