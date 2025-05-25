import React from "react";
import { Table } from "../../../features/store/styles/common/Table.styled";
import { TableWrapper } from "../../../features/store/styles/common/PageLayout";
import { IconOnlyButton } from "../../../features/store/styles/common/Button.styled";
import { FiSearch } from "react-icons/fi";

const TransactionTable = ({ rows = [], onDetailClick }) => {
  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <th>결제일시</th>
            <th>결제수단</th>
            <th>총 결제액</th>
            <th>할인 합계</th>
            <th>환불여부</th>
            <th>결제건수</th>
            <th>상세보기</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.transactionId}>
              <td>{new Date(row.paidAt).toLocaleString()}</td>
              <td>
                <span
                  style={{
                    display: "inline-block",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    backgroundColor:
                      row.paymentMethod?.toUpperCase() === "CARD"
                        ? "#e9ecef"
                        : row.paymentMethod?.toUpperCase() === "CASH"
                        ? "#adb5bd"
                        : "#ced4da",
                    color: "#495057",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  {row.paymentMethod?.toUpperCase()}
                </span>
              </td>
              <td style={{ fontWeight: "bold" }}>
                {row.finalAmount?.toLocaleString()}원
              </td>
              <td>{row.discountTotal?.toLocaleString()}원</td>
              <td>
                <span
                  style={{
                    display: "inline-block",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    backgroundColor:
                      row.transactionStatus === 1 ? "#fee2e2" : "#dbeafe",
                    color:
                      row.transactionStatus === 1 ? "#ef4444" : "#1d4ed8",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  {row.transactionStatus === 1 ? "환불" : "정상"}
                </span>
              </td>
              <td>{row.items?.length || 0}건</td>
              <td>
                <IconOnlyButton onClick={() => onDetailClick(row)}>
                  <FiSearch size={18} />
                </IconOnlyButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
};

export default TransactionTable;
