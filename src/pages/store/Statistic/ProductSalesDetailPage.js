import { useState } from "react";
import { useLocation } from "react-router-dom";
import StoreSearchBar from "../../../components/store/common/StoreSearchBar";
import ProductSalesChartCon from "../../../containers/store/statistics/ProductSalesChartCon";
import {FiCalendar} from "react-icons/fi";

function ProductSalesDetailPage() {
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
      if (!storeId) return alert("storeId가 없습니다.");
  
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
              <span style={{marginRight: "8px" }}>|</span>
              상품별 매출 순위 상세 통계
          </h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
          기간을 선택하면 해당 기간의 상품별 매출 순위를 확인할 수 있습니다.
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
            <p style={{ color: "#999", marginTop: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
                <FiCalendar size={16} />
                날짜를 선택하면 통계가 표시됩니다.
            </p>
        )}
  
        {filters && (
          <ProductSalesChartCon filters={filters} mode="detail" height={300} />
        )}
      </div>
    );
  }
  
  export default ProductSalesDetailPage;