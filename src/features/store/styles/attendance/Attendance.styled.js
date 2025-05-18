// src/features/store/styles/attendance/AttendanceCom.styled.js
import styled from "styled-components";

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

export const Thead = styled.thead`
  background-color: #f0f0f0;
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  border-bottom: 1px solid #ddd;
`;

export const Th = styled.th`
  padding: 10px;
  text-align: left;
`;

export const Td = styled.td`
  padding: 10px;
`;

export const SelectWrap = styled.div`
  margin-bottom: 1rem;
`;

export const StoreSelect = styled.select`
  padding: 0.5rem;
  border-radius: 6px;
`;

export const StatusTag = styled.span`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  background-color: ${({ status }) =>
    status === 0 ? "#28a745" : status === 1 ? "#ffc107" : "#6c757d"};
`;