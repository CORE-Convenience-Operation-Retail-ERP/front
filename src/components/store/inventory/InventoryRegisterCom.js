function InventoryRegisterCom({
                                  products = [],
                                  realQuantities = {},
                                  onQuantityChange,
                                  onRegister,
                                  partTimers = [],
                                  partTimerId,
                                  setPartTimerId,
                                  reason,
                                  setReason
                              }) {
    return (
        <div>
            <h2>실사 등록</h2>
            <div style={{ marginBottom: "1rem" }}>
                <label>
                    담당자:
                    <select value={partTimerId} onChange={(e) => setPartTimerId(e.target.value)}>
                        <option value="">담당자 선택</option>
                        {partTimers.map(pt => (
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

            <table>
                <thead>
                <tr><th>상품명</th><th>바코드</th><th>현재 재고</th><th>실사 수량</th></tr>
                </thead>
                <tbody>
                {products.map(product => (
                    <tr key={product.productId}>
                        <td>{product.productName}</td>
                        <td>{product.barcode}</td>
                        <td>{product.totalQuantity}</td>
                        <td>
                            <input type="number" value={realQuantities[product.barcode] || ""}
                                   onChange={(e) => onQuantityChange(product.barcode, e.target.value)} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <button onClick={onRegister}>실사 등록</button>
        </div>
    );
}

export default InventoryRegisterCom;