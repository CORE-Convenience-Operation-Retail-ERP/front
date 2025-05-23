import React from "react";
import {
    PageWrapper,
    PageTitle,
    PageSection,
    TableWrapper,
    HighlightId,
} from "../../../features/store/styles/common/PageLayout";
import { Table } from "../../../features/store/styles/common/Table.styled";
import { PrimaryButton } from "../../../features/store/styles/common/Button.styled";
import Pagination from "../../../components/store/common/Pagination";
import SelectBox from "../../../features/store/styles/common/SelectBox";

function OrderHistoryCom({
                             itemList,
                             partialItems,
                             partTimers,
                             selectedPartTimerId,
                             setSelectedPartTimerId,
                             onCheckboxChange,
                             onQuantityChange,
                             onReasonChange,
                             handleSubmitStockIn,
                             onSelectAllChange,
                             navigate,
                             currentPage,
                             totalItems,
                             pageSize,
                             onPageChange,
                         }) {
    const handleSelectAll = (e) => {
        onSelectAllChange(e.target.checked);
    };

    const totalOrderQty = itemList.reduce((sum, item) => sum + item.orderQuantity, 0);
    const totalReceivedQty = itemList.reduce((sum, item) => sum + item.receivedQuantity, 0);
    const totalInputQty = partialItems.reduce((sum, item) => sum + (Number(item.inQuantity) || 0), 0);
    const totalEffectiveQty = totalReceivedQty + totalInputQty;
    const totalInputAmount = partialItems.reduce((sum, item) => {
    const matchedItem = itemList.find(i => i.itemId === item.itemId);
        return sum + ((Number(item.inQuantity) || 0) * (matchedItem?.unitPrice || 0));
    }, 0);

    const getPartialItem = (itemId) =>
        partialItems.find((i) => i.itemId === itemId) || {};

    return (
        <PageWrapper>
            <PageTitle>| 입고 처리</PageTitle>

            <PageSection style={{
                width: "180%",
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: "2rem",
            }}>
            <SelectBox
                    label="입고 담당자 선택"
                    id="partTimer"
                    value={selectedPartTimerId || ""}
                    onChange={(e) => setSelectedPartTimerId(Number(e.target.value))}
                    options={partTimers.map((pt) => ({
                        value: pt.partTimerId,
                        label: `${pt.partName} (${pt.position})`
                    }))}
                    style={{
                        minWidth: "300px",
                        textAlign: "left",
                    }}
                />
            </PageSection>

            <TableWrapper>
                <Table>
                    <thead>
                    <tr>
                        <th><input type="checkbox" onChange={handleSelectAll} /></th>
                        <th>상품명</th>
                        <th>주문수량</th>
                        <th>입고됨</th>
                        <th>단가</th>
                        <th>총액</th>
                        <th>입고 수량</th>
                        <th>사유</th>
                    </tr>
                    </thead>
                    <tbody>
                    {itemList.map((item) => {
                        const {
                            itemId,
                            productName,
                            orderQuantity,
                            receivedQuantity = 0,
                            unitPrice,
                            totalPrice,
                        } = item;

                        const remainingQty = orderQuantity - receivedQuantity;
                        const selected = getPartialItem(itemId);
                        const isDisabled = remainingQty <= 0;

                        return (
                            <tr key={itemId}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={!!selected.itemId}
                                        disabled={isDisabled}
                                        onChange={() => onCheckboxChange(itemId, remainingQty)}
                                    />
                                </td>
                                <td><HighlightId>{productName}</HighlightId></td>
                                <td>{orderQuantity}</td>
                                <td>{receivedQuantity}</td>
                                <td>{unitPrice.toLocaleString()}원</td>
                                <td>{totalPrice.toLocaleString()}원</td>
                                <td>
                                    <div style={{ fontSize: "12px", color: "gray" }}>남음: {remainingQty}</div>
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        min="0"
                                        max={remainingQty}
                                        value={selected.inQuantity !== undefined ? selected.inQuantity : ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === "") onQuantityChange(item.itemId, undefined);
                                            else onQuantityChange(item.itemId, value);
                                        }}
                                        disabled={isDisabled}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={selected.reason || ""}
                                        onChange={(e) => onReasonChange(itemId, e.target.value)}
                                        disabled={
                                            !selected.itemId ||
                                            selected.inQuantity === remainingQty ||
                                            selected.inQuantity === 0
                                        }
                                    />
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td></td>
                        <td style={{ fontWeight: "bold", textAlign: "center" }}>합계</td>
                        <td>{totalOrderQty}</td>
                        <td>{totalReceivedQty}</td>
                        <td></td>
                        <td>{totalInputAmount.toLocaleString()}원</td>
                        <td>{totalInputQty}</td>
                        <td></td>
                    </tr>
                    </tfoot>
                </Table>
            </TableWrapper>

            <div style={{ display: "flex", justifyContent: "center", gap: "12px", margin: "2rem 0" }}>
                <PrimaryButton className="btn-submit" onClick={handleSubmitStockIn}>입고 처리</PrimaryButton>
                <PrimaryButton className="btn-back" onClick={() => navigate(-1)}>이전으로</PrimaryButton>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalItems / pageSize)}
                onPageChange={onPageChange}
            />
        </PageWrapper>
    );
}

export default OrderHistoryCom;