import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from 'react';
import PartTimerUpdateCom from "../../../components/store/partTimer/PartTimerUpdateCom";
import QRAuthModal from "../../../components/store/partTimer/QrAuthModal";
import { fetchPartTimerById, updatePartTimer } from "../../../service/store/PartTimeService";
import { fetchVerifiedDevice } from "../../../service/store/SmsService";

function PartTimerUpdateCon() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [originalPhone, setOriginalPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const inputRefs = {
    partPhone: useRef()
  };

  //  1. 데이터 로딩
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPartTimerById(id);
        setForm(data);
        setOriginalPhone(data.partPhone); //  초기 전화번호 저장
        setLoading(false);
      } catch {
        alert('데이터를 불러오지 못했습니다.');
        navigate('/store/parttimer/list');
      }
    };
    load();
  }, [id, navigate]);

  //  2. 전화번호 변경 시만 기기 인증 체크
  useEffect(() => {
    const checkDevice = async () => {
      if (!form?.partPhone || form.partPhone === originalPhone) {
        //  전화번호 변경 없으면 인증 true 고정
        setVerified(true);
        return;
      }

      try {
        const { verified: ok, deviceId, deviceName } = await fetchVerifiedDevice(form.partPhone);
        setVerified(ok);
        setForm(prev => ({
          ...prev,
          deviceId: ok ? deviceId : '',
          deviceName: ok ? deviceName : ''
        }));
      } catch (e) {
        console.warn("기기 인증 확인 실패", e);
        setVerified(false);
      }
    };

    checkDevice();
  }, [form?.partPhone, originalPhone]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'file' ? files[0] : value
    }));
  };

  const handleDateChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
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
  const phoneChanged = form.partPhone !== originalPhone;

  if (phoneChanged && (!verified || !form.deviceId)) {
    alert("전화번호가 변경되었습니다. 기기 인증을 완료해주세요.");
    return;
  }

  try {
    if (phoneChanged) {
      const { verified: recheck } = await fetchVerifiedDevice(form.partPhone);
      if (!recheck) {
        alert("기기 인증이 유효하지 않습니다. 다시 인증해주세요.");
        return;
      }
    }

    const parseDate = (value) => {
      const d = new Date(value);
      return !isNaN(d.getTime()) ? d : null;
    };

    const birthDate = parseDate(form.birthDate)
      ? new Date(form.birthDate).toISOString().split('T')[0]
      : '';

    const hireDate = parseDate(form.hireDate)
      ? new Date(form.hireDate).toISOString().slice(0, 19)
      : '';

    const updatedForm = {
      ...form,
      birthDate,
      hireDate
    };

    const formData = new FormData();
    Object.entries(updatedForm).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value);
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
    <>
      <PartTimerUpdateCom
        form={form}
        verified={verified}
        onChange={handleChange}
        onDateChange={handleDateChange}
        onSubmit={handleSubmit}
        onOpenQrAuth={handleOpenQrAuth}
        inputRefs={inputRefs}
        originalPhone={originalPhone}
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

export default PartTimerUpdateCon;
