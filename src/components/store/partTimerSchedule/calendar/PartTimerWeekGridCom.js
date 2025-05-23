import React from 'react';
import styled from 'styled-components';

const daysKor = ['일', '월', '화', '수', '목', '금', '토'];

const GridWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const DayHeaderRow = styled.div`
  display: grid;
  grid-template-columns: 120px repeat(7, 1fr);
  background-color: #f9f9f9;
  border-bottom: 1px solid #ccc;
  font-weight: bold;
  padding: 0.5rem 0;
  text-align: center;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 120px repeat(7, 1fr);
  border-bottom: 1px solid #eee;
  min-height: 64px;
  position: relative;
  align-items: center;
`;

const DayCell = styled.div`
  border-right: 1px solid #eee;
  padding: 4px;
  font-size: 12px;
  min-height: 100px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AvatarWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-left: 0.5rem;
`;

const Avatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
`;

const Name = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const ScheduleBar = styled.div`
  grid-column: ${props => `${props.startIdx + 2} / span ${props.colSpan}`};
  background-color: ${props => props.bgColor || '#03bd9e'};
  color: white;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
  z-index: 1;
  align-self: center;
  cursor: pointer;
  transition: transform 0.1s ease-in-out;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    z-index: 10;
  }
`;

function PartTimerWeekBarCom({ weekDates, schedules, onClickDate, onClickSchedule }) {
  const getDateKey = (date) => date?.toISOString().split('T')[0];

  const getGridPositionProps = (bar, week) => {
    const firstDay = new Date(week[0]);
    const lastDay = new Date(week[week.length - 1]);

    const start = new Date(bar.startDate);
    const end = new Date(bar.endDate);

    if (end < firstDay || start > lastDay) return null;

    const effectiveStart = start < firstDay ? firstDay : start;
    const effectiveEnd = end > lastDay ? lastDay : end;

    const startIdx = Math.floor((effectiveStart.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24));
    const colSpan = Math.floor((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return { startIdx, colSpan };
  };

  const grouped = schedules.reduce((acc, item) => {
    const key = item.partTimerId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const partTimerIds = Object.keys(grouped);

  return (
      <GridWrapper>
        <DayHeaderRow>
          <div></div>
          {weekDates.map(date => (
              <div key={date.toISOString()}>{daysKor[date.getDay()]}</div>
          ))}
        </DayHeaderRow>

        {partTimerIds.map(id => {
          const bars = grouped[id];
          const firstBar = bars[0];

          return (
              <Row key={id}>
                <AvatarWrap>
                  <Avatar src={firstBar.partImg} alt="avatar" />
                  <Name>{firstBar.title}</Name>
                </AvatarWrap>

                {weekDates.map((dateObj, dayIdx) => (
                    <DayCell key={dayIdx} onClick={() => onClickDate?.(getDateKey(dateObj))}>
                    </DayCell>
                ))}

                {bars.map((bar, barIdx) => {
                  const pos = getGridPositionProps(bar, weekDates);
                  if (!pos) return null;
                  return (
                      <ScheduleBar
                          key={barIdx}
                          bgColor={bar.bgColor}
                          startIdx={pos.startIdx}
                          colSpan={pos.colSpan}
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
                        {bar.startTime}~{bar.endTime}
                      </ScheduleBar>
                  );
                })}
              </Row>
          );
        })}
      </GridWrapper>
  );
}

export default PartTimerWeekBarCom;
