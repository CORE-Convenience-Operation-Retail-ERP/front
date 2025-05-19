const SettlementTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <p style={{ padding: "20px", fontSize: "16px", color: "#555" }}>
      조회된 정산 내역이 없습니다.
    </p>;
  }

  const typeLabelMap = {
    DAILY: "일별",
    SHIFT: "교대",
    MONTHLY: "월별",
    YEARLY: "연별"
  };

  return (
    <table style={{
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
      fontSize: "14px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
    }}>
      <thead>
        <tr style={{ backgroundColor: "#374151", color: "#fff" }}>
          <th style={thStyle}>정산일</th>
          <th style={thStyle}>정산유형</th>
          <th style={thStyle}>총매출</th>
          <th style={thStyle}>할인</th>
          <th style={thStyle}>환불</th>
          <th style={thStyle}>실매출</th>
          <th style={thStyle}>거래건수</th>
          <th style={thStyle}>환불건수</th>
          <th style={thStyle}>전송상태</th>
          <th style={thStyle}>정산방식</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.settlementId} style={{ backgroundColor: "#fff", textAlign: "center" }}>
            <td style={tdStyle}>{item.settlementDate}</td>
            <td style={tdStyle}>{item.settlementType}</td>
            <td style={tdStyleRight}>{item.totalRevenue?.toLocaleString()}원</td>
            <td style={tdStyleRight}>{item.discountTotal?.toLocaleString()}원</td>
            <td style={tdStyleRight}>{item.refundTotal?.toLocaleString()}원</td>
            <td style={tdStyleRight}>{item.finalAmount?.toLocaleString()}원</td>
            <td style={tdStyle}>{item.transactionCount}</td>
            <td style={tdStyle}>{item.refundCount}</td>
            <td style={tdStyle}>
              {item.hqStatus === "SENT" ? (
                <span style={{ color: "#10b981", fontWeight: "bold" }}>전송됨</span>
              ) : item.hqStatus === "FAILED" ? (
                <span style={{ color: "#ef4444", fontWeight: "bold" }}>실패</span>
              ) : (
                <span style={{ color: "#9ca3af" }}>대기중</span>
              )}
            </td>
            <td style={tdStyle}>
              <span style={{
                display: "inline-block",
                padding: "4px 10px",
                borderRadius: "12px",
                backgroundColor: item.isManual === 1 ? "#dbeafe" : "#f3f4f6",
                color: item.isManual === 1 ? "#1d4ed8" : "#6b7280",
                fontWeight: "bold",
                fontSize: "12px"
              }}>
                {item.isManual === 1 ? "수동" : "자동"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// 스타일 정의
const thStyle = {
  padding: "12px",
  border: "1px solid #ccc",
  fontWeight: "bold"
};

const tdStyle = {
  padding: "10px",
  border: "1px solid #e5e7eb"
};

const tdStyleRight = {
  ...tdStyle,
  textAlign: "right"
};

export default SettlementTable;
