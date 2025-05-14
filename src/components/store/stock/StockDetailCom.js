import StockHistorySummaryCom from "./StockHistorySummaryCom";

function StockDetailCom({ productDetail, historyList }) {
    if (!productDetail) return <div>로딩 중...</div>;

    const {
        productName,
        barcode,
        promoStatus,
        storeQuantity,
        warehouseQuantity,
        realStoreQuantity,
        realWarehouseQuantity,
        locationCode
    } = productDetail;

    const totalQuantity = storeQuantity + warehouseQuantity;
    const totalRealQuantity = realStoreQuantity + realWarehouseQuantity;
    const totalDiff = totalRealQuantity - totalQuantity;

    const renderStockRow = (label, quantity, real, unit = '개') => {
        const diff = real - quantity;
        const diffStyle = diff > 0 ? { color: 'green' } : diff < 0 ? { color: 'red' } : {};
        return (
            <tr>
                <td>{label}</td>
                <td>{quantity} {unit}</td>
                <td>{real} {unit}</td>
                <td style={diffStyle}>{diff >= 0 ? `+${diff}` : diff} {unit}</td>
            </tr>
        );
    };

    return (
        <div>
            <h2>📦 상품 상세 정보</h2>
            <p><strong>상품명:</strong> {productName}</p>
            <p><strong>바코드:</strong> {barcode}</p>
            <p><strong>프로모션:</strong> {promoStatus}</p>

            <h3>📍 위치 정보</h3>
            <p>매장 위치 코드: <strong>{locationCode || '미지정'}</strong></p>

            <h3>📊 재고 비교</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th>구분</th>
                    <th>기존 수량</th>
                    <th>실사 수량</th>
                    <th>오차</th>
                </tr>
                </thead>
                <tbody>
                {renderStockRow("매장", storeQuantity, realStoreQuantity)}
                {renderStockRow("창고", warehouseQuantity, realWarehouseQuantity)}
                {renderStockRow("총합", totalQuantity, totalRealQuantity)}
                </tbody>
            </table>

            <StockHistorySummaryCom historyList={historyList} />
        </div>
    );
}

export default StockDetailCom;
