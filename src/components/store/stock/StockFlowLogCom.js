import React from "react";
import styled from "styled-components";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const Th = styled.th`
  background-color: #f2f2f2;
  padding: 10px;
  border: 1px solid #ddd;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
`;

function StockFlowLogCom({ logs }) {
  const formatDate = (dateTimeStr) => {
    return dateTimeStr?.split("T")[0] || "-";
  };

  const formatQuantity = (qty, before, after) => {
    const sign = qty > 0 ? "+" : "";
    return `${sign}${qty} (${before} → ${after})`;
  };

  return (
    <div>
      <h3>📦 입출고 내역</h3>
      <Table>
        <thead>
          <tr>
            <Th>날짜</Th>
            <Th>상품명</Th>
            <Th>유형</Th>
            <Th>위치</Th>
            <Th>수량</Th>
            <Th>담당자</Th>
            <Th>비고</Th>
          </tr>
        </thead>
        <tbody>
          {logs.length > 0 ? (
            logs.map((log) => (
              <tr key={log.flowId}>
                <Td>{formatDate(log.flowDate)}</Td>
                <Td>{log.productName}</Td>
                <Td>{log.flowTypeLabel}</Td>
                <Td>{log.location}</Td>
                <Td>{formatQuantity(log.quantity, log.beforeQuantity, log.afterQuantity)}</Td>
                <Td>{log.processedBy}</Td>
                <Td>{log.note}</Td>
              </tr>
            ))
          ) : (
            <tr>
              <Td colSpan="6">로그가 없습니다.</Td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default StockFlowLogCom;