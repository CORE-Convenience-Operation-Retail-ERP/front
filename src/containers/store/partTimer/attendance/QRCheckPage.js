import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { checkInPartTimer, checkOutPartTimer } from "../../../../service/store/AttendanceSerivce";

export default function QRCheckPage({ mode = "check-in" }) {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState(`🔄 ${mode === "check-in" ? "출근" : "퇴근"} 처리 중...`);

  useEffect(() => {
    const run = async () => {
      const scannedDeviceId = searchParams.get("deviceId");
      const storeId = searchParams.get("storeId");
      const actualDeviceId = localStorage.getItem("deviceId");

      if (!scannedDeviceId || !storeId || !actualDeviceId) {
        setMessage("❌ 필수 정보 누락 또는 본인 기기 아님");
        return;
      }

      if (scannedDeviceId !== actualDeviceId) {
        setMessage("❌ 다른 기기에서는 처리가 불가능합니다.");
        return;
      }

      try {
        const now = new Date().toISOString();
        const payload = {
          deviceId: actualDeviceId,
          storeId: parseInt(storeId),
          ...(mode === "check-in" ? { inTime: now } : { outTime: now })
        };

        const api = mode === "check-in" ? checkInPartTimer : checkOutPartTimer;
        const res = await api(payload);

        const resultMessage = mode === "check-in" ? `✅ 출근 성공: ${res.status}` : `✅ 퇴근 성공: ${res.message}`;
        setMessage(resultMessage);
      } catch (e) {
        const msg = e?.response?.data?.message || e.message;
        setMessage(`❌ ${mode === "check-in" ? "출근" : "퇴근"} 실패: ${msg}`);
      }
    };

    run();
  }, [mode, searchParams]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>📲 QR {mode === "check-in" ? "출근" : "퇴근"} 처리</h2>
      <p>{message}</p>
    </div>
  );
}
