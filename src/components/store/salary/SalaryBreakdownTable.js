import { Table, Th, Td } from '../../../features/store/styles/salary/SalartDetail.styled';

function SalaryBreakdownTable({ data, view }) {
  if (!data || data.length === 0) return <p>데이터가 없습니다.</p>;

  return (
    <Table>
      <thead>
        <tr>
          {view === "monthly" ? <Th>지급일</Th> : <Th>월</Th>}
          <Th>기본급</Th>
          <Th>수당</Th>
          <Th>공제</Th>
          <Th>실지급</Th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => {
          const isTotalRow = item.payDate === "총합";

          return (
            <tr
              key={idx}
              style={isTotalRow ? { fontWeight: 'bold', backgroundColor: '#f1f5f9' } : {}}
            >
              <Td>{isTotalRow ? "총합" : (view === "monthly" ? item.payDate?.slice(0, 10) : `${item.month}월`)}</Td>
              <Td>{(item.baseSalary || item.totalBaseSalary)?.toLocaleString?.() || 0}원</Td>
              <Td>{(item.bonus ?? item.totalBonus)?.toLocaleString()}원</Td>
              <Td>{(item.deductTotal ?? item.totalDeduct)?.toLocaleString()}원</Td>
              <Td>{(item.netSalary ?? item.totalNetSalary)?.toLocaleString()}원</Td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default SalaryBreakdownTable;