import React from "react";
import {
  PageWrapper,
  PageSection,
  TableWrapper,
  HighlightId
} from "../../../features/store/styles/common/PageLayout";
import { Table } from "../../../features/store/styles/common/Table.styled";
import { PrimaryButton } from "../../../features/store/styles/common/Button.styled";
import Pagination from "../../../components/store/common/Pagination";

function OrderListCom({
                        orderList,
                        onRowClick,
                        getOrderStatusLabel,
                        onEditClick,
                        onDeleteClick,
                        onCancleClick,
                        currentPage,
                        totalPages,
                        onPageChange
                      }) {

  const userRole = localStorage.getItem("role");

  const getStatusBadgeStyle = (status) => {
    // 예시: 0=대기, 1=완료, 2=취소 등 상황에 맞게 색상 지정
    if (status === 0) {
      return {
        backgroundColor: '#dbeafe',
        color: '#1d4ed8',
      };
    } else if (status === 1) {
      return {
        backgroundColor: '#f3f4f6',
        color: '#6b7280',
      };
    } else if (status === 2) {
      return {
        backgroundColor: '#fee2e2',
        color: '#ef4444',
      };
    }
    return {
      backgroundColor: '#f3f4f6',
      color: '#6b7280',
    };
  };

  const renderCell = (order, content, col) => (
      col === 'status' ? (
        <td onClick={() => onRowClick(order.orderId)}>
          <span
            style={{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '12px',
              ...getStatusBadgeStyle(order.orderStatus)
            }}
          >
            {content}
          </span>
        </td>
      ) : (
        <td onClick={() => onRowClick(order.orderId)}>{content}</td>
      )
  );

  const renderActionButtons = (order) => {
    const isPending = order.orderStatus === 0;
    return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isPending && <PrimaryButton onClick={() => onEditClick(order.orderId)}>수정</PrimaryButton>}
          {userRole === "ROLE_HQ" && (
              <PrimaryButton onClick={() => onCancleClick(order.orderId)}>취소</PrimaryButton>
          )}
          {isPending && userRole === "ROLE_STORE" && (
              <PrimaryButton onClick={() => onDeleteClick(order.orderId)}>삭제</PrimaryButton>
          )}
        </div>
    );
  };

  return (
      <PageWrapper>
        <PageSection>
          <TableWrapper>
            <Table>
              <thead>
              <tr>
                <th>발주번호</th>
                <th>총 수량</th>
                <th>총 금액</th>
                <th>입고 일자</th>
                <th>상태</th>
                <th>작업</th>
              </tr>
              </thead>
              <tbody>
              {orderList.map(order => (
                  <tr key={order.orderId} style={{ cursor: 'pointer' }}>
                    {renderCell(order, <HighlightId>{order.orderId}</HighlightId>)}
                    {renderCell(order, order.totalQuantity)}
                    {renderCell(order, `${order.totalAmount?.toLocaleString() || 0}원`)}
                    {renderCell(order, order.orderDate ? new Date(order.orderDate).toLocaleString() : '-')}
                    {renderCell(order, getOrderStatusLabel(order.orderStatus), 'status')}
                    <td>{renderActionButtons(order)}</td>
                  </tr>
              ))}
              </tbody>
            </Table>
          </TableWrapper>

          <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
          />
        </PageSection>
      </PageWrapper>
  );
}

export default OrderListCom;
