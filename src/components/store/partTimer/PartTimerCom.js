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
    Checkbox,
    ActionButton
} from '../../../features/store/styles/partTimer/StoreParttimer.styled';

function PartTimerCom({
                          data,
                          loading,
                          selectedIds,
                          onCheck,
                          onCheckAll,
                          onOpenQRModal
                      }) {
    const navigate = useNavigate();

    if (loading) return <p>불러오는 중...</p>;
    if (!data || data.length === 0) return <p>검색 결과가 없습니다.</p>;

    return (
        <Table>
            <Thead>
                <Tr>
                    <Th>
                        <Checkbox onChange={(e) => onCheckAll(e.target.checked)} />
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
                    <Th>출퇴근</Th>
                    <Th>상태</Th>
                </Tr>
            </Thead>
            <Tbody>
                {data.map((pt) => {
                    const status = pt.attendStatus; // 0: 출근 전, 1: 출근 완료, 2: 퇴근 완료
                    return (
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
                                {{
                                    1: "국민",
                                    2: "하나",
                                    3: "신한"
                                }[pt.accountBank] || "-"}
                            </Td>
                            <Td>{pt.accountNumber || '-'}</Td>
                            <Td>
                                {{
                                    1: "재직",
                                    0: "퇴사",
                                    2: "휴직"
                                }[pt.partStatus] || "-"}
                            </Td>
                            <Td>
                                {!pt.isCheckedInToday ? (
                                    <ActionButton onClick={() => onOpenQRModal(pt.partTimerId, 'check-in')}>
                                        출근
                                    </ActionButton>
                                ) : (
                                    <ActionButton onClick={() => onOpenQRModal(pt.partTimerId, 'check-out')}>
                                        퇴근
                                    </ActionButton>
                                )}
                            </Td>

                            <Td>
                                {pt.isCheckedInToday ? "✅" : "🕔"}
                            </Td>

                        </Tr>
                    );
                })}
            </Tbody>
        </Table>
    );
}

export default PartTimerCom;