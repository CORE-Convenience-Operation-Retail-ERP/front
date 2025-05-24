import { useState } from "react";
import { useLocation } from "react-router-dom";
import StoreSearchBar from "../../../components/store/common/StoreSearchBar";
import CategorySalesDonutCon from "../../../containers/store/statistics/CategorySalesDonutCon";
import { FiCalendar } from "react-icons/fi";

function CategorySalesDetailPage() {
  const location = useLocation();
  const routeState = location.state;

  const [filters, setFilters] = useState(() => {
    const storeId = localStorage.getItem("storeId");
    if (!storeId || !routeState?.startDate || !routeState?.endDate) return null;

    return {
      storeId: parseInt(storeId),
      startDate: routeState.startDate,
      endDate: routeState.endDate,
    };
  });

  const handleSearch = (newFilter) => {
    const storeId = localStorage.getItem("storeId");
    if (!storeId) {
      alert("storeId가 없습니다. 로그인 또는 매장 선택을 확인해주세요.");
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
        카테고리별 매출 상세 통계
      </h2>
      <p style={{
        fontSize: "15px",
        color: "#6b7280",
        marginBottom: "24px"
      }}>
        날짜 또는 기간을 선택하면 카테고리별 총 매출 데이터를 확인할 수 있습니다.
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
          initialValues={{
            startDate: filters?.startDate,
            endDate: filters?.endDate,
          }}
        />
      </div>

      {/* 비어있을 때 안내 */}
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

      {/* 통계 표시 영역 */}
      {filters && (
        <div style={{
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "28px",
          background: "#ffffff",
          boxShadow: "0 3px 10px rgba(0,0,0,0.03)"
        }}>
          <CategorySalesDonutCon
            filters={filters}
            mode="detail"
            showTable={true}
          />
        </div>
      )}
    </div>
  );
}

export default CategorySalesDetailPage;
