// src/components/store/stock/StockTransferModalCom.js
import React, { useState } from "react";
import StockTransferModalCon from "../../../containers/store/stock/StockTransferModalCon";
import StockHistorySummaryCom from "./StockHistorySummaryCom";
import LocationEditorModal from "../display/LocationEditorModal";

function StockDetailCom({ productDetail, historyList, onReload }) {
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [showLocationEdit, setShowLocationEdit] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    // const [locationCode, setLocationCode] = useState(productDetail.locationCode);
    // const updateProductLocation = (newLocationCode) => {
    //     setLocationCode(newLocationCode);};


    if (!productDetail) return <div>로딩 중...</div>;

    const {
        proName,
        proBarcode,
        status,
        storeExpectedQty,
        storeRealQty,
        warehouseExpectedQty,
        warehouseRealQty,
        totalExpectedQty,
        totalRealQty,
        locationCode,
        productId,
        storeId
    } = productDetail;


    const calculateDiff = (real, expected) => {
        if (real == null || expected == null) return null;
        return real - expected;
    };

    const renderRow = (label, expected, real) => {
        const diff = calculateDiff(real, expected);
        const diffStyle = diff > 0 ? { color: 'green' } : diff < 0 ? { color: 'red' } : {};
        return (
            <tr>
                <td>{label}</td>
                <td>{expected ?? '-'}</td>
                <td>{real ?? '-'}</td>
                <td style={diffStyle}>
                    {diff != null ? (diff >= 0 ? `+${diff}` : diff) : '-'}
                </td>
            </tr>
        );
    };

    return (
        <div>
            <h2>📦 상품 상세 정보</h2>
            <p><strong>상품명:</strong> {proName}</p>
            <p><strong>바코드:</strong> {proBarcode}</p>
            <p><strong>판매 상태:</strong> {status}</p>

            <h3>📍 위치 정보</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                    title="클릭 시 진열 위치 보기"
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => {
                        setIsEditMode(false);
                        setShowLocationEdit(true);
                    }}
                >
                    매장 위치 코드: <strong>{locationCode || '미지정'}</strong>
                </span>

                <button onClick={() => {
                    setIsEditMode(true);
                    setShowLocationEdit(true);
                }}>✏️ 수정</button>
            </div>

            <h3>📊 재고 실사 비교</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th>구분</th>
                    <th>기존 수량</th>
                    <th>실사 수량</th>
                    <th>오차</th>
                </tr>
                </thead>
                <tbody>
                {renderRow("매장", storeExpectedQty, storeRealQty)}
                {renderRow("창고", warehouseExpectedQty, warehouseRealQty)}
                {renderRow("총합", totalExpectedQty, totalRealQty)}
                </tbody>
            </table>

            <button onClick={() => setShowTransferModal(true)}>
                재고 이동
            </button>

            {showLocationEdit && (
                <LocationEditorModal
                    onClose={() => setShowLocationEdit(false)}
                    isEditMode={isEditMode}
                    productLocationCode={locationCode}
                    // onSelectLocation={(loc) => {
                    //     updateProductLocation(loc.locationCode);
                    //     setShowLocationEdit(false);
                    // }}
                />
            )}

            {showTransferModal && (
                <StockTransferModalCon
                    product={{ productId, storeId }}
                    onClose={() => setShowTransferModal(false)}

                    onSuccess={() => {
                        alert("이동 완료");
                        setShowTransferModal(false);
                        onReload();
                    }}
                />
            )}

            <StockHistorySummaryCom historyList={historyList} productId={productId} />
        </div>
    );
}

export default StockDetailCom;