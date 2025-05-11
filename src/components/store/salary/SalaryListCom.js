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

  const renderMonthlyRow = (item) => (
    <>
      <Td>{item.salaryTypeStr}</Td>
      <Td>{item.workHours ?? "-"}</Td>
      <Td>{toCurrency(item.baseSalary)}</Td>
      <Td>{toCurrency(item.deductTotal)}</Td>
      <Td>{toCurrency(item.netSalary)}</Td>
      <Td>{item.payStatus === 1 ? "지급완료" : "미지급"}</Td>
    </>
  );

  const renderYearlyRow = (item) => (
    <>
      <Td>{toCurrency(item.totalSalary)}</Td>
      <Td>{toCurrency(item.totalDeduct)}</Td>
      <Td>{toCurrency(item.totalBonus)}</Td>
      <Td>{toCurrency(item.averageMonthly)}</Td>
      <Td>{item.year}</Td>
    </>
  );

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>이름</Th>
          {viewMode === "monthly" && (
            <>
              <Th>급여형태</Th>
              <Th>근무시간</Th>
              <Th>기본급</Th>
              <Th>공제</Th>
              <Th>실지급</Th>
              <Th>지급상태</Th>
            </>
          )}
          {viewMode === "yearly" && (
            <>
              <Th>총 지급</Th>
              <Th>총 공제</Th>
              <Th>총 수당</Th>
              <Th>평균 지급</Th>
              <Th>연도</Th>
            </>
          )}
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
            {viewMode === "monthly" ? renderMonthlyRow(item) : renderYearlyRow(item)}
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