import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from "../../../features/store/styles/salary/SalaryList.styled";

function SalaryListCom({ data = [], loading, viewMode, onRowClick }) {
  if (loading) return <p>급여 데이터를 불러오는 중입니다...</p>;
  if (!Array.isArray(data) || data.length === 0)
    return <p>표시할 급여 데이터가 없습니다.</p>;

  const renderRowByView = (item) => {
    switch (viewMode) {
      case "monthly":
        return (
          <>
            <Td>{item.salaryTypeStr}</Td>
            <Td>{item.workHours ?? "-"}</Td>
            <Td>{toCurrency(item.baseSalary)}</Td>
            <Td>{toCurrency(item.deductTotal)}</Td>
            <Td>{toCurrency(item.netSalary)}</Td>
            <Td>{item.payStatus === 1 ? "지급완료" : "미지급"}</Td>
            <Td>{item.payDate ? item.payDate.split("T")[0] : "-"}</Td>
          </>
        );
      case "yearly":
        return (
          <>
            <Td>{toCurrency(item.totalSalary)}</Td>
            <Td>{toCurrency(item.totalDeduct)}</Td>
            <Td>{toCurrency(item.totalBonus)}</Td>
            <Td>{toCurrency(item.averageMonthly)}</Td>
            <Td>{item.year}</Td>
          </>
        );
      case "custom":
        return (
          <>
            <Td>{item.salaryTypeStr}</Td>
            <Td>{item.workHours ?? "-"}</Td>
            <Td>{toCurrency(item.baseSalary)}</Td>
            <Td>{toCurrency(item.deductTotal)}</Td>
            <Td>{toCurrency(item.netSalary)}</Td>
            <Td>{item.payStatus === 1 ? "지급완료" : "미지급"}</Td>
            <Td>{item.payDateStr ?? "-"}</Td>
          </>
        );
      default:
        return null;
    }
  };

  const renderHeaderByView = () => {
    switch (viewMode) {
      case "monthly":
        return (
          <>
            <Th>급여형태</Th>
            <Th>근무시간</Th>
            <Th>기본급</Th>
            <Th>공제</Th>
            <Th>실지급</Th>
            <Th>지급상태</Th>
            <Th>지급날짜</Th>
          </>
        );
      case "yearly":
        return (
          <>
            <Th>총 지급</Th>
            <Th>총 공제</Th>
            <Th>총 수당</Th>
            <Th>평균 지급</Th>
            <Th>연도</Th>
          </>
        );
      case "custom":
        return (
          <>
            <Th>급여형태</Th>
            <Th>근무시간</Th>
            <Th>기본급</Th>
            <Th>공제</Th>
            <Th>실지급</Th>
            <Th>지급상태</Th>
            <Th>지급일</Th>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>이름</Th>
          {renderHeaderByView()}
        </Tr>
      </Thead>
      <Tbody>
        {data.map((item, idx) => (
          <Tr
            key={item.partTimerId || idx}
            onClick={() => onRowClick(item.partTimerId)}
            style={{ cursor: "pointer" }}
          >
            <Td>{item.name}</Td>
            {renderRowByView(item)}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

function toCurrency(val) {
  return typeof val === "number" && !isNaN(val) ? `${val.toLocaleString()}원` : "-";
}

export default SalaryListCom;