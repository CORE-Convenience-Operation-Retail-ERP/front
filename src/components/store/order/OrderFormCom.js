import React, { useMemo } from "react";
import {
    PageWrapper,
    PageTitle,
    PageSection,
    TableWrapper,
    HighlightId
} from "../../../features/store/styles/common/PageLayout";
import { Table } from "../../../features/store/styles/common/Table.styled";
import { PrimaryButton } from "../../../features/store/styles/common/Button.styled";
import InputBox from "../../../features/store/styles/common/InputBox";
import SelectBox from "../../../features/store/styles/common/SelectBox";
import Pagination from "../common/Pagination";
import StoreSearchBar from "../common/StoreSearchBar";
import {MdShoppingCart} from "react-icons/md";

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
                          onSubChildChange
                      }) {
    const getQuantity = (productId) =>
        selectedItems.find((item) => item.productId === productId)?.quantity || "";

    const handleQuantityChange = (product, value) => {
        const parsed = parseInt(value, 10);
        setSelectedItems((prev) => {
            if (value === "") {
                return prev.filter((item) => item.productId !== product.productId);
            }

            const quantity = isNaN(parsed) ? 0 : Math.max(0, parsed);
            const exists = prev.some((item) => item.productId === product.productId);

            const updatedItem = {
                productId: product.productId,
                productName: product.productName,
                quantity,
                unitPrice: product.unitPrice
            };

            return exists
                ? prev.map((item) =>
                    item.productId === product.productId ? updatedItem : item
                )
                : [...prev, updatedItem];
        });
    };

    const { totalQty, totalAmount } = useMemo(() => {
        return selectedItems.reduce(
            (acc, item) => ({
                totalQty: acc.totalQty + item.quantity,
                totalAmount: acc.totalAmount + item.quantity * item.unitPrice
            }),
            { totalQty: 0, totalAmount: 0 }
        );
    }, [selectedItems]);

    const handleSubmitClick = async () => {
        try {
            await onSubmit();
        } catch (err) {
            alert(err?.message || "처리 중 오류 발생");
        }
    };

    return (
        <PageWrapper>
            <PageTitle>{isEdit ? "| 발주 수정" : "| 발주 등록"}</PageTitle>

            {/* 검색바 영역: 카테고리 + 검색바 */}
            <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
                    <SelectBox
                        label="대분류"
                        value={filters.parentCategoryId}
                        onChange={(e) => onParentChange(e.target.value)}
                        options={[{ label: "대분류 선택", value: "" }, ...parentCategories.map(c => ({ label: c.name, value: c.id }))]}
                    />
                    <SelectBox
                        label="중분류"
                        value={filters.categoryId}
                        onChange={(e) => onChildChange(e.target.value)}
                        options={[{ label: "중분류 선택", value: "" }, ...childCategories.map(c => ({ label: c.name, value: c.id }))]}
                    />
                    <SelectBox
                        label="소분류"
                        value={filters.subCategoryId}
                        onChange={(e) => onSubChildChange(e.target.value)}
                        options={[{ label: "소분류 선택", value: "" }, ...grandChildCategories.map(c => ({ label: c.name, value: c.id }))]}
                    />
                    <div style={{ display: "flex", marginLeft: "28rem", marginTop: "2rem" }}>
                    <StoreSearchBar
                        filterOptions={filterOptions}
                        onSearch={onSearch}
                    />
                </div>
                </div>

            </div>

            {/* 상품 테이블 + 요약 */}
            <PageSection style={{ display: "flex", alignItems: "flex-start", gap: "0" }}>
                {/* 상품 목록 */}
                <div style={{ flex: 1 }}>
                    <TableWrapper>
                        <Table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>상품명</th>
                                <th>바코드</th>
                                <th>카테고리</th>
                                <th>단가</th>
                                <th>재고</th>
                                <th>임계치</th>
                                <th>수량</th>
                            </tr>
                            </thead>
                            <tbody>
                            {productList.length > 0 ? (
                                productList.map((product) => {
                                    const isSelected = selectedItems.some(
                                        (item) => item.productId === product.productId
                                    );
                                    return (
                                        <tr
                                            key={product.productId}
                                            style={{
                                                backgroundColor: isSelected ? "#f5fffa" : "transparent"
                                            }}
                                        >
                                            <td><HighlightId>{product.productId}</HighlightId></td>
                                            <td>{product.productName}</td>
                                            <td>{product.barcode || "-"}</td>
                                            <td>{product.categoryName || "-"}</td>
                                            <td>{product.unitPrice.toLocaleString()}</td>
                                            <td>{product.stockQty}</td>
                                            <td>{product.proStockLimit}</td>
                                            <td>
                                                <InputBox
                                                    type="number"
                                                    value={getQuantity(product.productId)}
                                                    onChange={(e) =>
                                                        handleQuantityChange(product, e.target.value)
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: "center", padding: "20px" }}>
                                        상품이 없습니다.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                    </TableWrapper>
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                </div>

                {/* 상품 요약 */}
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                        padding: "1.5rem",
                        minWidth: "300px",
                        maxWidth: "360px",
                        fontSize: "0.95rem",
                        fontFamily: "'Noto Sans KR', sans-serif",
                        marginLeft: "2.5rem"
                    }}
                >
                    <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem", fontWeight: "bold", color: "#333", display: "flex", alignItems: "center", gap: "6px" }}>
                        <MdShoppingCart size={20} />
                        상품 요약
                    </h3>
                    <ul style={{ listStyle: "none", padding: 0, marginBottom: "1.5rem" }}>
                        {selectedItems.map((item) => (
                            <li
                                key={item.productId}
                                style={{
                                    marginBottom: "0.8rem",
                                    padding: "0.75rem",
                                    backgroundColor: "#f9f9f9",
                                    borderRadius: "8px",
                                    border: "1px solid #eee"
                                }}
                            >
                                <div style={{ fontWeight: "500", marginBottom: "0.3rem" }}>
                                    {item.productName}
                                </div>
                                <div style={{ fontSize: "0.88rem", color: "#555" }}>
                                    수량: <strong>{item.quantity}</strong> / 금액: {" "}
                                    <strong>{(item.unitPrice * item.quantity).toLocaleString()}원</strong>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div style={{ borderTop: "1px solid #ddd", paddingTop: "1rem", marginTop: "1rem" }}>
                        <p style={{ marginBottom: "0.3rem" }}>
                            <strong>총 수량:</strong> {totalQty}
                        </p>
                        <p style={{ marginBottom: "1rem" }}>
                            <strong>총 금액:</strong> {" "}
                            <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#007BFF" }}>
        {totalAmount.toLocaleString()}원
      </span>
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
