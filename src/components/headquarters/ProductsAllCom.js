import React from "react";

const ProductsAllCom = ({ products, onRegister, onEdit, onDetail }) => {
  return (
    <div style={{ padding: "32px" }}>
      <h2 style={{ color: "#3a5ca8", fontWeight: "bold" }}>전체 제품 관리</h2>
      <button
        style={{
          float: "right",
          marginBottom: "16px",
          background: "#3a5ca8",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "8px 16px",
          cursor: "pointer"
        }}
        onClick={onRegister}
      >
        상품 등록
      </button>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }}>
        <thead>
          <tr style={{ background: "#f5f7fa" }}>
            <th>No.</th>
            <th>제품 명</th>
            <th>재고</th>
            <th>바코드</th>
            <th>카테고리</th>
            <th>입고 일자</th>
            <th>공급가</th>
            <th>제품 수정</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, idx) => (
            <tr key={p.productId} style={{ textAlign: "center", background: idx % 2 === 0 ? "#fff" : "#f5f7fa" }}>
              <td>{idx + 1}</td>
              <td>{p.proName}</td>
              <td style={{ color: p.proStock < 20 ? "red" : "black" }}>{p.proStock}</td>
              <td>{p.proBarcode}</td>
              <td>{p.categoryId}</td>
              <td>{p.proCreatedAt ? p.proCreatedAt.substring(0, 10) : ""}</td>
              <td>{p.proCost?.toLocaleString()}</td>
              <td>
                <button style={{ marginRight: 4 }}>{p.status}</button>
                <button style={{ marginRight: 4 }} onClick={() => onEdit(p.productId)}>수정</button>
                <button onClick={() => onDetail(p.productId)}>상세 정보</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsAllCom;