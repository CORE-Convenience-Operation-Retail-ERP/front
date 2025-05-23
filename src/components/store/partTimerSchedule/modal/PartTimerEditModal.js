import React, { useEffect, useState } from 'react';
import { ModalWrapper } from '../../../../features/store/styles/partTimerSchedule/PartTimerSchedule.styled';
import { fetchAllPartTimers } from '../../../../service/store/PartTimeService';
import { Autocomplete, TextField, Avatar, Box, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { PrimaryButton, DangerButton, ButtonRow } from "../../../../features/store/styles/common/Button.styled";


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
            startTime: form.startTime,
            endTime: form.endTime,
            bgColor: form.bgColor
        });
    };

    return (
        <ModalWrapper style={{ padding: '32px 40px', width: '600px', minHeight: '500px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>스케줄 수정</h3>

            {/* 색상 선택 위로 이동 */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>색상</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
            </div>

            {/* 파트타이머 선택 */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>이름</label>
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
                    renderInput={(params) => <TextField {...params} label="파트타이머 선택" fullWidth />}
                />
            </div>

            {/* 시간 선택 */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>시작 시간</label>
                    <DateTimePicker
                        value={dayjs(form.startTime)}
                        onChange={(v) => handleChange('startTime', v.format('YYYY-MM-DDTHH:mm'))}
                        minutesStep={30}
                        ampm={false}
                        format="YYYY-MM-DD HH:mm"
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>종료 시간</label>
                    <DateTimePicker
                        value={dayjs(form.endTime)}
                        onChange={(v) => handleChange('endTime', v.format('YYYY-MM-DDTHH:mm'))}
                        minutesStep={30}
                        ampm={false}
                        format="YYYY-MM-DD HH:mm"
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </div>
            </LocalizationProvider>

            {/* 버튼 영역 */}
            <ButtonRow style={{ justifyContent: "center" }}>
                <DangerButton type="button" onClick={() => onDelete(schedule.id)}>
                    삭제
                </DangerButton>
                <PrimaryButton type="button" onClick={onClose}>
                    취소
                </PrimaryButton>
                <PrimaryButton onClick={handleUpdate}>
                    수정
                </PrimaryButton>
            </ButtonRow>

        </ModalWrapper>
    );
}

export default PartTimerEditModal;
