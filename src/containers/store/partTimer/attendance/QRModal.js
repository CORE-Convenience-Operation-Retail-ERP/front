import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { fetchPartTimerById } from "../../../../service/store/PartTimeService";

export default function QRModal({ partTimerId, mode, onClose }) {
  const [qrUrl, setQrUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQrData = async () => {
      try {
        const pt = await fetchPartTimerById(partTimerId);
        if (!pt.deviceId || !pt.storeId) {
          setError("❌ 등록된 기기 정보가 없습니다.");
          return;
        }

      const url = `${window.location.origin}/qr/${mode}?deviceId=${pt.deviceId}&storeId=${pt.storeId}`;
        setQrUrl(url);
      } catch (e) {
        setError("❌ QR 생성 실패");
      }
    };

    loadQrData();
  }, [partTimerId, mode]);

  return (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h2>📲 {mode === "check-in" ? "출근" : "퇴근"} QR</h2>
    {error ? (
      <p>{error}</p>
    ) : qrUrl ? (
      <>
        <QRCodeCanvas value={qrUrl} size={256} />
        <p>📸 위 QR을 본인의 기기로 스캔하세요.</p>
      </>
    ) : (
      <p>🔄 로딩 중...</p>
    )}

    <button
      onClick={onClose}
      style={{
        marginTop: "1.5rem",
        padding: "0.5rem 1rem",
        borderRadius: "6px",
        border: "none",
        backgroundColor: "#007BFF",
        color: "#fff",
        cursor: "pointer",
      }}
    >
      닫기
    </button>
  </div>
);

}
