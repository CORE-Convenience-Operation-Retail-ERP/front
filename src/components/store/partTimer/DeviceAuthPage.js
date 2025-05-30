import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { sendVerificationCode, verifyDevice } from '../../../service/store/SmsService';
import { v4 as uuidv4 } from 'uuid';

function DeviceAuthPage() {
    const [searchParams] = useSearchParams();
    const phone = searchParams.get('phone');
    const redirect = searchParams.get('redirect') || '/'; // 기본값

    const [code, setCode] = useState('');
    const [verified, setVerified] = useState(false);
    const [deviceId] = useState(uuidv4());
    const [deviceName] = useState(navigator.userAgent);

    useEffect(() => {
        if (phone) {
            sendVerificationCode(phone)
                .then(() => alert("인증번호 전송됨"))
                .catch(() => alert("전송 실패"));
        }
    }, [phone]);

    const handleVerify = async () => {
        try {
            await verifyDevice({ phone, code, deviceId, deviceName });
            setVerified(true);
            alert("기기 인증 완료");

            setTimeout(() => {
                window.location.href = redirect;
            }, 1500);
        } catch (err) {
            alert("인증 실패: " + (err.response?.data || '서버 오류'));
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <h2>기기 인증</h2>
            <p>전화번호: {phone}</p>
            <input
                placeholder="인증번호 입력"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            <button onClick={handleVerify}>인증하기</button>
            {verified && <p style={{ color: 'green' }}> 인증 완료</p>}
        </div>
    );
}
