import { useState } from "react";
import StoreSearchBar from "../../../components/store/common/StoreSearchBar";
import OrderTopProductsCon from "../../../containers/store/statistics/OrderTopProductsCon";
import { FiCalendar } from "react-icons/fi";

function OrderTopProductsDetailPage() {
  const [filters, setFilters] = useState(null);

  const handleSearch = (newFilter) => {
    const storeId = localStorage.getItem("storeId");
    if (!storeId) {
      alert("storeId가 없습니다.");
      return;
    }

    if (newFilter.date) {
      setFilters({
        storeId: parseInt(storeId),
        startDate: newFilter.date,
        endDate: newFilter.date,
      });
    } else if (newFilter.startDate && newFilter.endDate) {
      setFilters({
        storeId: parseInt(storeId),
        startDate: newFilter.startDate,
        endDate: newFilter.endDate,
      });
    }
  };

  return (
    <div style={{ padding: "40px 60px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* 타이틀 */}
      <h2 style={{
        fontSize: "22px",
        fontWeight: 700,
        color: "#1f2937",
        marginBottom: "8px",
        display: "flex",
        alignItems: "center",
      }}>
        <span style={{
          display: "inline-block",
          width: "6px",
          height: "18px",
          background: "#111827",
          marginRight: "10px",
          borderRadius: "2px"
        }}></span>
        발주 상품 통계
      </h2>

      <p style={{
        fontSize: "15px",
        color: "#6b7280",
        marginBottom: "24px"
      }}>
        기간을 선택하면 발주량 기준으로 인기 상품 순위를 확인할 수 있습니다.
      </p>

      {/* 검색 박스 */}
      <div style={{
        padding: "20px 24px",
        borderRadius: "12px",
        marginBottom: "36px"
      }}>
        <StoreSearchBar
          filterOptions={[
            { key: "date", label: "날짜(단일)", type: "date" },
            { key: "dateRange", label: "기간(범위)", type: "date-range" },
          ]}
          onSearch={handleSearch}
        />
      </div>

      {/* 안내 메시지 */}
      {!filters && (
        <div style={{
          textAlign: "center",
          color: "#9ca3af",
          fontSize: "16px",
          marginTop: "80px"
        }}>
          <FiCalendar size={38} style={{ marginBottom: "14px" }} />
          <p><b>날짜를 선택하면</b><br />통계가 표시됩니다.</p>
        </div>
      )}

      {/* 통계 결과 */}
      {filters && (
        <div style={{
          display: "flex",
          justifyContent: "center", // 가운데 정렬
          marginTop: "24px"
        }}>
          <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "28px",
            background: "#ffffff",
            boxShadow: "0 3px 10px rgba(0,0,0,0.03)",
            width: "100%",
            maxWidth: "1000px"
          }}>
            <OrderTopProductsCon
              filters={filters}
              mode="detail"
              showTable={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderTopProductsDetailPage;
