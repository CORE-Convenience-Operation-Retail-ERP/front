import React from "react";

const BranchesStatisticsCom = ({ filters, setFilters, onSearch, data }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      {/* 필터 영역 */}
      <div style={{ marginBottom: "20px" }}>
        <input
          name="storeId"
          value={filters.storeId}
          onChange={handleChange}
          placeholder="매장 ID"
          style={{ marginRight: "10px" }}
        />
        <select name="type" value={filters.type} onChange={handleChange} style={{ marginRight: "10px" }}>
          <option value="ALL">전체</option>
          <option value="DAILY">일별</option>
          <option value="SHIFT">교대</option>
          <option value="MONTHLY">월별</option>
          <option value="YEARLY">연별</option>
        </select>
        <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
        <span style={{ margin: "0 5px" }}>~</span>
        <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} />
        <button onClick={onSearch} style={{ marginLeft: "10px" }}>조회</button>
      </div>

      {/* 테이블 영역 */}
      {(!data || data.length === 0) ? (
        <p>📭 조회된 정산 데이터가 없습니다.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "16px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>매장</th>
              <th>유형</th>
              <th>정산일</th>
              <th>총매출</th>
              <th>할인</th>
              <th>환불</th>
              <th>최종금액</th>
              <th>전송상태</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.settlementId}>
                <td>{item.settlementId}</td>
                <td>{item.storeId}</td>
                <td>{item.settlementType}</td>
                <td>{item.settlementDate}</td>
                <td>{item.totalRevenue.toLocaleString()}원</td>
                <td>{item.discountTotal.toLocaleString()}원</td>
                <td>{item.refundTotal.toLocaleString()}원</td>
                <td>{item.finalAmount.toLocaleString()}원</td>
                <td>{item.hqStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BranchesStatisticsCom;
