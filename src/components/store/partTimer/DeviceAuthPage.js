import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { sendVerificationCode, verifyDevice } from '../../../service/store/SmsService';
import { v4 as uuidv4 } from 'uuid';

function DeviceAuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const phone = searchParams.get('phone');
  const redirect = searchParams.get('redirect') || '/';
  const hasSent = useRef(false);

  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(60);

  const [deviceId] = useState(() => {
    const stored = localStorage.getItem('deviceId');
    if (stored) return stored;
    const newId = uuidv4();
    localStorage.setItem('deviceId', newId);
    return newId;
  });
  const [deviceName] = useState(navigator.userAgent);

  useEffect(() => {
    if (phone && !hasSent.current) {
      hasSent.current = true;
      sendCode();
    }
  }, [phone]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const sendCode = async () => {
    try {
      await sendVerificationCode(phone);
      setMessage(" 인증번호가 전송되었습니다.");
      setResendCooldown(60);
    } catch {
      setMessage(" 인증번호 전송에 실패했습니다.");
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setMessage('');
    try {
      await verifyDevice({ phone, code, deviceId, deviceName });
      setVerified(true);
      setMessage(" 기기 인증이 완료되었습니다.");

      sessionStorage.setItem("verified", "true");
      localStorage.setItem('deviceName', deviceName);
      localStorage.setItem('verifiedPhone', phone);
      localStorage.setItem('authTime', Date.now().toString());

      setTimeout(() => navigate(redirect), 1500);
    } catch {
      setMessage("❌ 인증 실패. 인증번호를 다시 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (!phone) {
    return <p style={{ textAlign: 'center', marginTop: '30vh' }}>잘못된 접근입니다. 전화번호가 없습니다.</p>;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>기기 인증</h2>
        <p style={styles.subtitle}>등록된 전화번호로 인증번호를 입력해주세요.</p>

        <div style={styles.field}>
          <label style={styles.label}>전화번호</label>
          <div style={styles.valueBox}>{phone}</div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>인증번호</label>
          <input
            type="text"
            maxLength={6}
            inputMode="numeric"
            style={styles.input}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={loading || verified} 
          />
        </div>

        <div style={styles.buttonRow}>
          <button
            style={{
              ...styles.button,
              backgroundColor: verified ? '#28a745' : '#007bff',
            }}
            onClick={handleVerify}
            disabled={loading || verified || !code}
          >
            {loading ? '인증 중...' : verified ? '인증 완료' : '인증하기'}
          </button>

          <button
            style={{
              ...styles.button,
              backgroundColor: '#6c757d',
            }}
            onClick={sendCode}
            disabled={resendCooldown > 0}
          >
            {resendCooldown > 0 ? `재전송 (${resendCooldown})` : '재전송'}
          </button>
        </div>

        {message && (
          <p style={{
            marginTop: 16,
            color: verified ? 'green' : 'red',
            fontWeight: 'bold',
            fontSize: 14,
            textAlign: 'center',
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    padding: '0 16px',
    backgroundColor: '#f5f6fa',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  title: {
    marginBottom: 8,
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: 24,
    fontSize: 14,
    color: '#666',
  },
  field: {
    marginBottom: 16,
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: 4,
    fontSize: 13,
    color: '#333',
  },
  valueBox: {
    padding: '10px 12px',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    fontSize: 15,
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: 16,
    borderRadius: 8,
    border: '1px solid #ccc',
    outline: 'none',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: '12px 0',
    fontSize: 16,
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
  },
};

export default DeviceAuthPage;