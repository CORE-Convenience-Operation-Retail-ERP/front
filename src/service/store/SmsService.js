import axios from '../axiosInstance';

export const sendVerificationCode = async (phone) => {
    const res = await axios.post('/api/store/parttimer/send-code', { phone });
    return res.data;
};

export const verifyDevice = async ({ phone, code, deviceId, deviceName }) => {
    const res = await axios.post('/api/store/parttimer/verify-device', {
        phone,
        code,
        deviceId,
        deviceName,
    });
    return res.data;
};

export const isDeviceVerified = async (phone, deviceId) => {
    const res = await axios.get('/api/store/parttimer/is-verified', {
        params: { phone, deviceId },
    });
    return res.data.verified;
};

export const fetchVerifiedDevice = async (phone) => {
  const res = await axios.get(`/api/store/parttimer/verified-device`, {
    params: { phone }
  });
  return res.data;
};

