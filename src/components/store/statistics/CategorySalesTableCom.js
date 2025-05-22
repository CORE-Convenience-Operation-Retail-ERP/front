function CategorySalesTableCom({ data }) {
    if (!data || data.length === 0) {
      return <p style={{ marginTop: "1rem" }}>데이터 없음</p>;
    }
  
    // 총 매출 계산
    const totalSales = data.reduce((sum, item) => sum + item.totalSales, 0);
    const totalQuantity = data.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalTransactions = data.reduce((sum, item) => sum + (item.transactionCount || 0), 0);
  
    return (
      <div style={{ marginTop: "2rem" }}>
        <h4>| 카테고리별 매출 상세</h4>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
                <th style={thStyle}>카테고리명</th>
                <th style={thStyle}>매출액</th>
                <th style={thStyle}>판매 수량</th>
                <th style={thStyle}>거래 건수</th>
            </tr>
          </thead>
          <tbody>
            {data.map(({ category, totalSales: amount, quantity, transactionCount }) => {
              const ratio = totalSales > 0 ? (amount / totalSales) * 100 : 0;
              return (
                <tr key={category}>
                    <td style={tdStyle}>{category}</td>
                    <td style={tdStyle}>{amount.toLocaleString()}원</td>
                    <td style={tdStyle}>{quantity.toLocaleString()}개</td>
                    <td style={tdStyle}>{transactionCount.toLocaleString()}건</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ fontWeight: "bold", backgroundColor: "#f4f4f4" }}>
                <td style={tdStyle}>총합</td>
                <td style={tdStyle}>{totalSales.toLocaleString()}원</td>
                <td style={tdStyle}>{totalQuantity.toLocaleString()}개</td>
                <td style={tdStyle}>{totalTransactions.toLocaleString()}건</td>
            </tr>
          </tfoot>
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
  
  export default CategorySalesTableCom;
  