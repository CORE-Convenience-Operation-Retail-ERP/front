import Calendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import { ScheduleWrapper } from '../../../../features/store/styles/partTimerSchedule/PartTimerSchedule.styled';

function PartTimerMonthCom({ calendarRef, schedules, onClickSchedule, onSelectDateTime }) {
  return (
    <ScheduleWrapper>
      <Calendar
        ref={calendarRef}
        height="850px"
        view="month"
        usageStatistics={false}
        isReadOnly={false}
        events={schedules}
        useDetailPopup={false}
        useFormPopup={false}
        calendars={[{
          id: '1',
          name: '근무',
          backgroundColor: '#03bd9e',
        }]}
        month={{
          visibleWeeksCount: 6,
          isAlways6Weeks: false,
          startDayOfWeek: 0,
          narrowWeekend: true,
        }}
        template={{
          monthDayName: (dayname) => `<span class="calendar-day-name">${dayname.label}</span>`,
        }}
        onClickSchedule={onClickSchedule}
        onSelectDateTime={onSelectDateTime}
      />
    </ScheduleWrapper>
  );
}

export default PartTimerMonthCom;
