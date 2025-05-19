import PartTimerUpdateCom from "../../../components/store/partTimer/PartTimerUpdateCom";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { fetchPartTimerById, updatePartTimer  } from '../../../service/store/PartTimeService';
import { sendVerificationCode, verifyDevice  } from '../../../service/store/SmsService';

function PartTimerUpdateCon() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialPhone, setInitialPhone] = useState('');

  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);
  const [phoneChanged, setPhoneChanged] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchPartTimerById(id);
        setForm(data);
        setInitialPhone(data.partPhone);  // 초기 전화번호 저장
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
      setForm(prev => {
        const updated = { ...prev, [name]: value };

        if (name === 'partPhone') {
          setPhoneChanged(value !== initialPhone);  // 변경 감지
        }

        return updated;
      });
    }
  };


  const handleDateChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSendCode = async () => {
    try {
      await sendVerificationCode(form.partPhone);
      alert('인증번호 전송 완료');
    } catch (err) {
      alert('인증번호 전송 실패');
    }
  };

  const handleVerifyCode = async () => {
    try {
      await verifyDevice({ phone: form.partPhone, code });
      alert('인증 성공');
      setVerified(true);
    } catch (err) {
      alert('인증 실패: ' + (err.response?.data || '서버 오류'));
    }
  };

  const handleSubmit = async () => {
    const phoneChanged = form.partPhone !== initialPhone;
    if (phoneChanged && !verified) {
      alert('전화번호를 변경한 경우 기기 인증이 필요합니다.');
      return;
    }

    try {
      const formData = new FormData();

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

  return (
      <PartTimerUpdateCom
          form={form}
          onChange={handleChange}
          onDateChange={handleDateChange}
          onSubmit={handleSubmit}
          code={code}
          onCodeChange={(e) => setCode(e.target.value)}
          onSendCode={handleSendCode}
          onVerifyCode={handleVerifyCode}
          verified={verified}
          showVerification={form.partPhone !== initialPhone}
      />
  );
}

export default PartTimerUpdateCon;