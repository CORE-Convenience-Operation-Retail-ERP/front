import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { sendVerificationCode, verifyDevice } from '../../../service/store/SmsService';
import { v4 as uuidv4 } from 'uuid';

function DeviceAuthPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const phone = searchParams.get('phone');
    const redirect = searchParams.get('redirect') || '/';

    const [code, setCode] = useState('');
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [deviceId] = useState(uuidv4());
    const [deviceName] = useState(navigator.userAgent);

    useEffect(() => {
        if (phone) {
            sendVerificationCode(phone)
                .then(() => setMessage("인증번호가 전송되었습니다."))
                .catch(() => setMessage("인증번호 전송 실패"));
        }
    }, [phone]);

    const handleVerify = async () => {
        setLoading(true);
        setMessage('');
        try {
            await verifyDevice({ phone, code, deviceId, deviceName });
            setVerified(true);
            setMessage("기기 인증 완료");

            //  기기 정보 localStorage에 저장
            localStorage.setItem('deviceId', deviceId);
            localStorage.setItem('deviceName', deviceName);
            localStorage.setItem('verifiedPhone', phone);
            localStorage.setItem('authTime', Date.now().toString());

            //  인증 후 리다이렉트
            setTimeout(() => {
                navigate(redirect);
            }, 1500);
        } catch (err) {
            setMessage("인증 실패: " + (err.response?.data || '서버 오류'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <h2>기기 인증</h2>
            <p>전화번호: {phone}</p>
            <input
                type="text"
                placeholder="인증번호 입력"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={loading || verified}
            />
            <button onClick={handleVerify} disabled={loading || verified}>
                {loading ? '인증 중...' : '인증하기'}
            </button>

            {message && <p style={{ color: verified ? 'green' : 'red' }}>{message}</p>}
        </div>
    );
}

export default DeviceAuthPage;