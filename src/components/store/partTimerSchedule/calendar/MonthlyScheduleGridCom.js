import React from 'react';
import styled from 'styled-components';
import {PageTitle} from "../../../../features/store/styles/common/PageLayout";

const daysKor = ['일', '월', '화', '수', '목', '금', '토'];

const GridWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const DayHeaderRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #f9f9f9;
  border-bottom: 1px solid #ccc;
  font-weight: bold;
  padding: 0.5rem 0;
  text-align: center;
`;

const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid #eee;
  position: relative;
  min-height: ${props => props.barCount * 32 + 40}px;
`;

const DayCell = styled.div`
  border-right: 1px solid #eee;
  padding: 4px;
  font-size: 12px;
  cursor: pointer;
  min-height: 100px;
`;

const DateLabel = styled.div`
  font-weight: bold;
  margin-bottom: 4px;
`;

const ScheduleBar = styled.div`
  background-color: ${props => props.bgColor || '#03bd9e'};
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  position: absolute;
  top: ${props => props.rowIndex * 32 + 24}px;
  left: ${props => props.startOffset}%;
  width: ${props => props.spanWidth}%;
  height: auto;
  white-space: nowrap;
  cursor: pointer;
  transition: transform 0.1s ease-in-out;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    z-index: 10;
  }
`;

const Avatar = styled.img`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  object-fit: cover;
`;

function MonthlyScheduleGridCom({ calendarMatrix, schedules, onClickDate, onClickSchedule }) {
  const getDateKey = (date) => date?.toISOString().split('T')[0];

  const generatePositionProps = (bar, week) => {
    const dayCount = 7;
    const firstDay = week[0];
    const lastDay = week[dayCount - 1];

    const start = new Date(bar.startDate);
    const end = new Date(bar.endDate);

    if (end < firstDay || start > lastDay) return null;

    const effectiveStart = start < firstDay ? firstDay : start;
    const effectiveEnd = end > lastDay ? lastDay : end;

    const startIdx = (effectiveStart.getDay() + 7 - firstDay.getDay()) % 7;
    const span = (effectiveEnd - effectiveStart) / (1000 * 60 * 60 * 24) + 1;

    return {
      startOffset: (startIdx / dayCount) * 100,
      spanWidth: (span / dayCount) * 100,
    };
  };

  return (
    <GridWrapper>
      <DayHeaderRow>
        {daysKor.map(day => <div key={day}>{day}</div>)}
      </DayHeaderRow>

      {calendarMatrix.map((week, weekIdx) => {
        const barsInWeek = schedules.filter(bar => {
          const start = new Date(bar.startDate);
          const end = new Date(bar.endDate);
          const weekStart = week[0];
          const weekEnd = week[6];
          return end >= weekStart && start <= weekEnd;
        });

        return (
          <WeekRow key={weekIdx} barCount={barsInWeek.length || 1}>
            {week.map((dateObj, dayIdx) => {
              const dateKey = getDateKey(dateObj);
              return (
                <DayCell key={dayIdx} onClick={() => onClickDate?.(dateKey)}>
                  <DateLabel>{dateObj?.getDate()}</DateLabel>
                </DayCell>
              );
            })}

            {barsInWeek.map((bar, barIdx) => {
              const pos = generatePositionProps(bar, week);
              if (!pos) return null;
              return (
                <ScheduleBar
                  key={barIdx}
                  bgColor={bar.bgColor}
                  startOffset={pos.startOffset}
                  spanWidth={pos.spanWidth}
                  rowIndex={barIdx}
                  onClick={() => onClickSchedule?.({
                    id: bar.scheduleId || bar.id,
                    title: bar.title,
                    partTimerId: bar.partTimerId,
                    start: `${bar.startDate}T${bar.startTime}`,
                    end: `${bar.endDate}T${bar.endTime}`,
                    bgColor: bar.bgColor,
                    partImg: bar.partImg || ''
                  })}
                >
                  <Avatar src={bar.partImg} alt="avatar" />
                  <span>{bar.title} {bar.startTime}~{bar.endTime}</span>
                </ScheduleBar>
              );
            })}
          </WeekRow>
        );
      })}
    </GridWrapper>
  );
}

export default MonthlyScheduleGridCom;
