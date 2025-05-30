import React from 'react';
import styled from 'styled-components';
import { AiOutlineClose } from 'react-icons/ai';

const ModalWrapper = styled.div`
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex; align-items: center; justify-content: center;
    z-index: 999;
`;

const ModalContent = styled.div`
    position: relative;
    background: white;
    padding: 32px 24px;
    border-radius: 12px;
    width: 360px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    text-align: center;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 12px;
    right: 12px;
    background: transparent;
    border: none;
    cursor: pointer;
`;

const QrImage = styled.img`
    margin: 16px 0;
`;

export default function QrAuthModal({ phone, isOpen, onClose }) {
    if (!isOpen || !phone) return null;

    const redirect = encodeURIComponent(window.location.pathname);
    const qrUrl = `https://corepos.store/device-auth?phone=${phone}&redirect=${redirect}`;

    return (
        <ModalWrapper onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose} aria-label="닫기">
                    <AiOutlineClose size={20} />
                </CloseButton>
                <h3>기기 인증 QR</h3>
                <p>휴대폰으로 아래 QR을 스캔해주세요.</p>
                <QrImage
                    src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrUrl)}&size=200x200`}
                    alt="기기 인증 QR코드"
                />
            </ModalContent>
        </ModalWrapper>
    );
}
