import React from "react";
import { Link } from "react-router-dom";

function ProductSalesTableCom({ data, loading }) {
  if (loading) return <div>로딩 중...</div>;
  if (!data || data.length === 0)
    return <p style={{ textAlign: "center", marginTop: "1rem" }}>데이터 없음</p>;

  // 매출 기준 내림차순 정렬
  const sorted = [...data].sort((a, b) => b.totalAmount - a.totalAmount);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>상품별 매출 상세 테이블</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f8f8f8" }}>
            <th style={thStyle}>순위</th>
            <th style={thStyle}>상품명</th>
            <th style={thStyle}>판매 수량</th>
            <th style={thStyle}>총 매출액</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((item, index) => (
            <tr key={item.productId || index}>
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>{item.productName}</td>
              <td style={tdStyle}>{item.quantity.toLocaleString()}개</td>
              <td style={tdStyle}>{item.totalAmount.toLocaleString()}원</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: "10px",
  borderBottom: "2px solid #ccc",
  textAlign: "left"
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
  textAlign: "left"
};

export default ProductSalesTableCom;
