import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import PartTimerRegisterCom from "../../../components/store/partTimer/PartTimerRegisterCom";
import {createPartTimer} from "../../../service/store/PartTimeService";

function ParttimerRegisterCon() {
    const today = new Date();
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
        partImg: ''
    });

    const navigate = useNavigate();

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

    const handleSubmit = async () => {
        try {
            const formData = new FormData();

            const birthDateFormatted = form.birthDate
                ? form.birthDate.toISOString().split('T')[0] // yyyy-MM-dd
                : null;

            const hireDateFormatted = form.hireDate
                ? form.hireDate.toISOString().slice(0, 19)   // yyyy-MM-ddTHH:mm:ss
                : null;

            const updatedForm = {
                ...form,
                birthDate: birthDateFormatted,
                hireDate: hireDateFormatted
            };

            Object.entries(updatedForm).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    formData.append(key, value instanceof Date ? value.toISOString() : value);
                }
            });

            console.log("📦 전송 데이터:", [...formData.entries()]);
            await createPartTimer(formData); // ✅ 여기서 service 호출

            alert('아르바이트 등록 완료');
            navigate('/store/parttimer/list');
        } catch (error) {
            console.error('등록 실패:', error.response?.data || error);
            alert('등록 실패');
        }
    };

    return (
        <PartTimerRegisterCom
            form={form}
            onChange={handleChange}
            onDateChange={handleDateChange}
            onSubmit={handleSubmit}
        />
    );
}

export default ParttimerRegisterCon;
