import React, { useEffect, useState } from "react";
import { fetchSettlementList } from "../../service/store/settlementService";
import SettlementFilter from "../../components/store/settlement/SettlementFilter";
import SettlementTable from "../../components/store/settlement/SettlementTable";

const SettlementCon = () => {

    // 기본 날짜 계산(최근 7일)
    const today = new Date().toISOString().split("T")[0];
    const sevenDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const [filters, setFilters] = useState({
      startDate: sevenDaysAgo,
      endDate: today,
      type: "ALL"
    });

    const [data, setData] = useState([]);

    // 컴포넌트 마운트 시 자동 조회
    useEffect(() => {
        handleSearch();
    }, []);

    // 필터 변경경
    const handleChange = (e) => {
      const { name, value } = e.target;
    
      setFilters((prev) => ({
        ...prev,
        [name]: value
      }));
    
      // 정산 유형(type) 바뀔 때 결과 초기화
      if (name === "type") {
        setData([]);
      }
    };

    // 정산 데이터 조회회
    const handleSearch = async () => {
        const storeId = localStorage.getItem("storeId");
      
        if (!storeId) {
          alert("로그인 정보에 storeId가 없습니다.");
          return;
        }
      
        let start, end;
        const type = filters.type.toUpperCase();
      
        if (["DAILY", "SHIFT", "ALL"].includes(type)) {
          start = filters.startDate?.split("T")[0];  
          end = filters.endDate?.split("T")[0];
        } else if (filters.type === "MONTHLY") {
          start = `${filters.startDate}-01`;
          const [year, month] = filters.endDate.split("-");
          const lastDay = new Date(year, month, 0).getDate();
          end = `${filters.endDate}-${lastDay}`;
        } else if (filters.type === "YEARLY") {
          start = `${filters.startDate}-01-01`;
          end = `${filters.endDate}-12-31`;
        }
      
        try {
          const payload =
            type === "ALL"
              ? { storeId: Number(storeId) } // ✅ 전체 조회 시 날짜, type 모두 생략
              : {
                  storeId: Number(storeId),
                  startDate: start,
                  endDate: end,
                  type: type
                };

          console.log("📦 [프론트 payload 확인]", payload);
          
          const result = await fetchSettlementList(payload);
          console.log("정산 응답:", result);
          setData(result);
        } catch (error) {
          console.error("정산 이력 조회 실패:", error);
          alert("정산 데이터를 불러오는 데 실패했습니다.");
        }
      };

  return (
    <div>
      <SettlementFilter filters={filters} onChange={handleChange} onSearch={handleSearch}/>
      <SettlementTable data={data} />
    </div>
  );
};

export default SettlementCon;
