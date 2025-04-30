import PartTimerRegisterCom from "../../components/store/PartTimerRegisterCom";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import { useState } from 'react';


function ParttimerRegisterCon(){
    const [form, setForm] = useState({
        partName: '',
        position: '',
        partPhone: '',
        workType:'',
        partGender:'',
        partAddress:'',
        birthDate:'',
        hireDate:'',
        salaryType:'',
        hourlyWage:'',
        accountBank:'',
        accountNumber:'',
        file:null,
        partImg:''
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
            Object.entries(form).forEach(([key, value]) => {
                if (value !== null) formData.append(key, value);
            });

            await axios.post('/api/parttimer', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert('아르바이트 등록 완료');
            navigate('/parttimer/list');
        } catch (error) {
            console.error('등록 실패:', error);
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