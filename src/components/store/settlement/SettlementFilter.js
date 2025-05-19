import React from "react";

const SettlementFilter = ({ filters, onChange, onSearch }) => {
  const { type, startDate, endDate } = filters;

  return (
    <div style={{ marginBottom: "20px" }}>
      <label>정산 유형: </label>
      <select name="type" value={type} onChange={onChange}>
        <option value="ALL">전체</option>
        <option value="DAILY">일별 정산</option>
        <option value="SHIFT">교대 정산</option>
        <option value="MONTHLY">월별 정산</option>
        <option value="YEARLY">연별 정산</option>
      </select>

      {/* 일별 정산 */}
      {type === "DAILY" && (
        <>
          <label style={{ marginLeft: "10px" }}>시작일:</label>
          <input
            type="date"
            name="startDate"
            value={startDate}
            onChange={onChange}
          />
          <label style={{ marginLeft: "10px" }}>종료일:</label>
          <input
            type="date"
            name="endDate"
            value={endDate}
            onChange={onChange}
          />
        </>
      )}

      {/* 교대 정산 */}
      {type === "SHIFT" && (
        <>
          <label style={{ marginLeft: "10px" }}>시작시간:</label>
          <input
            type="datetime-local"
            name="startDate"
            value={startDate}
            onChange={onChange}
          />
          <label style={{ marginLeft: "10px" }}>종료시간:</label>
          <input
            type="datetime-local"
            name="endDate"
            value={endDate}
            onChange={onChange}
          />
        </>
      )}

      {/* 월별 정산 */}
      {type === "MONTHLY" && (
        <>
          <label style={{ marginLeft: "10px" }}>시작(YYYY-MM):</label>
          <input
            type="month"
            name="startDate"
            value={startDate}
            onChange={onChange}
          />
          <label style={{ marginLeft: "10px" }}>종료(YYYY-MM):</label>
          <input
            type="month"
            name="endDate"
            value={endDate}
            onChange={onChange}
          />
        </>
      )}

      {/* 연별 정산 */}
      {type === "YEARLY" && (
        <>
          <label style={{ marginLeft: "10px" }}>시작 연도:</label>
          <input
            type="number"
            name="startDate"
            value={startDate}
            onChange={onChange}
            placeholder="예: 2024"
          />
          <label style={{ marginLeft: "10px" }}>종료 연도:</label>
          <input
            type="number"
            name="endDate"
            value={endDate}
            onChange={onChange}
            placeholder="예: 2025"
          />
        </>
      )}

      {/* 검색 버튼 */}
      <button style={{ marginLeft: "10px" }} onClick={onSearch}>
        조회
      </button>
    </div>
  );
};

export default SettlementFilter;
