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

        const url = `${window.location.origin}/store/qr/${mode}?deviceId=${pt.deviceId}&storeId=${pt.storeId}`;
        setQrUrl(url);
      } catch (e) {
        setError("❌ QR 생성 실패");
      }
    };

    loadQrData();
  }, [partTimerId, mode]);

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={titleStyle}>
          {mode === "check-in" ? "출근" : "퇴근"}
        </h2>
        {error ? (
          <p style={errorStyle}>{error}</p>
        ) : qrUrl ? (
          <>
            <QRCodeCanvas value={qrUrl} size={220} />
            <p style={descStyle}> 본인 기기로 QR을 스캔하세요.</p>
          </>
        ) : (
          <p style={loadingStyle}>🔄 QR 생성 중...</p>
        )}

        <button style={closeBtnStyle} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.35)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: "#fff",
  padding: "2rem",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "360px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
  textAlign: "center",
  fontFamily: "'Noto Sans KR', sans-serif",
};

const titleStyle = {
  fontSize: "1.5rem",
  fontWeight: "600",
  marginBottom: "1.2rem",
  color: "#333",
};

const descStyle = {
  marginTop: "1rem",
  fontSize: "0.95rem",
  color: "#555",
};

const loadingStyle = {
  fontSize: "1rem",
  color: "#888",
};

const errorStyle = {
  fontSize: "1rem",
  color: "#e74c3c",
};

const closeBtnStyle = {
  marginTop: "1.8rem",
  padding: "0.6rem 1.4rem",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#4A90E2",
  color: "#fff",
  fontSize: "0.95rem",
  cursor: "pointer",
  transition: "background 0.2s ease-in-out",
};
