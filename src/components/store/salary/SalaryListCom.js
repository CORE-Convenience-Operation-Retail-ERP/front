import { Table } from "../../../features/store/styles/common/Table.styled";

function SalaryListCom({ data = [], loading, viewMode, onRowClick }) {
    if (loading) return <p>급여 데이터를 불러오는 중입니다...</p>;
    if (!Array.isArray(data) || data.length === 0)
        return <p>표시할 급여 데이터가 없습니다.</p>;

    const renderRowByView = (item) => {
        switch (viewMode) {
            case "monthly":
            case "custom":
                return (
                    <>
                        <td>{item.salaryTypeStr}</td>
                        <td>{item.workHours ?? "-"}</td>
                        <td>{toCurrency(item.baseSalary)}</td>
                        <td>{toCurrency(item.deductTotal)}</td>
                        <td>{toCurrency(item.netSalary)}</td>
                        <td>{item.payStatus === 1 ? "지급완료" : "미지급"}</td>
                        <td>{item.payDateStr ?? item.payDate?.split("T")[0] ?? "-"}</td>
                    </>
                );
            case "yearly":
                return (
                    <>
                        <td>{toCurrency(item.totalSalary)}</td>
                        <td>{toCurrency(item.totalDeduct)}</td>
                        <td>{toCurrency(item.totalBonus)}</td>
                        <td>{toCurrency(item.averageMonthly)}</td>
                        <td>{item.year}</td>
                    </>
                );
            default:
                return null;
        }
    };

    const renderHeaderByView = () => {
        switch (viewMode) {
            case "monthly":
            case "custom":
                return (
                    <>
                        <th>급여형태</th>
                        <th>근무시간</th>
                        <th>기본급</th>
                        <th>공제</th>
                        <th>실지급</th>
                        <th>지급상태</th>
                        <th>지급일</th>
                    </>
                );
            case "yearly":
                return (
                    <>
                        <th>총 지급</th>
                        <th>총 공제</th>
                        <th>총 수당</th>
                        <th>평균 지급</th>
                        <th>연도</th>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Table>
            <thead>
            <tr>
                <th>이름</th>
                {renderHeaderByView()}
            </tr>
            </thead>
            <tbody>
            {data.map((item, idx) => (
                <tr
                    key={item.partTimerId || idx}
                    onClick={() => onRowClick(item.partTimerId)}
                    style={{ cursor: "pointer" }}
                >
                    <td>{item.name}</td>
                    {renderRowByView(item)}
                </tr>
            ))}
            </tbody>
        </Table>
    );
}

function toCurrency(val) {
    return typeof val === "number" && !isNaN(val) ? `${val.toLocaleString()}원` : "-";
}

export default SalaryListCom;
