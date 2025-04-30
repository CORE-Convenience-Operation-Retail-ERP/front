import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import axios from '../../../service/axiosInstance';

const CalendarWrapper = styled.div`
  .react-calendar {
    border: none;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    padding: 10px;
    width: 280px;
  }
`;

const CalendarBox = () => {
    const [value, setValue] = useState(new Date());
    const [orders, setOrders] = useState([]);
    const [shifts, setShifts] = useState([]);
  
    useEffect(() => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        axios.get('/api/purchase-orders', { headers })
            .then((res) => setOrders(res.data))
            .catch((err) => console.error('발주 조회 실패', err));

        axios.get('/api/shift-schedules', { headers })
            .then((res) => setShifts(res.data))
            .catch((err) => console.error('근무 조회 실패', err));
    }, []);
  

    const toDateStr = (date) => new Date(date).toLocaleDateString('sv-SE');
    const selectedDateStr = toDateStr(value);


    const filtered = orders.filter((o) =>
        toDateStr(o.order_date) === selectedDateStr
    );

    const filteredShifts = shifts.filter((s) =>
        toDateStr(s.work_date) === selectedDateStr
    );

    console.log("선택한 날짜:", selectedDateStr);
    orders.forEach(o => {
        console.log("order_date:", o.order_date, "→ 비교용:", toDateStr(o.order_date), "일치:", toDateStr(o.order_date) === selectedDateStr);
    });
  
    const statusMap = {
      1: '발주 완료',
      2: '발주 취소',
      3: '입고 대기',
      4: '입고 완료',
    };
  
    return (
      <CalendarWrapper>
        <Calendar value={value} onChange={setValue} locale="ko-KR" />
        <h4 style={{ marginTop: '10px' }}>📦 발주 일정</h4>
        <ul style={{ fontSize: '13px', paddingLeft: '18px' }}>
          {filtered.length === 0
            ? <li>발주 없음</li>
            : filtered.map((o) => (
                <li key={o.order_id}>
                  [{statusMap[o.order_status]}] #{o.order_id}번, {o.total_amount.toLocaleString()}원
                </li>
              ))}
        </ul>

        <h4 style={{ marginTop: '10px' }}>👥 근무자 일정</h4>
      <ul style={{ fontSize: '13px', paddingLeft: '18px' }}>
        {filteredShifts.length === 0 ? (
          <li>근무 없음</li>
        ) : (
          filteredShifts.map((s) => (
            <li key={s.schedule_id}>
              {s.part_name}님 ({s.start_time.slice(11, 16)} ~ {s.end_time.slice(11, 16)})
            </li>
          ))
        )}
      </ul>
      </CalendarWrapper>
    );
  };
  
  export default CalendarBox;
