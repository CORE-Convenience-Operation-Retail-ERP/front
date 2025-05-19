import React from 'react';
import styled from 'styled-components';

const daysKor = ['일', '월', '화', '수', '목', '금', '토'];

const GridWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 120px repeat(7, 1fr);
  background-color: #f9f9f9;
  border-bottom: 1px solid #ccc;
  font-weight: bold;
  padding: 0.5rem;
  text-align: center;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 120px repeat(7, 1fr);
  align-items: center;
  border-bottom: 1px solid #eee;
  position: relative;
  min-height: 60px;
`;

const Cell = styled.div`
  padding: 0.3rem;
  position: relative;
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
  background-color: ${props => props.bgColor || '#03bd9e'};
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 10px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  position: absolute;
  top: 4px;
  left: 0;
  right: 0;
  margin: auto;
  width: fit-content;
  white-space: nowrap;
  cursor: pointer;
  transition: transform 0.1s ease-in-out;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    z-index: 10;
  }
`;

function PartTimerWeekGridCom({ weekDates, schedules = [], onClickSchedule }) {
  // 그룹핑: 파트타이머 기준으로 묶기
  const grouped = schedules.reduce((acc, item) => {
    const key = item.partTimerId;
    if (!acc[key]) acc[key] = {
      partTimerId: key,
      partName: item.title,
      partImg: item.partImg,
      scheduleMap: {}
    };
    const dateKey = new Date(item.startDate).toISOString().split('T')[0];
    acc[key].scheduleMap[dateKey] = item;
    return acc;
  }, {});

  const partTimerList = Object.values(grouped);

  return (
    <GridWrapper>
      {/* 요일 헤더 */}
      <HeaderRow>
        <div></div>
        {weekDates.map(date => (
          <div key={date.toISOString()}>{daysKor[date.getDay()]}</div>
        ))}
      </HeaderRow>

      {/* 직원별 줄 */}
      {partTimerList.map((pt, idx) => (
        <Row key={pt.partTimerId}>
          <AvatarWrap>
            <Avatar src={pt.partImg} alt="avatar" />
            <Name>{pt.partName}</Name>
          </AvatarWrap>
          {weekDates.map(date => {
            const dateKey = date.toISOString().split('T')[0];
            const sch = pt.scheduleMap[dateKey];
            return (
              <Cell key={dateKey}>
                {sch && (
                  <ScheduleBar
                    bgColor={sch.bgColor}
                    onClick={() => onClickSchedule?.({
                      id: sch.scheduleId || sch.id,
                      title: sch.title,
                      partTimerId: sch.partTimerId,
                      start: `${sch.startDate}T${sch.startTime}`,
                      end: `${sch.endDate}T${sch.endTime}`,
                      bgColor: sch.bgColor,
                      partImg: sch.partImg || ''
                    })}
                  >
                    {sch.startTime} ~ {sch.endTime}
                  </ScheduleBar>
                )}
              </Cell>
            );
          })}
        </Row>
      ))}
    </GridWrapper>
  );
}

export default PartTimerWeekGridCom;