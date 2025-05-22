import React, { useEffect, useState } from 'react';
import { ModalWrapper } from '../../../../features/store/styles/partTimerSchedule/PartTimerSchedule.styled';
import { fetchAllPartTimers } from '../../../../service/store/PartTimeService';
import { Autocomplete, TextField, Avatar, Box } from '@mui/material';
import { PrimaryButton, ButtonRow } from '../../../../features/store/styles/common/Button.styled';

function PartTimerRegisterModal({ onClose, onSubmit, initialDate, colorOptions }) {
    const [partTimers, setPartTimers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [startTime, setStartTime] = useState(`${initialDate}T09:00`);
    const [endTime, setEndTime] = useState(`${initialDate}T18:00`);
    const [bgColor, setBgColor] = useState('#03bd9e');

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
        <ModalWrapper style={{ padding: '32px 40px', width: '600px', minHeight: '500px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>스케줄 등록</h3>

            {/* 색상 선택 */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>색상 선택</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
            </div>

            {/* 이름 선택 */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>이름</label>
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
                    renderInput={(params) => <TextField {...params} label="파트타이머 선택" fullWidth />}
                />
            </div>

            {/* 시간 입력 */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>시작 시간</label>
                <TextField
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    fullWidth
                />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>종료 시간</label>
                <TextField
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    fullWidth
                />
            </div>

            {/* 버튼 */}
            <ButtonRow style={{ justifyContent: 'center' }}>
                <PrimaryButton onClick={onClose}>취소</PrimaryButton>
                <PrimaryButton onClick={handleSubmit}>등록</PrimaryButton>
            </ButtonRow>
        </ModalWrapper>
    );
}

export default PartTimerRegisterModal;