import React, { useMemo } from "react";
import {
    PageWrapper,
    PageTitle,
    PageSection,
    TableWrapper,
    HighlightId,
} from "../../../features/store/styles/common/PageLayout";
import { Table } from "../../../features/store/styles/common/Table.styled";
import { PrimaryButton } from "../../../features/store/styles/common/Button.styled";
import InputBox from "../../../features/store/styles/common/InputBox";
import SelectBox from "../../../features/store/styles/common/SelectBox";
import Pagination from "../common/Pagination";
import StoreSearchBar from "../common/StoreSearchBar";
import { MdShoppingCart } from "react-icons/md";

function OrderFormCom({
                          productList = [],
                          selectedItems = [],
                          setSelectedItems,
                          onSubmit,
                          isEdit = false,
                          storeOptions = [],
                          selectedStoreId = "",
                          onStoreChange = () => {},
                          page,
                          totalPages,
                          onPageChange,
                          filterOptions,
                          onSearch,
                          parentCategories = [],
                          childCategories = [],
                          grandChildCategories = [],
                          filters = {},
                          onParentChange,
                          onChildChange,
                          onSubChildChange,
                          summaryPage,
                          setSummaryPage,
                          summaryPageSize = 5,
                          hqStockMap,
                          sortConfig,
                          handleSort,
                      }) {
    const getQuantity = (productId) => selectedItems.find((item) => item.productId === productId)?.quantity || "";

    const handleQuantityChange = (product, value) => {
        const parsed = parseInt(value, 10);
        const quantity = isNaN(parsed) ? 0 : parsed;
        const hqQty = hqStockMap?.[product.productId] ?? Infinity;
        const stockLimit = product.proStockLimit ?? Infinity;

        if (quantity > hqQty) {
            alert(`본사 재고(${hqQty})를 초과할 수 없습니다.`);
            return;
        }

        if (quantity > stockLimit) {
            alert(`임계치(${stockLimit})를 초과할 수 없습니다.`);
            return;
        }

        setSelectedItems((prev) => {
            if (value === "") {
                return prev.filter((item) => item.productId !== product.productId);
            }

            const exists = prev.some((item) => item.productId === product.productId);

            const updatedItem = {
                productId: product.productId,
                productName: product.productName,
                quantity: Math.max(0, quantity),
                unitPrice: product.unitPrice,
            };

            return exists
                ? prev.map((item) => item.productId === product.productId ? updatedItem : item)
                : [...prev, updatedItem];
        });
    };

    const sortedProductList = productList;

    const { totalQty, totalAmount } = useMemo(() => {
        return selectedItems.reduce(
            (acc, item) => ({
                totalQty: acc.totalQty + item.quantity,
                totalAmount: acc.totalAmount + item.quantity * item.unitPrice,
            }),
            { totalQty: 0, totalAmount: 0 }
        );
    }, [selectedItems]);

    const handleSubmitClick = async () => {
        const invalidItem = selectedItems.find(item => {
            const hq = hqStockMap?.[item.productId] ?? Infinity;
            const limit = productList.find(p => p.productId === item.productId)?.proStockLimit ?? Infinity;
            return item.quantity > hq || item.quantity > limit;
        });

        if (invalidItem) {
            alert(`상품 [${invalidItem.productName}]의 수량이 본사 재고 또는 임계치를 초과합니다.`);
            return;
        }

        try {
            await onSubmit();
        } catch (err) {
            alert(err?.message || "처리 중 오류 발생");
        }
    };

    const summaryPageCount = Math.ceil(selectedItems.length / summaryPageSize);
    const pagedSummaryItems = selectedItems.slice(summaryPage * summaryPageSize, (summaryPage + 1) * summaryPageSize);
    const handlePrev = () => summaryPage > 0 && setSummaryPage(summaryPage - 1);
    const handleNext = () => summaryPage < summaryPageCount - 1 && setSummaryPage(summaryPage + 1);

    return (
        <PageWrapper>
            <PageTitle>{isEdit ? "| 발주 수정" : "| 발주 등록"}</PageTitle>
            <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
                    <SelectBox label="대분류" value={filters.parentCategoryId} onChange={(e) => onParentChange(e.target.value)} options={[{ label: "대분류 선택", value: "" }, ...parentCategories.map(c => ({ label: c.name, value: c.id }))]} />
                    <SelectBox label="중분류" value={filters.categoryId} onChange={(e) => onChildChange(e.target.value)} options={[{ label: "중분류 선택", value: "" }, ...childCategories.map(c => ({ label: c.name, value: c.id }))]} />
                    <SelectBox label="소분류" value={filters.subCategoryId} onChange={(e) => onSubChildChange(e.target.value)} options={[{ label: "소분류 선택", value: "" }, ...grandChildCategories.map(c => ({ label: c.name, value: c.id }))]} />
                    <div style={{ display: "flex", marginLeft: "28rem", marginTop: "2rem" }}>
                        <StoreSearchBar filterOptions={filterOptions} onSearch={onSearch} />
                    </div>
                </div>
            </div>

            <PageSection style={{ display: "flex", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                    <TableWrapper>
                        <Table>
                            <thead>
                            <tr>
                                <th
                                    onClick={() => handleSort("productId")}
                                    style={{
                                        cursor: "pointer",
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                        fontWeight: "bold",
                                        padding: "12px 8px",
                                    }}
                                >
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "14px",
                                        lineHeight: "1.2"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                          <span style={{ color: sortConfig.key === "productId" ? "#007bff" : "#333" }}>
                                            ID
                                          </span>
                                            <div style={{ fontSize: "10px", lineHeight: "1" }}>
                                                <div style={{ color: sortConfig.key === "productId" && sortConfig.direction === "asc" ? "#007bff" : "#ccc" }}>▲</div>
                                                <div style={{ color: sortConfig.key === "productId" && sortConfig.direction === "desc" ? "#007bff" : "#ccc" }}>▼</div>
                                            </div>
                                        </div>
                                    </div>
                                </th>

                                <th
                                    onClick={() => handleSort("productName")}
                                    style={{
                                        cursor: "pointer",
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                        fontWeight: "bold",
                                        padding: "12px 8px",
                                    }}
                                >
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "14px",
                                        lineHeight: "1.2"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                          <span style={{ color: sortConfig.key === "productName" ? "#007bff" : "#333" }}>
                                            상품명
                                          </span>
                                            <div style={{ fontSize: "10px", lineHeight: "1" }}>
                                                <div style={{ color: sortConfig.key === "productName" && sortConfig.direction === "asc" ? "#007bff" : "#ccc" }}>▲</div>
                                                <div style={{ color: sortConfig.key === "productName" && sortConfig.direction === "desc" ? "#007bff" : "#ccc" }}>▼</div>
                                            </div>
                                        </div>
                                    </div>
                                </th>


                                <th>바코드</th>
                                <th>카테고리</th>
                                <th>단가</th>
                                <th>본사 재고</th>
                                <th>매장 재고</th>
                                <th>임계치</th>
                                <th>수량</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sortedProductList.length > 0 ? sortedProductList.map((product) => {
                                const quantity = getQuantity(product.productId);
                                const hqQty = hqStockMap?.[product.productId] ?? Infinity;
                                const stockLimit = product.proStockLimit ?? Infinity;
                                const isInvalid = quantity > hqQty || quantity > stockLimit;

                                return (
                                    <tr key={product.productId} style={{ backgroundColor: selectedItems.some(item => item.productId === product.productId) ? "#f5fffa" : "transparent" }}>
                                        <td><HighlightId>{product.productId}</HighlightId></td>
                                        <td>{product.productName}</td>
                                        <td>{product.barcode || "-"}</td>
                                        <td>{product.categoryName || "-"}</td>
                                        <td>{product.unitPrice.toLocaleString()}</td>
                                        <td>{hqQty}</td>
                                        <td>{product.stockQty}</td>
                                        <td>{product.proStockLimit}</td>
                                        <td>
                                            <InputBox
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => handleQuantityChange(product, e.target.value)}
                                                style={{
                                                    borderColor: isInvalid ? "#dc3545" : undefined,
                                                    backgroundColor: isInvalid ? "#fff5f5" : undefined,
                                                }}
                                            />
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={9} style={{ textAlign: "center", padding: "20px" }}>
                                        상품이 없습니다.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                    </TableWrapper>
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
                </div>


                {/* 상품 요약 카드 */}
                <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)", padding: "1.5rem", minWidth: "300px", maxWidth: "360px", fontSize: "0.95rem", fontFamily: "'Noto Sans KR', sans-serif", marginLeft: "2.5rem" }}>
                    <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem", fontWeight: "bold", color: "#333", display: "flex", alignItems: "center", gap: "6px" }}>
                        <MdShoppingCart size={20} />
                        상품 요약
                    </h3>

                    <ul style={{ listStyle: "none", padding: 0, marginBottom: "1.5rem" }}>
                        {pagedSummaryItems.map((item) => (
                            <li key={item.productId} style={{ marginBottom: "0.8rem", padding: "0.75rem", backgroundColor: "#f9f9f9", borderRadius: "8px", border: "1px solid #eee" }}>
                                <div style={{ fontWeight: "500", marginBottom: "0.3rem" }}>{item.productName}</div>
                                <div style={{ fontSize: "0.88rem", color: "#555" }}>
                                    수량: <strong>{item.quantity}</strong> / 금액: <strong>{(item.unitPrice * item.quantity).toLocaleString()}원</strong>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {selectedItems.length > summaryPageSize && (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <button onClick={handlePrev} disabled={summaryPage === 0} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem" }}>◀</button>
                            <span style={{ fontSize: "0.9rem", color: "#777" }}>{summaryPage + 1} / {summaryPageCount || 1}</span>
                            <button onClick={handleNext} disabled={summaryPage >= summaryPageCount - 1} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem" }}>▶</button>
                        </div>
                    )}

                    <div style={{ borderTop: "1px solid #ddd", paddingTop: "1rem", marginTop: "1rem" }}>
                        <p style={{ marginBottom: "0.3rem" }}><strong>총 수량:</strong> {totalQty}</p>
                        <p style={{ marginBottom: "1rem" }}>
                            <strong>총 금액:</strong> <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#007BFF" }}>{totalAmount.toLocaleString()}원</span>
                        </p>
                        <PrimaryButton style={{ width: "100%" }} onClick={handleSubmitClick}>
                            {isEdit ? "수정 완료" : "발주 등록"}
                        </PrimaryButton>
                    </div>
                </div>
            </PageSection>
        </PageWrapper>
    );
}

export default OrderFormCom;