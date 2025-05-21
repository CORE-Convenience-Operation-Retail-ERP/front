import React, { useEffect, useState } from 'react';
import { ModalWrapper } from '../../../../features/store/styles/partTimerSchedule/PartTimerSchedule.styled';
import { fetchAllPartTimers } from '../../../../service/store/PartTimeService';
import { Autocomplete, TextField, Avatar, Box } from '@mui/material';

function PartTimerEditModal({ onClose, onUpdate, onDelete, schedule, colorOptions = [] }) {
    const [partTimers, setPartTimers] = useState([]);
    const [form, setForm] = useState({
        selected: null,
        startTime: schedule.start,
        endTime: schedule.end,
        bgColor: schedule.bgColor || '#03bd9e'
    });

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchAllPartTimers();
                setPartTimers(data);
                const current = data.find(pt => pt.partName === schedule.title);
                setForm((prev) => ({ ...prev, selected: current }));
            } catch (e) {
                alert('파트타이머 목록 로딩 실패');
            }
        };
        load();
    }, [schedule.title]);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleUpdate = () => {
        if (!form.selected) return alert('수정할 파트타이머를 선택하세요');
        onUpdate({
            id: schedule.id,
            title: form.selected.partName,
            partTimerId: form.selected.partTimerId,
            start: form.startTime,
            end: form.endTime,
            bgColor: form.bgColor
        });
    };

    return (
        <ModalWrapper>
            <h3>스케줄 수정</h3>

            <label>이름</label>
            <Autocomplete
                options={partTimers}
                getOptionLabel={(option) => option.partName || ''}
                value={form.selected}
                onChange={(e, newValue) => handleChange('selected', newValue)}
                renderOption={(props, option) => (
                    <Box component="li" {...props}>
                        <Avatar src={option.partImg} alt="" sx={{ width: 24, height: 24, mr: 1 }} />
                        {option.partName}
                    </Box>
                )}
                renderInput={(params) => <TextField {...params} label="파트타이머 선택" />}
            />

            <label>시작</label>
            <input
                type="datetime-local"
                value={form.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
            />
            <label>종료</label>
            <input
                type="datetime-local"
                value={form.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
            />

            <label>색상</label>
            <div style={{ display: 'flex', gap: '0.5rem', margin: '0.5rem 0' }}>
                {colorOptions.map((color) => (
                    <div
                        key={color}
                        onClick={() => handleChange('bgColor', color)}
                        style={{
                            width: 24,
                            height: 24,
                            backgroundColor: color,
                            borderRadius: '50%',
                            cursor: 'pointer',
                            border: form.bgColor === color ? '2px solid black' : '1px solid #ccc'
                        }}
                    />
                ))}
            </div>

            <div className="btn-wrap">
                <button onClick={handleUpdate}>수정</button>
                <button onClick={() => onDelete(schedule.id)}>삭제</button>
                <button onClick={onClose}>취소</button>
            </div>
        </ModalWrapper>
    );
}

export default PartTimerEditModal;