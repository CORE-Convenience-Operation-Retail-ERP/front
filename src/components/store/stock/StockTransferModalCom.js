// src/components/store/stock/StockTransferModalCom.js
import React from "react";
import {
    ModalOverlay,
    ModalContainer,
    ModalTitle,
    FormGroup,
    Label,
    Input,
    Select,
    ButtonRow,
    SubmitButton,
    CancelButton
} from "../../../features/store/styles/stock/StockTransferModal.styled";

function StockTransferModalCom({
    form,
    partTimers = [],
    stores = [],
    onChange,
    onSubmit,
    onClose,
    loading
}) {
    if (!form) return null;

    return (
        <ModalOverlay>
            <ModalContainer>
                <ModalTitle>재고 이동</ModalTitle>

                <FormGroup>
                    <Label htmlFor="transferType">이동 유형</Label>
                    <Select
                        id="transferType"
                        value={form.transferType}
                        onChange={e => onChange("transferType", parseInt(e.target.value))}
                    >
                        <option value={0}>창고 → 매장</option>
                        <option value={1}>매장 → 창고</option>
                        <option value={2}>매장 → 매장</option>
                    </Select>
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="quantity">이동 수량</Label>
                    <Input
                        id="quantity"
                        type="number"
                        min={1}
                        placeholder="이동할 수량을 입력하세요"
                        value={form.quantity}
                        onChange={e => onChange("quantity", parseInt(e.target.value))}
                    />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="reason">이동 사유</Label>
                    <Input
                        id="reason"
                        type="text"
                        placeholder="이동 사유를 입력하세요"
                        value={form.reason}
                        onChange={e => onChange("reason", e.target.value)}
                    />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="transferredById">담당자</Label>
                    <Select
                        id="transferredById"
                        value={form.transferredById || ""}
                        onChange={e => onChange("transferredById", parseInt(e.target.value))}
                    >
                        <option value="">담당자 선택</option>
                        {partTimers.map(pt => (
                            <option key={pt.partTimerId} value={pt.partTimerId}>
                                {pt.partName || pt.name}
                            </option>
                        ))}
                    </Select>
                </FormGroup>

                {form.transferType === 2 && (
                    <FormGroup>
                        <Label htmlFor="toStoreId">이동할 매장</Label>
                        <Select
                            id="toStoreId"
                            value={form.toStoreId || ""}
                            onChange={e => onChange("toStoreId", parseInt(e.target.value))}
                        >
                            <option value="">매장 선택</option>
                            {stores.map(store => (
                                <option key={store.storeId} value={store.storeId}>
                                    {store.storeName || store.name}
                                </option>
                            ))}
                        </Select>
                    </FormGroup>
                )}

                <ButtonRow>
                    <CancelButton onClick={onClose} disabled={loading}>취소</CancelButton>
                    <SubmitButton onClick={onSubmit} disabled={loading}>
                        {loading ? "처리 중..." : "이동 요청"}
                    </SubmitButton>
                </ButtonRow>
            </ModalContainer>
        </ModalOverlay>
    );
}

export default StockTransferModalCom;
