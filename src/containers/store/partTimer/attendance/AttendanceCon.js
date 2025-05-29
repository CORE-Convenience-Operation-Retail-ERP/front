import React, { useEffect, useState, useCallback } from "react";
import AttendanceCom from "../../../../components/store/attendance/AttendanceCom";
import { fetchPartTimerAttendanceList } from "../../../../service/store/AttendanceSerivce";
import { fetchStoreList } from "../../../../service/store/StoreService";
import { PageTitle, PageWrapper } from "../../../../features/store/styles/common/PageLayout";

function AttendanceCon() {
    const [attendanceList, setAttendanceList] = useState([]);
    const [storeList, setStoreList] = useState([]);
    const [filters, setFilters] = useState({});
    const [selectedStoreId, setSelectedStoreId] = useState(null);

    const isHQ = localStorage.getItem("role") === "ROLE_MASTER";
    const userStoreId = parseInt(localStorage.getItem("storeId"));

    // HQ일 경우 매장 목록 조회
    useEffect(() => {
        const init = async () => {
            if (isHQ) {
                const res = await fetchStoreList();
                setStoreList(res.data || []);
            } else {
                setSelectedStoreId(userStoreId);
                handleSearch({ storeId: userStoreId });
            }
        };
        init();
    }, []);

    const handleSearch = useCallback(async (rawFilters = {}) => {
        const filters = {};

        // 날짜 필터 처리 (yyyy-MM-dd 포맷)
        if (rawFilters.startDate) {
            const s = new Date(rawFilters.startDate);
            filters.startDate = `${s.getFullYear()}-${(s.getMonth() + 1).toString().padStart(2, "0")}-${s.getDate().toString().padStart(2, "0")}`;
        }
        if (rawFilters.endDate) {
            const e = new Date(rawFilters.endDate);
            filters.endDate = `${e.getFullYear()}-${(e.getMonth() + 1).toString().padStart(2, "0")}-${e.getDate().toString().padStart(2, "0")}`;
        }

        // 매장 ID 필터
        const storeIdToUse = rawFilters.storeId || selectedStoreId;
        if (!storeIdToUse) return;
        filters.storeId = storeIdToUse;

        // 추가 필터가 있다면 여기에 추가 가능
        // if (rawFilters.partName) filters.partName = rawFilters.partName.trim();

        console.log("📅 필터 상태:", filters);
        console.log("🏬 선택된 매장 ID:", storeIdToUse);

        try {
            const res = await fetchPartTimerAttendanceList(filters);
            setAttendanceList(res.content || []);
            console.log("📋 불러온 근태 목록:", res.content);
        } catch (err) {
            console.error("❌ 근태 목록 조회 실패:", err);
        }

        setFilters(filters);
    }, [selectedStoreId]);

    const handleStoreChange = (e) => {
        const newStoreId = parseInt(e.target.value);
        setSelectedStoreId(newStoreId);
        handleSearch({ storeId: newStoreId });
    };

    return (
        <PageWrapper>
            <PageTitle>┃ 근태 관리</PageTitle>
            <AttendanceCom
                data={attendanceList}
                onSearch={handleSearch}
                storeList={storeList}
                selectedStoreId={selectedStoreId}
                onStoreChange={isHQ ? handleStoreChange : null}
            />
        </PageWrapper>
    );
}

export default AttendanceCon;
