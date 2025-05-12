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
                    <select
                        value={partTimerId}
                        onChange={(e) => setPartTimerId(e.target.value)}
                        style={{ marginLeft: "1rem", width: "200px" }}
                    >
                        <option value="">담당자 선택</option>
                        {partTimers.length ? (
                            partTimers.map(pt => (
                                <option key={pt.partTimerId} value={pt.partTimerId}>
                                    {pt.partName} (ID: {pt.partTimerId})
                                </option>
                            ))
                        ) : (
                            <option disabled>담당자 없음</option>
                        )}
                    </select>
                </label>
                <label style={{ marginLeft: "2rem" }}>
                    사유:
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        style={{ marginLeft: "1rem", width: "300px" }}
                    />
                </label>
            </div>

            <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", marginTop: "1rem" }}>
                <thead>
                <tr>
                    <th>상품 ID</th>
                    <th>상품명</th>
                    <th>바코드</th>
                    <th>현재 재고</th>
                    <th>실사 수량</th>
                </tr>
                </thead>
                <tbody>
                {products.length === 0 ? (
                    <tr>
                        <td colSpan="5" style={{ textAlign: "center" }}>
                            조회된 상품이 없습니다.
                        </td>
                    </tr>
                ) : (
                    products.map(product => (
                        <tr key={product.productId}>
                            <td>{product.productId}</td>
                            <td>{product.productName}</td>
                            <td>{product.barcode || "-"}</td>
                            <td>{product.stockQty}</td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    value={realQuantities[product.barcode] || ""}
                                    onChange={(e) =>
                                        onQuantityChange(product.barcode, e.target.value)
                                    }
                                    style={{ width: "80px", textAlign: "right" }}
                                />
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

            <div style={{ textAlign: "right", marginTop: "1rem" }}>
                <button
                    onClick={onRegister}
                    style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}
                >
                    실사 등록
                </button>
            </div>
        </div>
    );
}

export default InventoryRegisterCom;
