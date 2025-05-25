import { useState } from "react";
import StoreSearchBar from "../../../components/store/common/StoreSearchBar";
import HourlySalesChartCon from "../../../containers/store/statistics/HourlySalesChartCon";
import { useLocation } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";
import { PageTitle, PageWrapper } from "../../../features/store/styles/common/PageLayout";

function HourlySalesDetailPage() {
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
    <PageWrapper>
      <PageTitle>| 시간대별 매출</PageTitle>

      <p style={{
        fontSize: "15px",
        color: "#6b7280",
        marginBottom: "24px"
      }}>
        날짜 또는 기간을 선택하면 해당 시간대의 매출 통계를 확인할 수 있습니다.
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
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "28px",
          background: "#ffffff",
          boxShadow: "0 3px 10px rgba(0,0,0,0.03)"
        }}>
          <HourlySalesChartCon filters={filters} mode="detail" height={300} />
        </div>
      )}
    </PageWrapper>
  );
}

export default HourlySalesDetailPage;
