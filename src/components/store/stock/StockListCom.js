import React from 'react';

function StockListCom({ filters, onFilterChange, onSearchClick }) {
    const { categoryId, productName, barcode } = filters;

    return (
        <div style={{ marginBottom: '1rem' }}>
            <select name="categoryId" value={categoryId} onChange={onFilterChange}>
                <option value="">전체 카테고리</option>
                <option value="1">음료</option>
                <option value="2">과자</option>
                <option value="3">디저트</option>
                {/* 카테고리 목록은 props 또는 공통 util로 받아도 됨 */}
            </select>

            <input
                type="text"
                name="productName"
                placeholder="상품명 검색"
                value={productName}
                onChange={onFilterChange}
                style={{ marginLeft: '1rem' }}
            />

            <input
                type="text"
                name="barcode"
                placeholder="바코드 검색"
                value={barcode}
                onChange={onFilterChange}
                style={{ marginLeft: '1rem' }}
            />

            <button onClick={onSearchClick} style={{ marginLeft: '1rem' }}>검색</button>
        </div>
    );
}

export default StockListCom;
