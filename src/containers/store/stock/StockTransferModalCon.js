// src/containers/store/stock/StockTransferModalCon.js
import React, { useState, useEffect } from "react";
import StockTransferModalCom from "../../../components/store/stock/StockTransferModalCom";
import { requestStockTransfer } from "../../../service/store/StockService";
import { fetchPartTimers } from "../../../service/store/PartTimeService";
import { fetchStoreList } from "../../../service/store/StoreService";

function StockTransferModalCon({ product, onClose, onSuccess }) {
    const [form, setForm] = useState({
        productId: product.productId,
        fromStoreId: product.storeId, // 또는 사용자 정보에서 추출
        toStoreId: null,
        transferType: 0, // 0: 창고→매장, 1: 매장→창고, 2: 매장→매장
        quantity: 1,
        transferredById: null,
        reason: ""
    });
    const [partTimers, setPartTimers] = useState([]);
    const [storeList, setStoreList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res1 = await fetchPartTimers({ page: 0, size: 100, storeId: product.storeId });
                const data1 = res1?.data || res1;
                setPartTimers(data1.content || []);

                const res2 = await fetchStoreList();
                const data2 = res2?.data || res2;
                setStoreList(data2);
            } catch (err) {
                console.error("데이터 불러오기 실패", err);
            }
        };

        loadData();
    }, [product.storeId]);

    const handleChange = (name, value) => {
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!form.quantity || form.quantity <= 0) {
            alert("수량을 입력해주세요");
            return;
        }
        try {
            setLoading(true);
            await requestStockTransfer({
                ...form,
                toStoreId: form.toStoreId || form.fromStoreId // 비워도 본인 매장으로 처리
            });
            alert("재고 이동 완료");
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error("이동 실패:", err?.response?.data || err.message);
            alert("이동 실패: " + err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <StockTransferModalCom
            form={form}
            partTimers={partTimers}
            stores={storeList}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onClose={onClose}
            loading={loading}
        />
    );
}

export default StockTransferModalCon;
