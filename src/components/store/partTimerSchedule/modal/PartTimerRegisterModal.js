import React, { useEffect, useState } from 'react';
import { ModalWrapper } from '../../../../features/store/styles/partTimerSchedule/PartTimerSchedule.styled';
import { fetchAllPartTimers } from '../../../../service/store/PartTimeService';
import { Autocomplete, TextField, Avatar, Box } from '@mui/material';

function PartTimerRegisterModal({ onClose, onSubmit, initialDate, colorOptions }) {
    const [partTimers, setPartTimers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [startTime, setStartTime] = useState(`${initialDate}T09:00`);
    const [endTime, setEndTime] = useState(`${initialDate}T18:00`);
    const [bgColor, setBgColor] = useState('#03bd9e'); // 기본값 민트

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchAllPartTimers();
                setPartTimers(data);
            } catch (e) {
                alert('파트타이머 목록 로딩 실패');
            }
        };
        load();
    }, []);

    const handleSubmit = () => {
        if (!selected) return alert('이름을 선택하세요');
        onSubmit({
            title: selected.partName,
            partTimerId: selected.partTimerId,
            start: startTime,
            end: endTime,
            bgColor,
        });
    };

    return (
        <ModalWrapper>
            <h3>스케줄 등록</h3>

            <label>색상 선택</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                {colorOptions.map((color) => (
                    <div
                        key={color}
                        onClick={() => setBgColor(color)}
                        style={{
                            backgroundColor: color,
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: bgColor === color ? '3px solid black' : '1px solid gray',
                            cursor: 'pointer'
                        }}
                    />
                ))}
            </div>
            <label>이름</label>
            <Autocomplete
                options={partTimers}
                getOptionLabel={(option) => option.partName || ''}
                onChange={(e, newValue) => setSelected(newValue)}
                renderOption={(props, option) => (
                    <Box component="li" {...props}>
                        <Avatar src={option.partImg} alt="" sx={{ width: 24, height: 24, mr: 1 }} />
                        {option.partName}
                    </Box>
                )}
                renderInput={(params) => <TextField {...params} label="파트타이머 선택" />}
            />

            <label>시작</label>
            <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <label>종료</label>
            <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

            <div className="btn-wrap">
                <button onClick={handleSubmit}>등록</button>
                <button onClick={onClose}>취소</button>
            </div>
        </ModalWrapper>
    );
}

export default PartTimerRegisterModal;