function OrderTopProductsTableCom({ data = [], metric = "quantity" }) {
    if (!data || data.length === 0) {
      return <p style={{ marginTop: "1rem" }}>데이터 없음</p>;
    }
  
    const visibleData = data.slice(0, 10);
    const isQuantity = metric === "quantity";
  
    return (
      <div style={{ marginTop: "2rem" }}>
        <h4>상위 발주 상품 상세</h4>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>순위</th>
              <th style={thStyle}>상품명</th>
              <th style={thStyle}>발주 수량</th>
              <th style={thStyle}>발주 금액</th>
            </tr>
          </thead>
          <tbody>
            {visibleData.map((item, idx) => (
              <tr key={item.productName}>
                <td style={tdStyle}>{idx + 1}</td>
                <td style={tdStyle}>{item.productName}</td>
                <td style={tdStyle}>{item.orderQuantity.toLocaleString()}건</td>
                <td style={tdStyle}>{item.orderAmount.toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  const thStyle = {
    borderBottom: "2px solid #ccc",
    padding: "10px",
    backgroundColor: "#f8f8f8",
    textAlign: "left"
  };
  
  const tdStyle = {
    borderBottom: "1px solid #eee",
    padding: "10px",
    textAlign: "left"
  };
  
  export default OrderTopProductsTableCom;