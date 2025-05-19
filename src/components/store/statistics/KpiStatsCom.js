export function KpiStatsCom({ data, loading }) {
    if (loading) return <div>로딩 중...</div>;
    if (!data) return <div>데이터 없음</div>;

    const formatNumber = (num) => num?.toLocaleString() || 0;

    return (
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <div style={cardStyle}>
                <div>💰 총 매출</div>
                <strong>{formatNumber(data.totalSales)}원</strong>
            </div>
            <div style={cardStyle}>
                <div>📦 발주 금액</div>
                <strong>{formatNumber(data.totalOrders)}원</strong>
            </div>
            <div style={cardStyle}>
                <div>📦 오늘 판매 수량</div>
                <strong>{formatNumber(data.todaySalesQuantity)}개</strong>
            </div>
            <div style={cardStyle}>
                <div>📥 입고 수량</div>
                <strong>{formatNumber(data.stockInCount)}개</strong>
            </div>
        </div>
    );
}

const cardStyle = {
    flex: 1,
    padding: "1rem",
    backgroundColor: "#f7f7f7",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
};

export default KpiStatsCom;