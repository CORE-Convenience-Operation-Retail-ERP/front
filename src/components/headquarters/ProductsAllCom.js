import React from "react";
import HQStockManagement from './HQStockManagement';

const statusLabel = (status) => {
  switch (status) {
    case "판매중":
      return <span style={{ color: "#1976d2" }}>판매중</span>;
    case "단종":
      return <span style={{ color: "gray" }}>단종</span>;
    case "1+1 이벤트":
      return <span style={{ color: "#43a047" }}>1+1</span>;
    case "2+1 이벤트":
      return <span style={{ color: "#fbc02d" }}>2+1</span>;
    default:
      return <span>{status}</span>;
  }
};

const ProductsAllCom = ({ 
  products = [], 
  onRegister, 
  onEdit, 
  onDetail,
  currentPage = 0,
  totalPages = 0,
  totalItems = 0,
  onPageChange,
  onUpdateHQStock,  // 추가: 본사 재고 수정 핸들러
  isRecalculating = false // 추가: 재계산 상태
}) => {
  // products가 배열인지 확인하고, 아니면 빈 배열로 설정
  const productList = Array.isArray(products) ? products : [];

  return (
    <div style={{ padding: "32px" }}>
      <h2 style={{ color: "#3a5ca8", fontWeight: "bold" }}>
        전체 제품 관리
        {isRecalculating && (
          <span style={{ 
            fontSize: '0.8rem', 
            color: '#666', 
            marginLeft: '10px',
            fontWeight: 'normal' 
          }}>
            (본사 재고 계산 중...)
          </span>
        )}
      </h2>
      
      {/* 본사 재고 관리 컴포넌트 추가 */}
      <HQStockManagement />
      
      <button
        style={{
          float: "right",
          marginBottom: "16px",
          background: "#3a5ca8",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "8px 16px",
          cursor: "pointer",
        }}
        onClick={onRegister}
      >
        상품 등록
      </button>

      {productList.length === 0 ? (
        <div style={{ textAlign: 'center', margin: '50px 0', color: '#666' }}>
          제품 데이터가 없거나 로딩 중입니다.
        </div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "16px",
          }}
        >
          <thead>
            <tr style={{ background: "#f5f7fa" }}>
              <th>No.</th>
              <th>제품 명</th>
              <th>매장재고</th>
              <th>본사재고</th>  {/* 추가된 열 */}
              <th>바코드</th>
              <th>카테고리</th>
              <th>최근입고일</th>
              <th>공급가</th>
              <th>판매가</th>
              <th>제품 수정</th>
            </tr>
          </thead>
          <tbody>
            {productList.map((p, idx) => (
              <tr
                key={p.productId}
                style={{
                  textAlign: "center",
                  background: idx % 2 === 0 ? "#fff" : "#f5f7fa",
                }}
              >
                <td>{idx + 1 + (currentPage * 10)}</td>
                <td>{p.proName}</td>
                <td style={{ color: p.proStock < 20 ? "red" : "black" }}>
                  {p.proStock}
                </td>
                {/* 본사 재고 열 추가 */}
                <td style={{ color: p.hqStock < 100 ? "orange" : "black" }}>
                  {p.hqStock}
                  <button 
                    onClick={() => onUpdateHQStock(p.productId, p.hqStock)}
                    style={{ 
                      marginLeft: '5px', 
                      fontSize: '12px', 
                      padding: '2px 5px',
                      background: '#5bc0de',
                      color: 'white',
                      border: 'none',
                      borderRadius: '2px'
                    }}
                  >
                    수정
                  </button>
                </td>
                <td>{p.proBarcode}</td>
                <td>{p.categoryName}</td>
                <td>
                  {p.recentStockInDate
                    ? p.recentStockInDate.substring(0, 10)
                    : ""}
                </td>
                <td>{p.proCost?.toLocaleString()}</td>
                <td>{p.proSellCost?.toLocaleString()}</td>
                <td>
                  {statusLabel(p.status)}
                  <button
                    style={{ marginRight: 4, marginLeft: 4 }}
                    onClick={() => onEdit(p.productId)}
                  >
                    수정
                  </button>
                  <button onClick={() => onDetail(p.productId)}>
                    상세 정보
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {/* 페이징 UI */}
      {totalPages > 0 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginTop: '20px',
          gap: '10px'
        }}>
          <button
            onClick={() => onPageChange(0)}
            disabled={currentPage === 0}
            style={{
              padding: '5px 10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: currentPage === 0 ? '#f5f5f5' : '#fff',
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            처음
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            style={{
              padding: '5px 10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: currentPage === 0 ? '#f5f5f5' : '#fff',
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            이전
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i)
            .filter(page => {
              if (totalPages <= 5) return true;
              if (currentPage <= 2) return page <= 4;
              if (currentPage >= totalPages - 3) return page >= totalPages - 5;
              return page >= currentPage - 2 && page <= currentPage + 2;
            })
            .map(page => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                style={{
                  padding: '5px 10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  background: currentPage === page ? '#3a5ca8' : '#fff',
                  color: currentPage === page ? '#fff' : '#000',
                  cursor: 'pointer'
                }}
              >
                {page + 1}
              </button>
            ))}
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            style={{
              padding: '5px 10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: currentPage === totalPages - 1 ? '#f5f5f5' : '#fff',
              cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            다음
          </button>
          <button
            onClick={() => onPageChange(totalPages - 1)}
            disabled={currentPage === totalPages - 1}
            style={{
              padding: '5px 10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: currentPage === totalPages - 1 ? '#f5f5f5' : '#fff',
              cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            마지막
          </button>
        </div>
      )}
      
      {totalItems > 0 && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '10px',
          color: '#666'
        }}>
          총 {totalItems}개의 제품 중 {(currentPage * 10) + 1} - {Math.min((currentPage + 1) * 10, totalItems)}번째 제품을 보고 있습니다.
        </div>
      )}
    </div>
  );
};

export default ProductsAllCom;