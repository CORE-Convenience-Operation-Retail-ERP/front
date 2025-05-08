import React, { useEffect, useState } from 'react';
import StockListCom from '../../../components/store/stock/StockListCom';
import { fetchStoreStockList } from '../../../service/store/StockService';

function StockListCon() {
    const [filters, setFilters] = useState({
        categoryId: '',
        productName: '',
        barcode: ''
    });
    const [stockList, setStockList] = useState([]);
    const [page, setPage] = useState(0);

    const loadStockList = async () => {
        const res = await fetchStoreStockList({ ...filters, page });
        setStockList(res.data.content); // Page 객체 기준
    };

    useEffect(() => {
        loadStockList();
    }, [page]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        setPage(0); // 검색 시 첫 페이지로
        loadStockList();
    };

    return (
        <>
            <StockListCom
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearchClick={handleSearch}
            />
            {/* stockList 테이블 출력은 여기 추가 */}
        </>
    );
}

export default StockListCon;
