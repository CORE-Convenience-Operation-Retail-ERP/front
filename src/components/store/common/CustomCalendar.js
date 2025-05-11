// CustomCalendar.jsx
import React from 'react';
import useCalendarControl from '../../../containers/store/common/useCalendarControl';
import {
  CustomDateInput,
  CalendarHeaderWrap,
  MonthYearRow,
  MonthNav,
  YearNav,
  NavButton,
  NavSelect
} from '../../../features/store/styles/common/CustomCalendar.styled';

function CustomCalendar({
  selected,       // 단일 날짜일 때 Date 객체
  range,          // 범위일 때 [Date|null, Date|null]
  onChange,       // 단일 또는 [start, end] 반환
  placeholder,
  selectsRange = false
}) {
  const today = new Date();
  const {
    visibleMonth, visibleYear,
    showMonthDropdown, showYearDropdown,
    setShowMonthDropdown, setShowYearDropdown,
    handleMonthChange, handleYearChange
  } = useCalendarControl();

  return (
    <CustomDateInput
      selected={   selectsRange ? null : selected}
      startDate={  selectsRange ? range[0] : null}
      endDate={    selectsRange ? range[1] : null}
      onChange={onChange}
      selectsRange={selectsRange}
      placeholderText={placeholder}
      dateFormat="yyyy-MM-dd"
      maxDate={today}
      fixedHeight
      showOutsideDays
      renderCustomHeader={({ date, decreaseMonth, increaseMonth, changeYear, changeMonth }) => (
        <CalendarHeaderWrap>
            <MonthYearRow>
                <MonthNav>
                    <NavButton onClick={decreaseMonth}>{'<'}</NavButton>
                    {showMonthDropdown ? (
                        <NavSelect value={visibleMonth} onChange={(e) => { handleMonthChange(e); changeMonth(Number(e.target.value)); }}>
                            {[...Array(12)].map((_, i) => (
                                <option key={i} value={i}>
                                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </NavSelect>
                    ) : (
                        <span onClick={() => setShowMonthDropdown(true)}>
          {date.toLocaleString('default', { month: 'long' })}
        </span>
                    )}
                    <NavButton onClick={increaseMonth}>{'>'}</NavButton>
                </MonthNav>

                <YearNav>
                    <NavButton onClick={() => changeYear(date.getFullYear() - 1)}>{'<'}</NavButton>
                    {showYearDropdown ? (
                        <NavSelect value={visibleYear} onChange={(e) => { handleYearChange(e); changeYear(Number(e.target.value)); }}>
                            {Array.from({ length: 30 }, (_, i) => (
                                <option key={i} value={today.getFullYear() - i}>
                                    {today.getFullYear() - i}
                                </option>
                            ))}
                        </NavSelect>
                    ) : (
                        <span onClick={() => setShowYearDropdown(true)}>{date.getFullYear()}</span>
                    )}
                    <NavButton onClick={() => changeYear(date.getFullYear() + 1)}>{'>'}</NavButton>
                </YearNav>
            </MonthYearRow>
        </CalendarHeaderWrap>
    )}
/>
 );
}

export default CustomCalendar;
