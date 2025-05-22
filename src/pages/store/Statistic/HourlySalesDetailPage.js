import { useState } from "react";
import StoreSearchBar from "../../../components/store/common/StoreSearchBar";
import HourlySalesChartCon from "../../../containers/store/statistics/HourlySalesChartCon";
import { useLocation } from "react-router-dom";
import {FiCalendar} from "react-icons/fi";

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
      <div style={{ padding: "30px" }}>
          <h2 style={{ marginBottom: "1rem", fontSize: "20px", fontWeight: "600" }}>
              <span style={{ marginRight: "8px" }}>|</span>
              시간대별 매출 상세 통계
          </h2>

          <p style={{ color: "#666", marginBottom: "20px" }}>
              날짜 또는 기간을 선택하면 해당 시간대의 매출 통계를 확인할 수 있습니다.
          </p>
  
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

          {!filters && (
              <p style={{ marginTop: "20px", color: "#999", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FiCalendar size={16} />
                  날짜를 선택하면 통계가 표시됩니다.
              </p>
          )}
  
        {filters && (
            <HourlySalesChartCon filters={filters} mode="detail" height={300} />
        )}
      </div>
    );
  }
  
  export default HourlySalesDetailPage;