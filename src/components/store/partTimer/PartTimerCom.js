import React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import styled from "styled-components";
import { MdLogin, MdLogout } from "react-icons/md";

import { Table } from "../../../features/store/styles/common/Table.styled";
import { AttendanceButton, PrimaryButton } from "../../../features/store/styles/common/Button.styled";
import Pagination from "../common/Pagination";

// 상수 정의
const BANK_LABELS = {
  1: "국민",
  2: "하나",
  3: "신한"
};

const STATUS_LABELS = {
  1: "재직",
  0: "퇴사",
  2: "휴직"
};

// 스타일 컴포넌트
const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 16px;
  height: 16px;
`;

const ClickableTd = styled.td`
  cursor: pointer;
  color: #007bff;
  text-decoration: underline;
`;

function PartTimerCom({
  data,
  loading,
  selectedIds,
  onCheck,
  onCheckAll,
  onOpenQRModal,
  currentPage,
  totalPages,
  onPageChange,
  onUpdateCheckInStatus
}) {
  const navigate = useNavigate();

  if (loading) return <p>불러오는 중...</p>;
  if (!data || data.length === 0) return <p>검색 결과가 없습니다.</p>;


  return (
    <>
      <Table>
        <thead>
          <tr>
            <th><Checkbox onChange={(e) => onCheckAll(e.target.checked)} /></th>
            <th>이름</th>
            <th>직급</th>
            <th>근무형태</th>
            <th>전화번호</th>
            <th>입사일</th>
            <th>시급</th>
            <th>은행</th>
            <th>계좌번호</th>
            <th>상태</th>
            <th>출퇴근</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {data.map((pt) => {
            const {
              partTimerId,
              partName,
              position,
              workType,
              partPhone,
              hireDate,
              hourlyWage,
              accountBank,
              accountNumber,
              partStatus,
              isCheckedInToday
            } = pt;

            console.log("✅ 렌더링 기준:", partTimerId, "출근 여부:", isCheckedInToday);


            const handleClickName = () => navigate(`/store/parttimer/${partTimerId}`);
            const handleClickQR = () => onOpenQRModal(partTimerId, isCheckedInToday ? "check-out" : "check-in");
            const formatPhone = (phone) => {
            if (!phone || typeof phone !== "string") return phone;
            const cleaned = phone.replace(/[^0-9]/g, "");
            if (cleaned.length === 11) {
                return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
            } else if (cleaned.length === 10) {
                return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
            }
            return phone;
            };
            return (
              <tr key={partTimerId}>
                <td>
                  <Checkbox
                    checked={selectedIds.includes(partTimerId)}
                    onChange={() => onCheck(partTimerId)}
                  />
                </td>
                <ClickableTd onClick={handleClickName}>{partName}</ClickableTd>
                <td>{position || "-"}</td>
                <td>{workType || "-"}</td>
                <td>{formatPhone(partPhone) || "-"}</td>
                <td>{hireDate ? format(new Date(hireDate), "yyyy-MM-dd") : "-"}</td>
                <td>{hourlyWage?.toLocaleString() || "-"}원</td>
                <td>{BANK_LABELS[accountBank] || "-"}</td>
                <td>{accountNumber || "-"}</td>
                <td>{STATUS_LABELS[partStatus] || "-"}</td>
                <td>
                  {isCheckedInToday ? (
                    <PrimaryButton onClick={handleClickQR}>
                      <MdLogout size={18} style={{ marginRight: "6px" }} />
                      퇴근
                    </PrimaryButton>
                  ) : (
                    <AttendanceButton onClick={handleClickQR}>
                      <MdLogin size={18} style={{ marginRight: "6px" }} />
                      출근
                    </AttendanceButton>
                  )}
                </td>
                <td>{isCheckedInToday ? "✅" : "🕔"}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}

export default PartTimerCom;
