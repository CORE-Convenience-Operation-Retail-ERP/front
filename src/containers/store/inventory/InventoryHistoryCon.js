import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchInventoryCheckList } from "../../../service/store/InventoryCheckService";
import InventoryHistoryCom from "../../../components/store/inventory/InventoryHistoryCom";
import StoreSearchBar from "../../../components/store/common/StoreSearchBar";

function InventoryHistoryCon() {
    const [historyList, setHistoryList] = useState([]);
    const [searchParams, setSearchParams] = useState({});
    const navigate = useNavigate();

    const storeId = parseInt(localStorage.getItem("storeId"));

    useEffect(() => {
        loadHistory();
    }, [searchParams]);

    const loadHistory = async () => {
        try {
            const res = await fetchInventoryCheckList({ storeId, ...searchParams });
            setHistoryList(res.data.content || []);
        } catch (err) {
            alert(`실사 이력 조회 실패: ${err}`);
        }
    };

    const handleSearch = (params) => {
        setSearchParams(params);
    };

    const handleGoToRegister = () => {
        navigate("/store/inventory/check/register");
    };

    const filterOptions = [
        { key: "productName", label: "상품명", type: "text" },
        { key: "barcode", label: "바코드", type: "number" },
        { key: "partTimerId", label: "담당자 ID", type: "number" },
        { key: "date", label: "실사일", type: "date" },
        { key: "dateRange", label: "실사 기간", type: "date-range" },
    ];

    return (
        <>
            {/*  검색바 */}
            <StoreSearchBar
                filterOptions={filterOptions}
                onSearch={handleSearch}
            />

            {/*  실사 이력 목록 */}
            <InventoryHistoryCom
                historyList={historyList}
                onRegisterClick={handleGoToRegister}
            />
        </>
    );
}

export default InventoryHistoryCon;
