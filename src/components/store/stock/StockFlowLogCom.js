import React from "react";
import { Table } from "../../../features/store/styles/common/Table.styled";
import {
  PageWrapper,
  PageSection,
  TableWrapper
} from "../../../features/store/styles/common/PageLayout";
import Pagination from "../../../components/store/common/Pagination";

function StockFlowLogCom({ logs, pageInfo, onPageChange }) {
  const formatDate = (dateTimeStr) => dateTimeStr?.split("T")[0] || "-";

  const formatQuantity = (qty, before, after, flowType) => {
    // 감소 유형: 출고(1), 판매(2), 폐기(3), 반품(5), 이동출고(6)
    let diff = after - before;
    if ([1, 2, 3, 5, 6].includes(flowType)) {
      diff = before - after;
    }
    const sign = diff > 0 ? "+" : "";
    return `${sign}${diff} (${before} → ${after})`;
  };

  return (
      <PageWrapper>
        <PageSection>
          <TableWrapper>
            <Table>
              <thead>
              <tr>
                <th>날짜</th>
                <th>상품명</th>
                <th>유형</th>
                <th>위치</th>
                <th>수량</th>
                <th>담당자</th>
                <th>비고</th>
              </tr>
              </thead>
              <tbody>
              {logs.length > 0 ? (
                  logs.map((log) => (
                      <tr key={log.flowId}>
                        <td>{formatDate(log.flowDate)}</td>
                        <td>{log.productName}</td>
                        <td>{log.flowTypeLabel}</td>
                        <td>{log.location}</td>
                        <td>{formatQuantity(log.quantity, log.beforeQuantity, log.afterQuantity, log.flowType)}</td>
                        <td>{log.processedBy}</td>
                        <td>{log.note}</td>
                      </tr>
                  ))
              ) : (
                  <tr>
                    <td colSpan="7" style={{ padding: 20, textAlign: "center" }}>
                      로그가 없습니다.
                    </td>
                  </tr>
              )}
              </tbody>
            </Table>
          </TableWrapper>

          <Pagination
              currentPage={pageInfo.currentPage}
              totalPages={pageInfo.totalPages}
              onPageChange={onPageChange}
          />
        </PageSection>
      </PageWrapper>
  );
}

export default StockFlowLogCom;