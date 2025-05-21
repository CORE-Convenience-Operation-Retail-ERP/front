import React, { useEffect, useState } from "react";
import AttendanceCom from "../../../../components/store/attendance/AttendanceCom";
import { fetchPartTimerAttendanceList } from "../../../../service/store/AttendanceSerivce";
import { fetchStoreList } from "../../../../service/store/StoreService";
import {PageTitle, PageWrapper} from "../../../../features/store/styles/common/PageLayout";

function AttendanceCon() {
  const [attendanceList, setAttendanceList] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  const isHQ = localStorage.getItem("role") === "ROLE_MASTER";
  const userStoreId = parseInt(localStorage.getItem("storeId"));

  useEffect(() => {
    const init = async () => {
      if (isHQ) {
        const storeRes = await fetchStoreList();
        setStoreList(storeRes.data || []);
      } else {
        setSelectedStoreId(userStoreId);
        loadAttendance({ storeId: userStoreId });
      }
    };
    init();
  }, []);

  const loadAttendance = async (searchFilters = {}) => {
    const storeIdToUse = searchFilters.storeId || selectedStoreId;
    if (!storeIdToUse) return;

    const result = await fetchPartTimerAttendanceList({
      ...searchFilters,
      storeId: storeIdToUse,
    });
    setAttendanceList(result.content || []);
  };

const handleSearch = (newFilters) => {
  const baseStoreId = selectedStoreId || filters.storeId;
  const mergedFilters = {
    storeId: newFilters.storeId ?? baseStoreId,
    ...newFilters,
  };

  setFilters(mergedFilters);
  loadAttendance(mergedFilters);
};


  const handleStoreChange = (e) => {
    const newStoreId = parseInt(e.target.value);
    setSelectedStoreId(newStoreId);
    handleSearch({ storeId: newStoreId });
  };

  return (
      <PageWrapper>
  <PageTitle>근태 관리</PageTitle>
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