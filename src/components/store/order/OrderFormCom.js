import React, { useMemo } from "react";
import {
    PageWrapper,
    PageTitle,
    PageSection,
    TableWrapper,
    HighlightId,
    FilterActionRow,
    FilterGroup,
    SearchBarRow
} from "../../../features/store/styles/common/PageLayout";
import { Table } from "../../../features/store/styles/common/Table.styled";
import { PrimaryButton } from "../../../features/store/styles/common/Button.styled";
import InputBox from "../../../features/store/styles/common/InputBox";
import SelectBox from "../../../features/store/styles/common/SelectBox";
import Pagination from "../common/Pagination";
import StoreSearchBar from "../common/StoreSearchBar";

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
            <PageTitle>{isEdit ? "발주 수정" : "발주 등록"}</PageTitle>

            <PageSection>
                {localStorage.getItem("role") === "ROLE_MASTER" && (
                    <div style={{ marginBottom: "1rem" }}>
                        <SelectBox
                            label="매장 선택"
                            value={selectedStoreId}
                            onChange={(e) => onStoreChange(e.target.value)}
                            options={storeOptions.map((s) => ({
                                label: s.storeName,
                                value: s.storeId
                            }))}
                        />
                    </div>
                )}
                <FilterActionRow style={{ marginLeft: "25rem" }}>
                    <FilterGroup>
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
                    </FilterGroup>
                </FilterActionRow>

                <SearchBarRow style={{ marginLeft: "25rem" }}>
                    <StoreSearchBar
                        filterOptions={filterOptions}
                        onSearch={onSearch}
                    />
                </SearchBarRow>

                <div style={{ display: "flex", gap: "2rem" }}>
                    {/* 상품 목록 */}
                    <div style={{ flex: 2 }}>
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

                    {/* 선택 상품 요약 */}
                    <div style={{ flex: 1 }}>
                        <h3>상품 요약</h3>
                        <ul>
                            {selectedItems.map((item) => (
                                <li key={item.productId}>
                                    {item.productName} / 수량: {item.quantity} / 금액: {(item.unitPrice * item.quantity).toLocaleString()}원
                                </li>
                            ))}
                        </ul>
                        <p><strong>총 수량:</strong> {totalQty}</p>
                        <p><strong>총 금액:</strong> {totalAmount.toLocaleString()}원</p>
                        <PrimaryButton onClick={handleSubmitClick}>
                            {isEdit ? "수정 완료" : "발주 등록"}
                        </PrimaryButton>
                    </div>
                </div>
            </PageSection>
        </PageWrapper>
    );
}

export default OrderFormCom;