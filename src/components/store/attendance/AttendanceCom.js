import React from "react";
import { format, isValid } from "date-fns";
import StoreSearchBar from "../common/StoreSearchBar";
import { Table } from "../../../features/store/styles/common/Table.styled";
import styled from "styled-components";

const StatusTag = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  color: white;
  background-color: ${({ status }) =>
      status === 0 ? "#10b981" : status === 1 ? "#f59e0b" : "#9ca3af"};
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  font-weight: bold;
`;

function AttendanceCom({
                         data = [],
                         onSearch,
                         storeList = [],
                         onStoreChange,
                       }) {
  const filterOptions = [
    ...(onStoreChange
        ? [
          {
            key: "storeId",
            label: "매장",
            type: "select",
            options: storeList.map((s) => ({
              value: s.storeId,
              label: s.storeName,
            })),
          },
        ]
        : []),
    { key: "partName", label: "이름", type: "text" },
    {
      key: "position",
      label: "직급",
      type: "select",
      options: [
        { value: "매니저", label: "매니저" },
        { value: "아르바이트", label: "아르바이트" },
        { value: "점장", label: "점장" },
      ],
    },
    { key: "startDate", label: "기간", type: "date-range" },
  ];

  const formatOrDash = (value, fmt) => {
    const date = new Date(value);
    return value && isValid(date) ? format(date, fmt) : "—";
  };

  return (
      <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginRight: "1rem", marginBottom: "0.5rem" }}>
              <StoreSearchBar filterOptions={filterOptions} onSearch={onSearch} />
          </div>
        <Table>
          <thead>
          <tr>
            <th>이름</th>
            <th>직급</th>
            <th>근무일</th>
            <th>출근</th>
            <th>퇴근</th>
            <th>상태</th>
          </tr>
          </thead>
          <tbody>
          {data.map((row) => (
              <tr key={row.attendId}>
                <td>{row.partName || "—"}</td>
                <td>{row.position || "—"}</td>
                <td>{formatOrDash(row.workDate, "yyyy-MM-dd")}</td>
                <td>{formatOrDash(row.inTime, "HH:mm")}</td>
                <td>{formatOrDash(row.outTime, "HH:mm")}</td>
                <td>
                  <StatusTag status={row.attendStatus}>
                    {row.attendStatus === 0
                        ? "정상"
                        : row.attendStatus === 1
                            ? "지각"
                            : "미정"}
                  </StatusTag>
                </td>
              </tr>
          ))}
          </tbody>
        </Table>
      </>
  );
}

export default AttendanceCom;
