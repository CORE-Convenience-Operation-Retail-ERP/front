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

    const sortedProductList = useMemo(() => {
        if (!sortConfig?.key) return productList;

        return [...productList].sort((a, b) => {
            const valA = a[sortConfig.key];
            const valB = b[sortConfig.key];

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [productList, sortConfig]);

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
                                <th onClick={() => handleSort("productId")} style={{ cursor: "pointer", padding: "0 8px", verticalAlign: "middle" }}>
                                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "4px",height: "100%" }}>
                                        <span style={{
                                            fontSize: "14px",
                                            color: sortConfig.key === "productId" ? "#007bff" : "#333",
                                            fontWeight: sortConfig.key === "productId" ? "bold" : "normal",
                                            lineHeight: "1.2"
                                        }}>
                                          ID
                                        </span>
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            fontSize: "10px",
                                            lineHeight: "1",
                                            justifyContent: "center"
                                        }}>
                                            <span style={{ color: sortConfig.key === "productId" && sortConfig.direction === "asc" ? "#007bff" : "#ccc" }}>▲</span>
                                            <span style={{ color: sortConfig.key === "productId" && sortConfig.direction === "desc" ? "#007bff" : "#ccc" }}>▼</span>
                                        </div>
                                    </div>
                                </th>

                                <th onClick={() => handleSort("productName")} style={{ cursor: "pointer", padding: "0 8px", verticalAlign: "middle" }}>
                                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "4px",height: "100%", marginLeft: "8px" }}>
                                        <span style={{
                                            fontSize: "14px",
                                            color: sortConfig.key === "productName" ? "#007bff" : "#333",
                                            fontWeight: sortConfig.key === "productName" ? "bold" : "normal",
                                            lineHeight: "1.2"
                                        }}>
                                          상품명
                                        </span>
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            fontSize: "10px",
                                            lineHeight: "1",
                                            justifyContent: "center"
                                        }}>
                                            <span style={{ color: sortConfig.key === "productName" && sortConfig.direction === "asc" ? "#007bff" : "#ccc" }}>▲</span>
                                            <span style={{ color: sortConfig.key === "productName" && sortConfig.direction === "desc" ? "#007bff" : "#ccc" }}>▼</span>
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

                {/* 요약 카드 생략 (기존 코드 유지) */}
            </PageSection>
        </PageWrapper>
    );
}

export default OrderFormCom;