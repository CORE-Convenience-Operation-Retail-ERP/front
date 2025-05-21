import React from "react";
import styled from "styled-components";
import { Table } from "../../../features/store/styles/stock/StockList.styled";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ModalBox = styled.div`
  width: 700px;
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  margin: 100px auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 24px;
`;

const InfoGroup = styled.div`
  font-size: 15px;
  color: #444;
  line-height: 1.6;
  margin-bottom: 28px;

  div {
    margin-bottom: 6px;
  }

  span {
    font-weight: 600;
    color: #222;
    display: inline-block;
    min-width: 100px;
  }
`;

const StyledTable = styled(Table)`
  border: none;
  th, td {
    padding: 12px 10px;
    font-size: 14px;
    border-bottom: 1px solid #eee;
  }

  th {
    background: #f9fafb;
    font-weight: 600;
  }
`;

const Summary = styled.div`
  margin-top: 18px;
  text-align: right;
  font-size: 15px;
  font-weight: bold;
  color: #333;
`;

const RefundBox = styled.div`
  margin-top: 14px;
  background: #fef2f2;
  color: #991b1b;
  border-left: 4px solid #ef4444;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
`;

const CloseBtn = styled.button`
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 18px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #1d4ed8;
  }
`;

const TransactionDetailModal = ({ visible, onClose, transaction }) => {
  if (!visible || !transaction) return null;

  const items = transaction.items || transaction.details || [];

  const totalSum = items.reduce((sum, item) => {
    const subtotal = item.unitPrice * item.salesQuantity - item.discountPrice;
    return sum + subtotal;
  }, 0);

  const isRefunded = transaction.transactionStatus === 1;

  return (
    <Overlay>
      <ModalBox>
        <Title>거래 상세정보</Title>

        <InfoGroup>
          <div><span>거래 ID:</span> #{transaction.transactionId}</div>
          <div><span>결제수단:</span> {transaction.paymentMethod?.toUpperCase()}</div>
          <div><span>결제일시:</span> {new Date(transaction.paidAt).toLocaleString()}</div>
        </InfoGroup>

        <StyledTable>
          <thead>
            <tr>
              <th>상품명</th>
              <th>수량</th>
              <th>단가</th>
              <th>할인</th>
              <th>총액</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td>{item.productName || "-"}</td>
                <td>{item.salesQuantity}</td>
                <td>{item.unitPrice?.toLocaleString()}원</td>
                <td>{item.discountPrice?.toLocaleString()}원</td>
                <td>{(item.unitPrice * item.salesQuantity - item.discountPrice)?.toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
        </StyledTable>

        <Summary>합계 금액: {totalSum.toLocaleString()}원</Summary>

        {isRefunded && (
          <RefundBox>
            <div><strong>환불 사유:</strong> {transaction.refundReason || "없음"}</div>
            <div><strong>환불 일시:</strong> {new Date(transaction.refundedAt).toLocaleString()}</div>
          </RefundBox>
        )}

        <ButtonGroup>
          <CloseBtn onClick={onClose}>닫기</CloseBtn>
        </ButtonGroup>
      </ModalBox>
    </Overlay>
  );
};

export default TransactionDetailModal;
