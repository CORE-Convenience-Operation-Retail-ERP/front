import {useNavigate} from "react-router-dom";
import { format } from "date-fns";

function PartTimerCom({ data, loading, selectedIds, onCheck, onCheckAll }) {
    const navigate = useNavigate();
    
    // 데이터 확인용 로그
    console.log("PartTimerCom data:", data);
    if (data && data.length > 0) {
        console.log("첫 번째 데이터의 position:", data[0].position);
        console.log("첫 번째 데이터의 workType:", data[0].workType);
        console.log("전체 데이터 구조:", JSON.stringify(data[0], null, 2));
    }

    if (loading) return <p>불러오는 중...</p>;

    return (
        <table>
            <thead>
            <tr>
                <th><input type="checkbox" onChange={(e) => onCheckAll(e.target.checked)} /></th>
                <th>이름</th>
                <th>직급</th>
                <th>근무형태</th>
                <th>전화번호</th>
                <th>입사일</th>
                <th>시급</th>
                <th>은행</th>
                <th>계좌번호</th>
                <th>상태</th>
                <th>상세</th>
            </tr>
            </thead>
            <tbody>
            {data.map((pt) => (
                <tr key={pt.partTimerId}>
                    <td><input type="checkbox" checked={selectedIds.includes(pt.partTimerId)} onChange={() => onCheck(pt.partTimerId)} /></td>
                    <td>{pt.partName}</td>
                    <td>{pt.position || '-'}</td>
                    <td>{pt.workType || '-'}</td>
                    <td>{pt.partPhone|| '-'}</td>
                    <td>{pt.hireDate ? format(new Date(pt.hireDate), "yyyy-MM-dd") : "-"}</td>
                    <td>{pt.hourlyWage?.toLocaleString()|| '-'}원</td>
                    <td>{pt.accountBank || '-'}</td>
                    <td>{pt.accountNumber || '-'}</td>
                    <td>{pt.partStatus === 1 ? '재직' : '퇴사' || '-'}</td>
                    <td><button onClick={() => navigate(`/store/parttimer/${pt.partTimerId}`)}>상세</button></td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default PartTimerCom;