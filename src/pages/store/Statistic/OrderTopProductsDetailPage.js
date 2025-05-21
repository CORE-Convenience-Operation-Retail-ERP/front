import { useState } from "react";
import StoreSearchBar from "../../../components/store/common/StoreSearchBar";
import OrderTopProductsCon from "../../../containers/store/statistics/OrderTopProductsCon";

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
      <div style={{ padding: "30px" }}>
        <h2>📦 발주 상품 통계</h2>
        <p style={{ marginBottom: "20px", color: "#666" }}>
          기간을 선택하면 발주량 기준으로 인기 상품 순위를 확인할 수 있습니다.
        </p>
  
        <StoreSearchBar
          filterOptions={[
            { key: "date", label: "날짜(단일)", type: "date" },
            { key: "dateRange", label: "기간(범위)", type: "date-range" },
          ]}
          onSearch={handleSearch}
        />
  
        {!filters && (
          <p style={{ marginTop: "20px", color: "#999" }}>
            📅 날짜를 선택하면 통계가 표시됩니다.
          </p>
        )}
  
        {filters && (
          <OrderTopProductsCon
            filters={filters}
            mode="detail"
            showTable={true}
          />
        )}
      </div>
    );
  }
  
export default OrderTopProductsDetailPage;
  