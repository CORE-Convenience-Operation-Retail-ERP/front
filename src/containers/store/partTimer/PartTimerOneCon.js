import PartTimerOneCom from "../../../components/store/partTimer/PartTimerOneCom";
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchPartTimerById,
  updatePartTimer
} from '../../../service/store/PartTimeService.js';
const now = new Date();
const offsetMs = now.getTimezoneOffset() * 60000;  
const localTime = new Date(now.getTime() - offsetMs); 

function PartTimerOneCon(){
    const { id } = useParams();
    const navigate = useNavigate();
  
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
      const fetchDetail = async () => {
        try {
          console.log("요청하는 아르바이트 ID:", id);
          const data = await fetchPartTimerById(id);
          setForm(data);
          setLoading(false);
        } catch (err) {
          alert('상세 정보를 불러오지 못했습니다.');
          navigate('/store/parttimer/list');
        }
      };
      fetchDetail();
    }, [id, navigate]);
  
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

    
  
    const handleResign = async () => {   
      if (!window.confirm('퇴사 처리하시겠습니까?')) return;
    
      try {
        const resignDateFormatted = localTime.toISOString().slice(0, 19); // yyyy-MM-ddTHH:mm:ss
    
        const updated = {
          ...form,
          partStatus: 0,
          resignDate: resignDateFormatted,
        };
    
        const formData = new FormData();
        Object.entries(updated).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            formData.append(key, value instanceof Date ? value.toISOString() : value);
          }
        });
    
        await updatePartTimer(id, formData);
        alert('퇴사 처리 완료');
        navigate('/store/parttimer/list');
      } catch (err) {
        alert('퇴사 처리 실패');
        console.error(err);
      }
    };

    const handleRejoin = async () => {
      if (!window.confirm('재직 상태로 복귀하시겠습니까?')) return;
    
      try {
        const resignDateFormatted = null;
    
        const updated = {
          ...form,
          partStatus: 1,      
          resignDate: resignDateFormatted, 
        };
    
        const formData = new FormData();
        Object.entries(updated).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            formData.append(key, value instanceof Date ? value.toISOString() : value);
          }
        });
    
        await updatePartTimer(id, formData);
        alert('재직 상태로 변경되었습니다.');
        navigate('/store/parttimer/list');
      } catch (err) {
        alert('재직 처리 실패');
        console.error(err);
      }
    };
    
  
    const goToEditPage = () => {
      navigate(`/store/parttimer/${id}/edit`);
    };
  
    if (loading || !form) return <p>불러오는 중...</p>;
  
    return(
    <>
    <PartTimerOneCom
     form={form}
     onChange={handleChange}
     onDateChange={handleDateChange}
     onResign={handleResign}
     onRejoin={handleRejoin}
     onEdit={goToEditPage}/>
    </>
    )
}
export default PartTimerOneCon