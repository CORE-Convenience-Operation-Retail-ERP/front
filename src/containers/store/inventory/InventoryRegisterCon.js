import { useState, useEffect } from "react";
import { registerInventoryCheck } from "../../../service/store/InventoryCheckService";
import { fetchStoreStockList } from "../../../service/store/StockService";
import { fetchPartTimers } from "../../../service/store/PartTimeService";
import InventoryRegisterCom from "../../../components/store/inventory/InventoryRegisterCom";
import StoreSearchBar from "../../../components/store/common/StoreSearchBar";
import Pagination from "../../../components/store/common/Pagination";

function InventoryRegisterCon() {
    const [products, setProducts] = useState([]);
    const [realQuantities, setRealQuantities] = useState({});
    const [searchParams, setSearchParams] = useState({});
    const [pageInfo, setPageInfo] = useState({ currentPage: 0, totalPages: 0 });
    const [partTimers, setPartTimers] = useState([]);
    const [partTimerId, setPartTimerId] = useState("");
    const [reason, setReason] = useState("");

    const storeId = parseInt(localStorage.getItem("storeId"));

    useEffect(() => {
        fetchProducts();
    }, [searchParams]);

    useEffect(() => {
        fetchPartTimerList();
    }, []);

    const fetchProducts = async (page = 0) => {
        try {
            const res = await fetchStoreStockList({ ...searchParams, page });
            const data = res?.data || {};
            setProducts(data.content || []);
            setPageInfo({
                currentPage: data.number || 0,
                totalPages: data.totalPages || 0

            });
            console.log("📦 재고 조회 응답:", res.data);
        } catch (err) {
            alert(`상품 목록 조회 실패: ${err}`);
        }
    };

    const fetchPartTimerList = async () => {
        try {
            const res = await fetchPartTimers({ page: 0, size: 100, storeId });
            setPartTimers(res?.content || []);
        } catch (err) {
            alert(`파트타이머 목록 조회 실패: ${err}`);
        }
    };

    const handleSearch = (params) => setSearchParams(params);

    const handleQuantityChange = (barcode, value) => {
        setRealQuantities(prev => ({ ...prev, [barcode]: value }));
    };

    const handleRegister = async () => {
        if (!storeId) return alert("로그인 정보를 확인해주세요.");
        if (!partTimerId) return alert("담당자를 선택하세요.");
        if (!reason.trim()) return alert("사유를 입력하세요.");

        const incomplete = products.some(
            product => !realQuantities[product.barcode]
        );
        if (incomplete) return alert("모든 제품의 실사 수량을 입력하세요.");

        //  productId 포함해서 전송
        const checks = products.map(product => ({
            productId: product.productId,
            realQuantity: parseInt(realQuantities[product.barcode], 10)
        }));

        try {
            await registerInventoryCheck({
                storeId,
                partTimerId: parseInt(partTimerId, 10),
                reason,
                checks
            });
            alert("실사 등록 완료!");
            fetchProducts();
            setRealQuantities({});
            setPartTimerId("");
            setReason("");
        } catch (err) {
            alert(`실사 등록 실패: ${err}`);
        }
    };

    return (
        <>
            <StoreSearchBar
                filterOptions={[
                    { key: "productName", label: "상품명", type: "text" },
                    { key: "barcode", label: "바코드", type: "number" }
                ]}
                onSearch={handleSearch}
            />
            <InventoryRegisterCom
                products={products}
                realQuantities={realQuantities}
                onQuantityChange={handleQuantityChange}
                onRegister={handleRegister}
                partTimers={partTimers}
                partTimerId={partTimerId}
                setPartTimerId={setPartTimerId}
                reason={reason}
                setReason={setReason}
            />
            <Pagination
                currentPage={pageInfo.currentPage}
                totalPages={pageInfo.totalPages}
                onPageChange={fetchProducts}
            />
        </>
    );
}

export default InventoryRegisterCon;
