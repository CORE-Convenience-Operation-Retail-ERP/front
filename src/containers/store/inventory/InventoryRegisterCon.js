import { useState, useEffect } from "react";
import { fetchInventoryProductList, registerInventoryCheck } from "../../../service/store/InventoryCheckService";
import { fetchPartTimers } from "../../../service/store/PartTimeService";
import InventoryRegisterCom from "../../../components/store/inventory/InventoryRegisterCom";
import Pagination from "../../../components/store/common/Pagination";
import StoreSearchBar from "../../../components/store/common/StoreSearchBar";
import { useNavigate } from "react-router-dom";

function InventoryRegisterCon() {
    const [products, setProducts] = useState([]);
    const [realQuantities, setRealQuantities] = useState({});
    const [partTimers, setPartTimers] = useState([]);
    const [partTimerId, setPartTimerId] = useState("");
    const [reason, setReason] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useState({
        productName: "",
        barcode: "",
        page: 0,
        size: 10,
    });

    const storeId = parseInt(localStorage.getItem("storeId"));

    useEffect(() => {
        fetchProducts(searchParams);
        fetchPartTimersList();
    }, [searchParams]);

    const fetchProducts = async (params) => {
        try {
            const res = await fetchInventoryProductList(params);
            const data = res?.data || res;
            setProducts(data.content || []);
            setTotalPages(data.totalPages || 0);
        } catch (err) {
            console.error("상품 목록 조회 실패:", err);
            alert("상품 목록을 불러오지 못했습니다.");
        }
    };

    const fetchPartTimersList = async () => {
        try {
            const res = await fetchPartTimers({ page: 0, size: 100, storeId });
            const data = res?.data || res;
            setPartTimers(data.content || []);
        } catch (err) {
            console.error("파트타이머 목록 조회 실패:", err);
            alert("파트타이머 목록을 불러오지 못했습니다.");
        }
    };

    // ✅ 변경: 매장/창고 구분 처리
    const handleQuantityChange = (barcode, type, value) => {
        setRealQuantities((prev) => ({
            ...prev,
            [barcode]: {
                ...prev[barcode],
                [type]: Number(value),
            },
        }));
    };

    const handleRegister = async () => {
        if (!storeId) return alert("로그인 정보를 확인해주세요.");
        if (!partTimerId) return alert("담당자를 선택하세요.");
        if (!reason.trim()) return alert("사유를 입력하세요.");

        // 전체 상품 정보 확보
        const allProducts = [];
        let currentPage = 0;
        const pageSize = 100;

        while (true) {
            const res = await fetchInventoryProductList({ page: currentPage, size: pageSize });
            const data = res?.data?.content || [];
            if (!data.length) break;
            allProducts.push(...data);
            currentPage++;
        }

        const checks = Object.entries(realQuantities).map(([barcode, qty]) => {
            const matchedProduct = allProducts.find((p) => p.barcode === parseInt(barcode));
            return {
                productId: matchedProduct?.productId,
                storeRealQty: parseInt(qty.store || 0, 10),
                warehouseRealQty: parseInt(qty.warehouse || 0, 10),
            };
        });

        if (checks.some((c) => !c.productId)) {
            return alert("상품 ID가 누락된 항목이 있습니다.");
        }

        try {
            await registerInventoryCheck({
                storeId,
                partTimerId: parseInt(partTimerId, 10),
                reason,
                checks,
            });

            alert("실사 등록 완료!");
            setRealQuantities({});
            setPartTimerId("");
            setReason("");
            navigate("/store/stock/list");
            fetchProducts(searchParams);
        } catch (err) {
            console.error("실사 등록 실패:", err);
            alert(`실사 등록 실패: ${err}`);
        }
    };

    const handleSearch = (params) => {
        setSearchParams({
            productName: params.productName || "",
            barcode: params.barcode || "",
            page: 0,
            size: 10,
        });
    };

    const handlePageChange = (page) => {
        setSearchParams((prev) => ({ ...prev, page }));
    };

    return (
        <>
            <StoreSearchBar
                filterOptions={[
                    { key: "productName", label: "상품명", type: "text", placeholder: "상품명 입력" },
                    { key: "barcode", label: "바코드", type: "text", placeholder: "바코드 입력" },
                ]}
                onSearch={(params) => {
                    handleSearch({ productName: "", barcode: "", ...params });
                }}
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
                currentPage={searchParams.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </>
    );
}

export default InventoryRegisterCon;