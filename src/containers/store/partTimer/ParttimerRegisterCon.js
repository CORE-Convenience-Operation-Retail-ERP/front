import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import PartTimerRegisterCom from "../../../components/store/partTimer/PartTimerRegisterCom";
import QRAuthModal from "../../../components/store/partTimer/QrAuthModal";
import { createPartTimer } from "../../../service/store/PartTimeService";
import { fetchVerifiedDevice } from "../../../service/store/SmsService";

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

    // ✅ 전화번호 변경 시 서버에 인증된 디바이스 정보 조회
    useEffect(() => {
        const fetchDevice = async () => {
            if (!form.partPhone) {
                setVerified(false);
                setForm(prev => ({
                    ...prev,
                    deviceId: '',
                    deviceName: ''
                }));
                return;
            }

            try {
                const { verified, deviceId, deviceName } = await fetchVerifiedDevice(form.partPhone);
                setVerified(verified);
                setForm(prev => ({
                    ...prev,
                    deviceId: verified ? deviceId : '',
                    deviceName: verified ? deviceName : ''
                }));
            } catch (err) {
                console.error("기기 인증 조회 실패", err);
                setVerified(false);
            }
        };

        fetchDevice();
    }, [form.partPhone]);

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
        setQrModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!verified || !form.deviceId) {
            alert("기기 인증을 먼저 완료해주세요.");
            return;
        }

        try {
            // 재확인 (혹시 모를 인증 취소 대비)
            const { verified: reVerified } = await fetchVerifiedDevice(form.partPhone);
            if (!reVerified) {
                alert("기기 인증이 유효하지 않습니다. 다시 인증해주세요.");
                return;
            }
        } catch (err) {
            alert("기기 인증 확인 중 오류가 발생했습니다.");
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
            alert('아르바이트 등록 완료');
            navigate('/store/parttimer/list');
        } catch (error) {
            alert('등록 실패');
        }
    };

    const handleBack = () => navigate(-1);

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
                onBack={handleBack}
            />

            {qrModalOpen && (
                <QRAuthModal
                    isOpen={qrModalOpen}
                    onClose={() => setQrModalOpen(false)}
                    phone={form.partPhone}
                />
            )}
        </>
    );
}

export default ParttimerRegisterCon;