import React, { useMemo } from 'react';
import styled from 'styled-components';

// 요일 한글 배열
const daysKor = ['일', '월', '화', '수', '목', '금', '토'];

// 전체 레이아웃 컨테이너
const GridWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

// 헤더: 직원 칸 + 7일 요일
const DayHeaderRow = styled.div`
  display: grid;
  grid-template-columns: 120px repeat(7, 1fr);
  background-color: #f9f9f9;
  border-bottom: 1px solid #ccc;
  font-weight: bold;
  padding: 0.5rem 0;
  text-align: center;
  /* 헤더 높이 추가 */
  min-height: 48px;
  align-items: center;
`;

// 한 알바생의 한 줄(Row)
const Row = styled.div`
  display: grid;
  grid-template-columns: 120px repeat(7, 1fr);
  grid-auto-rows: 48px;      /* 자동 생성되는 행 높이를 키움 */
  row-gap: 8px;              /* 행 사이 간격 */
  border-bottom: 1px solid #eee;
  position: relative;
`;

// 각 날짜 셀
const DayCell = styled.div`
  border-right: 1px solid #eee;
  padding: 8px;               /* 패딩 증가 */
  font-size: 12px;
  min-height: 48px;           /* 최소 높이 지정 */
  display: flex;
  align-items: flex-start;
  cursor: pointer;
`;

// 아바타 + 이름 영역
const AvatarWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-left: 0.5rem;
`;

const Avatar = styled.img`
  width: 32px;               /* 아이콘 크기 확대 */
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const Name = styled.div`
  font-size: 16px;           /* 폰트 크기 증가 */
  font-weight: 500;
`;

// 일정 바 (Grid 내에서 시작 열과 span 길이, 행 위치로 배치)
const ScheduleBar = styled.div`
  grid-row: ${p => p.rowIndex + 1};
  grid-column: ${p => `${p.startIdx + 2} / span ${p.colSpan}`};
  background-color: ${p => p.bgColor || '#03bd9e'};
  color: white;
  border-radius: 10px;
  padding: 0 16px;            /* 좌우 여유 padding */
  font-size: 12px;            /* 텍스트 크기 조정 */
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
  cursor: pointer;
  transition: transform 0.1s ease-in-out;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    z-index: 10;
  }
`;

// 문자열/Date → 로컬 자정 Date로 변환
const parseLocalDate = input => {
  if (input instanceof Date) {
    return new Date(input.getFullYear(), input.getMonth(), input.getDate());
  }
  const d = new Date(input);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

// bar 및 weekDates를 받아 grid 위치(startIdx, colSpan) 계산
const getGridPositionProps = (bar, week) => {
  const firstDay = parseLocalDate(week[0]);
  const lastDay  = parseLocalDate(week[week.length - 1]);
  const start    = parseLocalDate(bar.startDate);
  const end      = parseLocalDate(bar.endDate);

  if (end < firstDay || start > lastDay) return null;

  const effectiveStart = start < firstDay ? firstDay : start;
  const effectiveEnd   = end   > lastDay  ? lastDay  : end;

  const startIdx = week.findIndex(d =>
    d.getFullYear() === effectiveStart.getFullYear() &&
    d.getMonth()    === effectiveStart.getMonth() &&
    d.getDate()     === effectiveStart.getDate()
  );
  const endIdx = week.findIndex(d =>
    d.getFullYear() === effectiveEnd.getFullYear() &&
    d.getMonth()    === effectiveEnd.getMonth() &&
    d.getDate()     === effectiveEnd.getDate()
  );

  return { startIdx, colSpan: endIdx - startIdx + 1 };
};

function PartTimerWeekBarCom({ weekDates, schedules, onClickDate, onClickSchedule }) {
  // partTimerId별 그룹화 및 겹침 계산
  const positionedByTimer = useMemo(() => {
    const groups = schedules.reduce((acc, item) => {
      (acc[item.partTimerId] ||= []).push(item);
      return acc;
    }, {});
    const result = {};

    Object.entries(groups).forEach(([timer, bars]) => {
      // 날짜 범위 계산 및 필터
      const posList = bars
        .map(bar => ({ ...bar, ...getGridPositionProps(bar, weekDates) }))
        .filter(p => p.startIdx != null);

      // 겹침 시 rowIndex 할당
      const lanes = [];
      posList.forEach(bar => {
        let placed = false;
        for (let i = 0; i < lanes.length; i++) {
          const lane = lanes[i];
          if (lane.every(b => b.startIdx + b.colSpan <= bar.startIdx || bar.startIdx + bar.colSpan <= b.startIdx)) {
            bar.rowIndex = i;
            lane.push(bar);
            placed = true;
            break;
          }
        }
        if (!placed) {
          bar.rowIndex = lanes.length;
          lanes.push([bar]);
        }
      });
      if (posList.length > 0) result[timer] = posList;
    });

    return result;
  }, [schedules, weekDates]);

  const getDateKey = date => date.toISOString().split('T')[0];

  return (
    <GridWrapper>
      <DayHeaderRow>
        <div />
        {weekDates.map(date => (
          <div key={date.toISOString()}>{daysKor[date.getDay()]}</div>
        ))}
      </DayHeaderRow>

      {Object.entries(positionedByTimer)
        .filter(([_, bars]) => bars.length > 0)
        .map(([timer, bars]) => {
          const { partImg, title } = bars[0];
          return (
            <Row key={timer}>
              <AvatarWrap>
                <Avatar src={partImg} alt={title} />
                <Name>{title}</Name>
              </AvatarWrap>

              {weekDates.map(date => (
                <DayCell
                  key={date.toISOString()} onClick={() => onClickDate?.(getDateKey(date))}
                />
              ))}

              {bars.map(bar => (
                <ScheduleBar
                  key={bar.id}
                  startIdx={bar.startIdx}
                  colSpan={bar.colSpan}
                  rowIndex={bar.rowIndex}
                  bgColor={bar.bgColor}
                  onClick={() => onClickSchedule?.(bar)}
                >
                  {bar.startTime}~{bar.endTime}
                </ScheduleBar>
              ))}
            </Row>
          );
        })}
    </GridWrapper>
  );
}

export default PartTimerWeekBarCom;