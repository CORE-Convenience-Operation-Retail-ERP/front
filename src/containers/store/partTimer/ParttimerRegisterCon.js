import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PartTimerRegisterCom from "../../../components/store/partTimer/PartTimerRegisterCom";
import { createPartTimer } from "../../../service/store/PartTimeService";
import { sendVerificationCode, verifyDevice } from "../../../service/store/SmsService";

function ParttimerRegisterCon() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        partName: '',
        position: '',
        partPhone: '',
        workType: '',
        partGender: '',
        partAddress: '',
        birthDate: null,
        hireDate: null,
        salaryType: '',
        hourlyWage: '',
        accountBank: '',
        accountNumber: '',
        file: null,
        partImg: '',
        deviceId: '',
        deviceName: ''
    });

    const [code, setCode] = useState('');
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        setForm(prev => ({
            ...prev,
            deviceId: uuidv4(),
            deviceName: navigator.userAgent
        }));
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'file') {
            setForm({ ...form, file: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleDateChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleSendCode = async () => {
        try {
            await sendVerificationCode(form.partPhone);
            alert("인증번호가 전송되었습니다.");
        } catch (err) {
            alert("인증번호 전송 실패");
        }
    };

    const handleVerifyCode = async () => {
        try {
            await verifyDevice({
                phone: form.partPhone,
                code,
                deviceId: form.deviceId,
                deviceName: form.deviceName
            });
            setVerified(true);
            alert("기기 인증 및 저장 완료");
        } catch (err) {
            alert("인증 실패: " + (err.response?.data || '서버 오류'));
        }
    };

    const handleSubmit = async () => {
        if (!verified) {
            alert("먼저 기기 인증을 완료해 주세요.");
            return;
        }

        try {
            const formData = new FormData();
            const birthDateFormatted = form.birthDate?.toISOString().split('T')[0];
            const hireDateFormatted = form.hireDate?.toISOString().slice(0, 19);

            const updatedForm = {
                ...form,
                birthDate: birthDateFormatted,
                hireDate: hireDateFormatted
            };

            Object.entries(updatedForm).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    formData.append(key, value);
                }
            });

            await createPartTimer(formData);
            alert('아르바이트 등록 완료');
            navigate('/store/parttimer/list');
        } catch (error) {
            alert('등록 실패');
        }
    };

    return (
        <PartTimerRegisterCom
            form={form}
            code={code}
            verified={verified}
            onChange={handleChange}
            onDateChange={handleDateChange}
            onSubmit={handleSubmit}
            onSendCode={handleSendCode}
            onVerifyCode={handleVerifyCode}
            onCodeChange={(e) => setCode(e.target.value)}
        />
    );
}

export default ParttimerRegisterCon;