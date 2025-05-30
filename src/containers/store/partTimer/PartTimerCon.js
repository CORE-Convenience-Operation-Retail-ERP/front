import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PartTimerCom from "../../../components/store/partTimer/PartTimerCom";
import SearchBar from "../../../components/store/common/StoreSearchBar";
import QRModal from "../../../containers/store/partTimer/attendance/QRModal";
import { PrimaryButton, DangerButton } from "../../../features/store/styles/common/Button.styled";
import styled from "styled-components";

import {
    fetchPartTimers,
    searchPartTimers,
    deletePartTimer
} from "../../../service/store/PartTimeService";
import {PageTitle, PageWrapper} from "../../../features/store/styles/common/PageLayout";

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
`;


function PartTimerCon() {
    const navigate = useNavigate();

    const [partTimers, setPartTimers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useState({});
    const [selectedIds, setSelectedIds] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [qrModalInfo, setQrModalInfo] = useState(null);

    useEffect(() => {
        loadPartTimers();
    }, [searchParams, page]);

    const loadPartTimers = async () => {
        setLoading(true);
        try {
            const hasSearch = Object.values(searchParams).some((v) => v);
            const data = hasSearch
                ? await searchPartTimers({ ...searchParams, page, size })
                : await fetchPartTimers({ page, size });

            if (Array.isArray(data)) {
                setPartTimers(data);
                setTotalPages(1);
            } else {
                setPartTimers(data.content || []);
                setTotalPages(data.totalPages || 1);
            }
        } catch (error) {
            console.error("파트타이머 조회 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (params) => {
        setSearchParams(params);
        setPage(0);
    };

    const handleCheck = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
    };

    const handleCheckAll = (checked) => {
        if (checked) {
            const allIds = partTimers.map((pt) => pt.partTimerId);
            setSelectedIds(allIds);
        } else {
            setSelectedIds([]);
        }
    };

    const handleDelete = async () => {
        if (selectedIds.length === 0) {
            alert("삭제할 아르바이트를 선택하세요.");
            return;
        }

        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            await Promise.all(selectedIds.map((id) => deletePartTimer(id)));
            alert("삭제 성공");
            setSelectedIds([]);
            loadPartTimers();
        } catch (error) {
            console.error("삭제 실패:", error);
        }
    };

    const handleOpenQRModal = (partTimerId, mode) => {
        setQrModalInfo({ partTimerId, mode });
    };

    const handleCloseQRModal = () => {
        setQrModalInfo(null);
    };

    return (
        <PageWrapper>
                <PageTitle>| 인사관리</PageTitle>
            <TopBar>

                <SearchBar
                    filterOptions={[
                        { key: "partName", label: "이름", type: "text" },
                        {
                            key: "position",
                            label: "직책",
                            type: "select",
                            options: [
                                { value: "", label: "전체" },
                                { value: "아르바이트", label: "아르바이트" },
                                { value: "매니저", label: "매니저" },
                                { value: "점장", label: "점장" }
                            ]
                        },
                        {
                            key: "partStatus",
                            label: "상태",
                            type: "select",
                            options: [
                                { value: "", label: "전체" },
                                { value: "1", label: "재직" },
                                { value: "0", label: "퇴사" }
                            ]
                        }
                    ]}
                    onSearch={handleSearch}
                />

                <div style={{ display: "flex", gap: "8px" }}>
                    <PrimaryButton onClick={() => navigate("/store/parttimer/register")}>등록</PrimaryButton>
                    <DangerButton onClick={handleDelete}>삭제</DangerButton>
                </div>
            </TopBar>

            <PartTimerCom
                data={partTimers}
                loading={loading}
                selectedIds={selectedIds}
                onCheck={handleCheck}
                onCheckAll={handleCheckAll}
                onOpenQRModal={handleOpenQRModal}
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

            {qrModalInfo && (
                <QRModal
                    partTimerId={qrModalInfo.partTimerId}
                    mode={qrModalInfo.mode}
                    onClose={handleCloseQRModal}
                />
            )}
        </PageWrapper>
    );
}

export default PartTimerCon;