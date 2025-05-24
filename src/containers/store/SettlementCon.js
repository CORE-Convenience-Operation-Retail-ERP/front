import React, { useEffect, useState } from "react";
import { fetchSettlementList } from "../../service/store/settlementService";
import CustomCalendar from "../../components/store/common/CustomCalendar";
import { formatLocalDate } from "../../utils/calendarUtils";
import SettlementTable from "../../components/store/settlement/SettlementTable";
import Pagination from "../../components/store/common/Pagination";
import { ViewToggleButton, PrimaryButton } from "../../features/store/styles/common/Button.styled";
import LoadingLottie from '../../components/common/LoadingLottie.tsx';
import { PageTitle, PageWrapper } from "../../features/store/styles/common/PageLayout.js";

const TYPES = [
  { value: "ALL", label: "전체" },
  { value: "DAILY", label: "일별" },
  { value: "SHIFT", label: "교대" },
  { value: "MONTHLY", label: "월별" },
  { value: "YEARLY", label: "연별" },
];

const ITEMS_PER_PAGE = 10;

const SettlementCon = () => {
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState([null, null]);
  const [allSettlements, setAllSettlements] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // 페이로드 조합 함수
  const buildPayload = () => {
    const storeId = Number(localStorage.getItem("storeId"));
    const payload = { storeId };

    if (typeFilter !== "ALL") {
      payload.type = typeFilter;
      let [start, end] = dateRange;

      if (typeFilter === "MONTHLY") {
        const [year, month] = start.split("-");
        start = `${year}-${month}-01`;
        const lastDay = new Date(+year, +month, 0).getDate();
        end = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;
      } else if (typeFilter === "YEARLY") {
        const year = start.split("-")[0];
        start = `${year}-01-01`;
        end = `${year}-12-31`;
      }
      payload.startDate = start;
      payload.endDate = end;
    }
    return payload;
  };

  // 조회 실행 핸들러
  const handleSearch = async () => {
    if (typeFilter !== "ALL" && (!dateRange[0] || !dateRange[1])) {
      alert("기간을 선택해주세요.");
      return;
    }
    const payload = buildPayload();
    try {
      setLoading(true);
      const result = await fetchSettlementList(payload);
      // 날짜 오름차순 정렬
      result.sort(
        (a, b) => new Date(a.settlementDate) - new Date(b.settlementDate)
      );
      setAllSettlements(result);
      setCurrentPage(1);
    } catch (error) {
      console.error("정산 이력 조회 실패:", error);
      alert("정산 데이터를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 마운트 시 최초 조회
  useEffect(() => {
    handleSearch();
  }, []);

  // 페이징 계산
  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentData = allSettlements.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(allSettlements.length / ITEMS_PER_PAGE);

  if (loading) return <LoadingLottie />;

  return (
    <PageWrapper>
      <PageTitle>| 정산 이력 조회</PageTitle>
      {/* 필터 바: 정산유형 + 날짜 범위 */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {TYPES.map((t) => (
          <ViewToggleButton
            key={t.value}
            selected={typeFilter === t.value}
            onClick={() => setTypeFilter(t.value)}
          >
            {t.label}
          </ViewToggleButton>
        ))}

        {typeFilter !== "ALL" && (
          <>
            <CustomCalendar
              selected={dateRange[0] ? new Date(dateRange[0]) : null}
              onChange={(date) =>
                setDateRange([formatLocalDate(date), dateRange[1]])
              }
              placeholder="시작일"
            />
            <span>~</span>
            <CustomCalendar
              selected={dateRange[1] ? new Date(dateRange[1]) : null}
              onChange={(date) =>
                setDateRange([dateRange[0], formatLocalDate(date)])
              }
              placeholder="종료일"
            />
          </>
        )}

        <PrimaryButton onClick={handleSearch}>검색</PrimaryButton>
      </div>

      <SettlementTable data={currentData} />
      <Pagination
        currentPage={currentPage - 1}
        totalPages={totalPages}
        onPageChange={(p) => setCurrentPage(p + 1)}
      />
    </PageWrapper>
  );
};

export default SettlementCon;