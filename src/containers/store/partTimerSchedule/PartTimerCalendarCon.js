import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import PartTimerWeekGridCom from '../../../components/store/partTimerSchedule/calendar/PartTimerWeekGridCom';
import PartTimerRegisterModal from '../../../components/store/partTimerSchedule/modal/PartTimerRegisterModal';
import PartTimerEditModal from '../../../components/store/partTimerSchedule/modal/PartTimerEditModal';
import MonthlyScheduleGridCom from '../../../components/store/partTimerSchedule/calendar/MonthlyScheduleGridCom';
import {
  fetchSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule
} from '../../../service/store/partTimerScheduleService';
import {
  TabContainer,
  CalendarNav
} from '../../../features/store/styles/partTimerSchedule/PartTimerSchedule.styled';
import { generateCalendarMatrix } from '../../../utils/calendarUtils';
import {PageTitle} from "../../../features/store/styles/common/PageLayout";

const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: 120px repeat(7, 1fr);
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
  font-weight: bold;
  padding: 0.5rem;
  text-align: center;
`;

function PartTimerCalendarCon() {
  const calendarRef = useRef();
  const [view, setView] = useState('month');
  const [calendarKey, setCalendarKey] = useState(0);
  const [schedules, setSchedules] = useState([]);
  const [monthlySchedules, setMonthlySchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const colorOptions = ['#03bd9e', '#ff5b5b', '#5b76ff', '#ffc107', '#9c27b0', '#ff9800', '#4caf50'];

  const convertToEvent = useCallback((dto) => ({
    id: String(dto.scheduleId),
    calendarId: '1',
    title: dto.title,
    partImg: dto.partImg,
    partTimerId: dto.partTimerId,
    category: 'time',
    start: new Date(dto.startTime),
    end: new Date(dto.endTime),
    backgroundColor: dto.bgColor || '#03bd9e'
  }), []);

  const transformToMonthlyBarMap = useCallback((events) => {
    return events.map(evt => {
      const startDate = new Date(evt.start);
      const endDate = new Date(evt.end);
      return {
        id: evt.id,
        partTimerId: evt.partTimerId,
        title: evt.title,
        partImg: evt.partImg,
        bgColor: evt.backgroundColor,
        startDate,
        endDate,
        startTime: evt.start.toTimeString().slice(0, 5),
        endTime: evt.end.toTimeString().slice(0, 5)
      };
    });
  }, []);

  const getCurrentWeekDates = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const reloadSchedules = useCallback(async () => {
    const now = new Date(currentDate);
    const start = view === 'month'
      ? new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      : new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).toISOString();
    const end = view === 'month'
      ? new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()
      : new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 6).toISOString();
    const data = await fetchSchedules(view, start, end);
    const converted = data.map(convertToEvent);
    setSchedules(converted);
    if (view === 'month') {
      setMonthlySchedules(transformToMonthlyBarMap(converted));
    }
  }, [view, currentDate, convertToEvent, transformToMonthlyBarMap]);

  useEffect(() => {
    reloadSchedules();
  }, [reloadSchedules]);

  const handleClickSchedule = (schedule) => {
    if (!schedule) return;
    setSelectedSchedule({
      id: schedule.id,
      title: schedule.title,
      partTimerId: schedule.partTimerId,
      start: schedule.start,
      end: schedule.end,
      bgColor: schedule.bgColor
    });
    setModalMode('edit');
  };

  const handleClickDate = (dateKey) => {
    setSelectedDate(dateKey);
    setModalMode('register');
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
      clearCalendarSelection();
    } catch (e) {
      alert('등록 실패');
    } finally {
      setModalMode(null);
    }
  };

  const handleUpdateSchedule = async (updated) => {
    if (!window.confirm('정말 이 스케줄을 수정하시겠습니까?')) return;
    try {
      await updateSchedule(updated.id, updated);
      await reloadSchedules();
    } catch (e) {
      alert('수정 실패');
    } finally {
      setSelectedSchedule(null);
      setModalMode(null);
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm('정말 이 스케줄을 삭제하시겠습니까?')) return;
    try {
      await deleteSchedule(id);
      await reloadSchedules();
    } catch (e) {
      alert('삭제 실패');
    } finally {
      setSelectedSchedule(null);
      setModalMode(null);
    }
  };

  const clearCalendarSelection = () => setCalendarKey(prev => prev + 1);

  const goToday = () => {
    setCurrentDate(new Date());
    reloadSchedules();
  };

  const goNext = () => {
    const next = new Date(currentDate);
    view === 'month' ? next.setMonth(next.getMonth() + 1) : next.setDate(next.getDate() + 7);
    setCurrentDate(next);
    reloadSchedules();
  };

  const goPrev = () => {
    const prev = new Date(currentDate);
    view === 'month' ? prev.setMonth(prev.getMonth() - 1) : prev.setDate(prev.getDate() - 7);
    setCurrentDate(prev);
    reloadSchedules();
  };

  const formatDateToYearMonth = (date) => {
    if (view === 'month') {
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
    } else {
      const start = getCurrentWeekDates(date)[0];
      const end = getCurrentWeekDates(date)[6];
      return `${start.getFullYear()}년 ${start.getMonth() + 1}월 ${start.getDate()}일 ~ ${end.getMonth() + 1}월 ${end.getDate()}일`;
    }
  };

  const calendarMatrix = generateCalendarMatrix(currentDate.getFullYear(), currentDate.getMonth());
  const weekDates = getCurrentWeekDates(currentDate);

  return (
    <div>
      <PageTitle>스케줄 관리</PageTitle>
      <TabContainer>
        <button className={view === 'month' ? 'active' : ''} onClick={() => setView('month')}>월간 보기</button>
        <button className={view === 'week' ? 'active' : ''} onClick={() => setView('week')}>주간 보기</button>
      </TabContainer>

      <CalendarNav>
        <div style={{ fontSize: '20px', fontWeight: 'bold', marginRight: 'auto' }}>
          {formatDateToYearMonth(currentDate)}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={goPrev}>← 이전</button>
          <button onClick={goToday}>오늘</button>
          <button onClick={goNext}>다음 →</button>
        </div>
      </CalendarNav>

      {view === 'month' ? (
        <MonthlyScheduleGridCom
          year={currentDate.getFullYear()}
          month={currentDate.getMonth() + 1}
          calendarMatrix={calendarMatrix}
          schedules={monthlySchedules}
          onClickDate={handleClickDate}
          onClickSchedule={handleClickSchedule}
        />
      ) : (
        <>
          <WeekHeader>
            <div>직원</div>
            {weekDates.map(date => (
              <div
                key={date.toISOString()}
                onClick={() => handleClickDate(date.toISOString().split('T')[0])}
                style={{ cursor: 'pointer' }}
              >
                {date.getMonth() + 1}/{date.getDate()}
              </div>
            ))}
          </WeekHeader>
          <PartTimerWeekGridCom
            weekDates={weekDates}
            schedules={transformToMonthlyBarMap(schedules)}
            onClickSchedule={handleClickSchedule}
            onClickDate={handleClickDate}
            expandBar={true}
          />
        </>
      )}

      {modalMode === 'register' && (
        <PartTimerRegisterModal
          onClose={() => {
            clearCalendarSelection();
            setModalMode(null);
          }}
          onSubmit={handleSubmitModal}
          initialDate={selectedDate}
          colorOptions={colorOptions}
        />
      )}

      {modalMode === 'edit' && selectedSchedule && (
        <PartTimerEditModal
          schedule={selectedSchedule}
          onClose={() => {
            setSelectedSchedule(null);
            setModalMode(null);
          }}
          onUpdate={handleUpdateSchedule}
          onDelete={handleDeleteSchedule}
          colorOptions={colorOptions}
        />
      )}
    </div>
  );
}

export default PartTimerCalendarCon;