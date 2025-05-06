import { useEffect, useRef, useState, useCallback } from 'react';
import Calendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import {
  fetchSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '../../../service/store/partTimerScheduleService';
import PartTimerRegisterModal from '../../../components/store/partTimerSchedule/modal/PartTimerRegisterModal';
import PartTimerEditModal from '../../../components/store/partTimerSchedule/modal/PartTimerEditModal';
import { ScheduleWrapper } from '../../../features/store/styles/partTimerSchedule/PartTimerSchedule.styled';
import PartTimerMonthCom from '../../../components/store/partTimerSchedule/calendar/PartTimerMonthCom';


function PartTimerMonthCon() {
  const calendarRef = useRef();
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const colorOptions = [
    '#03bd9e', '#ff5b5b', '#5b76ff', '#ffc107', '#9c27b0', '#ff9800', '#4caf50'
  ];

  const convertToEvent = useCallback((dto) => ({
    id: String(dto.scheduleId),
    calendarId: '1',
    title: dto.title,
    category: 'time',
    start: new Date(dto.startTime),
    end: new Date(dto.endTime),
    backgroundColor: dto.bgColor || '#03bd9e',
  }), []);

  const reloadSchedules = useCallback(async () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    const data = await fetchSchedules('month', start, end);
    setSchedules(data.map(convertToEvent));
  }, [convertToEvent]);

  useEffect(() => {
    reloadSchedules();
  }, [reloadSchedules]);

  const handleClickSchedule = (e) => {
    const schedule = e?.schedule;
    if (!schedule) return;

    console.log("✅ 클릭된 스케줄:", schedule);

    setSelectedSchedule({
      id: schedule.id,
      title: schedule.title,
      start: schedule.start.toISOString().slice(0, 16),
      end: schedule.end.toISOString().slice(0, 16),
      bgColor: schedule.backgroundColor,
    });
  };

  const handleSubmitModal = async (data) => {
    try {
      await createSchedule({
        title: data.title,
        startTime: data.start,
        endTime: data.end,
        partTimerId: data.partTimerId,
        bgColor: data.bgColor || '#03bd9e'
      });
      await reloadSchedules();
      setShowModal(false);
    } catch (e) {
      alert('등록 실패');
    }
  };

  const handleUpdateSchedule = async (updated) => {
    try {
      await updateSchedule(updated.id, updated);
      await reloadSchedules();
    } catch (e) {
      alert('수정 실패');
    } finally {
      setSelectedSchedule(null);
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await deleteSchedule(id);
      await reloadSchedules();
    } catch (e) {
      alert('삭제 실패');
    } finally {
      setSelectedSchedule(null);
    }
  };

  return (
    <>
      <PartTimerMonthCom
        calendarRef={calendarRef}
        schedules={schedules}
        onClickSchedule={handleClickSchedule}
        onSelectDateTime={(e) => {
          const date = e?.start?.toISOString().split('T')[0];
          if (date) {
            setSelectedDate(date);
            setShowModal(true);
          }
        }}
      />

      {showModal && (
        <PartTimerRegisterModal
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitModal}
          initialDate={selectedDate}
          colorOptions={colorOptions}
        />
      )}

      {selectedSchedule && (
        <PartTimerEditModal
          schedule={selectedSchedule}
          onClose={() => setSelectedSchedule(null)}
          onUpdate={handleUpdateSchedule}
          onDelete={handleDeleteSchedule}
          colorOptions={colorOptions}
        />
      )}
    </>
  );
}

export default PartTimerMonthCon;