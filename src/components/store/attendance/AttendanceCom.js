import React from "react";
import { format, isValid } from "date-fns";
import StoreSearchBar from "../common/StoreSearchBar";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  StatusTag,
} from "../../../features/store/styles/attendance/Attendance.styled";

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
            options: storeList.map((s) => ({ value: s.storeId, label: s.storeName })),
          },
        ]
      : []),
    { key: "partName", label: "이름", type: "text" },
    { key: "position", label: "직급", type: "select", options: [
        { value: "매니저", label: "매니저" },
        { value: "아르바이트", label: "아르바이트" },
        { value: "점장", label: "점장" },
      ] },
    { key: "startDate", label: "기간", type: "date-range" },
  ];

  const formatOrDash = (value, fmt) => {
    const date = new Date(value);
    return value && isValid(date) ? format(date, fmt) : "—";
  };

  return (
    <>
      <StoreSearchBar filterOptions={filterOptions} onSearch={onSearch} />
      <Table>
        <Thead>
          <Tr>
            <Th>이름</Th>
            <Th>직급</Th>
            <Th>근무일</Th>
            <Th>출근</Th>
            <Th>퇴근</Th>
            <Th>상태</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row) => (
            <Tr key={row.attendId}>
              <Td>{row.partName || "—"}</Td>
              <Td>{row.position || "—"}</Td>
              <Td>{formatOrDash(row.workDate, "yyyy-MM-dd")}</Td>
              <Td>{formatOrDash(row.inTime, "HH:mm")}</Td>
              <Td>{formatOrDash(row.outTime, "HH:mm")}</Td>
              <Td>
                <StatusTag status={row.attendStatus}>
                  {row.attendStatus === 0 ? "정상" : row.attendStatus === 1 ? "지각" : "미정"}
                </StatusTag>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}

export default AttendanceCom;
