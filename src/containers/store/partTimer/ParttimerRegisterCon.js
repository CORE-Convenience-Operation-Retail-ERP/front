import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PartTimerRegisterCom from "../../../components/store/partTimer/PartTimerRegisterCom";
import QRAuthModal from "../../../components/store/partTimer/QrAuthModal";
import { createPartTimer } from "../../../service/store/PartTimeService";

function ParttimerRegisterCon() {
    const navigate = useNavigate();
    const location = useLocation();

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

    const inputRefs = {
        partName: useRef(),
        position: useRef(),
        partPhone: useRef(),
        workType: useRef(),
        partGender: useRef(),
        partAddress: useRef(),
        birthDate: useRef(),
        hireDate: useRef(),
        salaryType: useRef(),
        accountBank: useRef(),
        accountNumber: useRef()
    };

    const [verified, setVerified] = useState(false);
    const [qrModalOpen, setQrModalOpen] = useState(false);

    useEffect(() => {
        setForm(prev => ({
            ...prev,
            deviceId: uuidv4(),
            deviceName: navigator.userAgent
        }));
    }, []);

    useEffect(() => {
        const isVerified = sessionStorage.getItem("verified");
        if (isVerified === "true") setVerified(true);
    }, [location]);

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

    const handleOpenQrAuth = () => {
        if (!form.partPhone) {
            alert("전화번호를 입력해주세요.");
            inputRefs.partPhone.current?.focus();
            return;
        }
        console.log("모달 열기");
        setQrModalOpen(true);
    };


    const handleSubmit = async () => {
        if (!verified) {
            alert("기기 인증을 먼저 완료해주세요.");
            return;
        }

        const requiredFields = [
            { key: 'partName', label: '이름' },
            { key: 'position', label: '직책' },
            { key: 'partPhone', label: '전화번호' },
            { key: 'workType', label: '근무유형' },
            { key: 'partGender', label: '성별' },
            { key: 'partAddress', label: '주소' },
            { key: 'birthDate', label: '생년월일' },
            { key: 'hireDate', label: '입사일' },
            { key: 'salaryType', label: '급여유형' },
            { key: 'accountBank', label: '은행명' },
            { key: 'accountNumber', label: '계좌번호' },
        ];

        for (let field of requiredFields) {
            if (!form[field.key]) {
                alert(`필수 항목 [${field.label}]을(를) 입력해주세요.`);
                inputRefs[field.key]?.current?.focus();
                return;
            }
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
            sessionStorage.removeItem("verified");
            alert('아르바이트 등록 완료');
            navigate('/store/parttimer/list');
        } catch (error) {
            alert('등록 실패');
        }
    };

    return (
        <>
            <PartTimerRegisterCom
                form={form}
                verified={verified}
                onChange={handleChange}
                onDateChange={handleDateChange}
                onSubmit={handleSubmit}
                onOpenQrAuth={handleOpenQrAuth}
                inputRefs={inputRefs}
            />

            {qrModalOpen && (
                <QRAuthModal
                    isOpen={qrModalOpen}
                    onClose={() => setQrModalOpen(false)}
                    phone={form.partPhone}
                    deviceId={form.deviceId}
                    deviceName={form.deviceName}
                />
            )}
        </>
    );
}

export default ParttimerRegisterCon;
