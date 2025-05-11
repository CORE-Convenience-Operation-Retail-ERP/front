import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
    Table,
    Thead,
    Tbody,
    Th,
    Tr,
    Td,
    ClickableTd,
    Checkbox
} from '../../../features/store/styles/partTimer/StoreParttimer.styled';


function PartTimerCom({ data, loading, selectedIds, onCheck, onCheckAll }) {
    const navigate = useNavigate();

    if (loading) return <p>불러오는 중...</p>;
    if (!data || data.length === 0) return <p>검색 결과가 없습니다.</p>;


    return (
        <Table>
            <Thead>
                <Tr>
                    <Th>
                        <Checkbox
                            onChange={(e) => onCheckAll(e.target.checked)}
                        />
                    </Th>
                    <Th>이름</Th>
                    <Th>직급</Th>
                    <Th>근무형태</Th>
                    <Th>전화번호</Th>
                    <Th>입사일</Th>
                    <Th>시급</Th>
                    <Th>은행</Th>
                    <Th>계좌번호</Th>
                    <Th>상태</Th>
                </Tr>
            </Thead>
            <Tbody>
                {data.map((pt) => (
                    <Tr key={pt.partTimerId}>
                        <Td>
                            <Checkbox
                                checked={selectedIds.includes(pt.partTimerId)}
                                onChange={() => onCheck(pt.partTimerId)}
                            />
                        </Td>
                        <ClickableTd onClick={() => navigate(`/store/parttimer/${pt.partTimerId}`)}>
                            {pt.partName}
                        </ClickableTd>
                        <Td>{pt.position || '-'}</Td>
                        <Td>{pt.workType || '-'}</Td>
                        <Td>{pt.partPhone || '-'}</Td>
                        <Td>{pt.hireDate ? format(new Date(pt.hireDate), "yyyy-MM-dd") : "-"}</Td>
                        <Td>{pt.hourlyWage?.toLocaleString() || '-'}원</Td>
                        <Td>
                            {(() => {
                                switch (pt.accountBank) {
                                    case "1":
                                    case 1:
                                        return "국민";
                                    case "2":
                                    case 2:
                                        return "하나";
                                    case "3":
                                    case 3:
                                        return "신한";
                                    default:
                                        return "-";
                                }
                            })()}
                        </Td>                        
                        <Td>{pt.accountNumber || '-'}</Td>
                        <Td>{pt.partStatus === 1 ? '재직' : '퇴사'}</Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
}

export default PartTimerCom;