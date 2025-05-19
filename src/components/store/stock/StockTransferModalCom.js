// src/components/store/stock/StockTransferModalCom.js
import React from "react";

function StockTransferModalCom({
                                   form,
                                   partTimers,
                                   stores,
                                   onChange,
                                   onSubmit,
                                   onClose,
                                   loading
                               }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>재고 이동</h2>

                <label>이동 유형</label>
                <select
                    value={form.transferType}
                    onChange={e => onChange("transferType", parseInt(e.target.value))}
                >
                    <option value={0}>창고 → 매장</option>
                    <option value={1}>매장 → 창고</option>
                    <option value={2}>매장 → 매장</option>
                </select>

                <label>수량</label>
                <input
                    type="number"
                    value={form.quantity}
                    onChange={e => onChange("quantity", parseInt(e.target.value))}
                />

                <label>담당자</label>
                <select
                    value={form.transferredById || ""}
                    onChange={e => onChange("transferredById", parseInt(e.target.value))}
                >
                    <option value="">-- 선택 --</option>
                    {partTimers.map(p => (
                        <option key={p.partTimerId} value={p.partTimerId}>
                            {p.partName}
                        </option>
                    ))}
                </select>

                <label>도착 매장 (선택)</label>
                <select
                    value={form.toStoreId || ""}
                    onChange={e => onChange("toStoreId", parseInt(e.target.value))}
                >
                    <option value="">-- 현재 매장 --</option>
                    {stores.map(s => (
                        <option key={s.storeId} value={s.storeId}>
                            {s.storeName}
                        </option>
                    ))}
                </select>

                <label>이동 사유</label>
                <input
                    type="text"
                    value={form.reason}
                    onChange={e => onChange("reason", e.target.value)}
                />

                <div className="modal-actions">
                    <button onClick={onClose} disabled={loading}>취소</button>
                    <button onClick={onSubmit} disabled={loading}>이동</button>
                </div>
            </div>
        </div>
    );
}

export default StockTransferModalCom;
