function InventoryHistoryCom({ historyList, onRegisterClick }) {
    return (
        <div>
            <h2>실사 이력 조회</h2>

            {/* ✅ 실사 등록 버튼 */}
            <div style={{ textAlign: "right", marginBottom: "1rem" }}>
                <button
                    onClick={onRegisterClick}
                    style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}
                >
                    실사 등록
                </button>
            </div>

            {/* ✅ 실사 이력 테이블 */}
            <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%" }}>
                <thead>
                <tr>
                    <th>실사 일시</th>
                    <th>담당자</th>
                    <th>상품명</th>
                    <th>바코드</th>
                    <th>이전 수량</th>
                    <th>실사 수량</th>
                    <th>오차</th>
                    <th>사유</th>
                </tr>
                </thead>
                <tbody>
                {historyList.length === 0 ? (
                    <tr>
                        <td colSpan="8" style={{ textAlign: "center" }}>
                            조회된 실사 이력이 없습니다.
                        </td>
                    </tr>
                ) : (
                    historyList.map(item => (
                        <tr key={item.checkId}>
                            <td>{item.checkDate}</td>
                            <td>{item.partTimerName || "-"}</td>
                            <td>{item.productName}</td>
                            <td>{item.barcode || "-"}</td>
                            <td>{item.prevQuantity}</td>
                            <td>{item.realQuantity}</td>
                            <td style={{ color: item.realQuantity - item.prevQuantity !== 0 ? 'red' : 'black' }}>
                                {item.realQuantity - item.prevQuantity}
                            </td>
                            <td>{item.checkReason || "-"}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

export default InventoryHistoryCom;
