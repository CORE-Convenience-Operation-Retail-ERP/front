import PartTimerUpdateCom from "../../../components/store/partTimer/PartTimerUpdateCom"
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPartTimerById, updatePartTimer } from '../../../service/store/PartTimeService';

function PartTimerUpdateCon(){

  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchPartTimerById(id);
        setForm(data);
        setLoading(false);
      } catch (err) {
        alert('데이터를 불러오는 데 실패했습니다.');
        navigate('/store/parttimer/list');
      }
    };
    loadData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setForm(prev => ({ ...prev, file: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
  
      // 날짜 포맷 처리 (
      const birthDateFormatted = form.birthDate
        ? new Date(form.birthDate).toISOString().split('T')[0] 
        : null;
  
      const hireDateFormatted = form.hireDate
        ? new Date(form.hireDate).toISOString().slice(0, 19) 
        : null;
  
      const updatedForm = {
        ...form,
        birthDate: birthDateFormatted,
        hireDate: hireDateFormatted,
      };
  
      Object.entries(updatedForm).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formData.append(key, value instanceof Date ? value.toISOString() : value);
        }
      });
  
      await updatePartTimer(id, formData);
      alert('수정 완료');
      navigate('/store/parttimer/list');
    } catch (err) {
      alert('수정 실패');
      console.error(err);
    }
  };

  if (loading || !form) return <p>불러오는 중...</p>;

    return(
        <>
        <PartTimerUpdateCom
        form={form}
        onChange={handleChange}
        onDateChange={handleDateChange}
        onSubmit={handleSubmit}
        />
        </>
    )
}
export default PartTimerUpdateCon