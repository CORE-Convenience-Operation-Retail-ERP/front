import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { checkInPartTimer, checkOutPartTimer } from "../../../../service/store/AttendanceSerivce";

export default function QRCheckPage({ mode = "check-in" }) {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("pending"); // 'pending' | 'success' | 'error'
  const [message, setMessage] = useState(`🔄 ${mode === "check-in" ? "출근" : "퇴근"} 처리 중...`);
  const hasRunRef = useRef(false);

  const getNowKSTISOString = () => {
    const nowUtc = new Date();
    const nowKst = new Date(nowUtc.getTime() + 9 * 60 * 60 * 1000);
    return nowKst.toISOString();
  };

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const run = async () => {
      const scannedDeviceId = searchParams.get("deviceId");
      const storeId = searchParams.get("storeId");
      const actualDeviceId = localStorage.getItem("deviceId");

      if (!scannedDeviceId || !storeId || !actualDeviceId) {
        setStatus("error");
        setMessage("❌ 필수 정보 누락 또는 본인 기기가 아닙니다.");
        return;
      }

      if (scannedDeviceId !== actualDeviceId) {
        setStatus("error");
        setMessage("❌ 다른 기기에서는 처리가 불가능합니다.");
        return;
      }

      try {
        const now = getNowKSTISOString();
        const payload = {
          deviceId: actualDeviceId,
          storeId: parseInt(storeId),
          ...(mode === "check-in" ? { inTime: now } : { outTime: now }),
        };

        const api = mode === "check-in" ? checkInPartTimer : checkOutPartTimer;
        const res = await api(payload);

        const resultMsg = mode === "check-in"
          ? `✅ 출근 성공: ${res.status || "완료"}`
          : `✅ 퇴근 성공: ${res.message || "완료"}`;

        setStatus("success");
        setMessage(resultMsg);

        if (window.opener) {
          window.opener.postMessage({
            type: "ATTENDANCE_UPDATED",
            partTimerId: res.partTimerId,
            mode,
            isCheckedInToday: mode === "check-in",
          }, "*");
        }
      } catch (e) {
        const errMsg = e?.response?.data?.message || e.message || "처리 중 오류 발생";
        setStatus("error");
        setMessage(`❌ ${mode === "check-in" ? "출근" : "퇴근"} 실패: ${errMsg}`);
      }
    };

    run();
  }, [mode, searchParams]);

  const getMessageColor = () => {
    switch (status) {
      case "success":
        return "#28a745";
      case "error":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          📲 QR {mode === "check-in" ? "출근" : "퇴근"} 처리
        </h2>
        <p style={{ ...styles.message, color: getMessageColor() }}>{message}</p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f6fa",
    padding: "0 16px",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 1.6,
    wordBreak: "keep-all",
  },
};
