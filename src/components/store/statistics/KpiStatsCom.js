import {
    FiDollarSign,
    FiPackage,
    FiShoppingCart,
    FiDownload
} from "react-icons/fi";

export function KpiStatsCom({ data, loading }) {
    if (loading) return <div>로딩 중...</div>;
    if (!data) return <div>데이터 없음</div>;

    const formatNumber = (num) => num?.toLocaleString() || 0;

    return (
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                    <FiDollarSign size={20} />
                    <span>총 매출</span>
                </div>
                <strong>{formatNumber(data.totalSales)}원</strong>
            </div>

            <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                    <FiPackage size={20} />
                    <span>발주 금액</span>
                </div>
                <strong>{formatNumber(data.totalOrders)}원</strong>
            </div>

            <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                    <FiShoppingCart size={20} />
                    <span>오늘 판매 수량</span>
                </div>
                <strong>{formatNumber(data.todaySalesQuantity)}개</strong>
            </div>

            <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                    <FiDownload size={20} />
                    <span>입고 수량</span>
                </div>
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    textAlign: "center",
};

const cardHeaderStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "15px",
    color: "#333",
};

export default KpiStatsCom;