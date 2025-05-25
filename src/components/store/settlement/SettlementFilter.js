import React from "react";

import { formatLocalDate } from "../../../utils/calendarUtils";
import { ViewToggleButton, PrimaryButton } from "../../../features/store/styles/common/Button.styled";
import CustomCalendar from "../common/CustomCalendar";

const TYPES = [
  { value: "ALL", label: "전체" },
  { value: "DAILY", label: "일별" },
  { value: "SHIFT", label: "교대" },
  { value: "MONTHLY", label: "월별" },
  { value: "YEARLY", label: "연별" },
];

const SettlementFilterCom = ({ typeFilter, setTypeFilter, dateRange, setDateRange, onSearch }) => {
  return (
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

      <PrimaryButton onClick={onSearch}>검색</PrimaryButton>
    </div>
  );
};

export default SettlementFilterCom;
