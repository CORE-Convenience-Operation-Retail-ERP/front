import React from 'react';

const TransactionTable = ({ transactions }) => {
  return (
    <div style={{ overflowX: "auto" }}>
      <style>{`
        .transaction-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .transaction-table th,
        .transaction-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: center;
        }

        .transaction-table thead {
          background-color: #f5f5f5;
          font-weight: bold;
        }

        .transaction-table tbody tr:nth-child(even) {
          background-color: #fafafa;
        }

        .transaction-table tbody tr:hover {
          background-color: #f0f0ff;
        }
      `}</style>

      <h2>거래내역</h2>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>거래ID</th>
            <th>결제수단</th>
            <th>총 결제액</th>
            <th>결제일시</th>
            <th>환불여부</th>
            <th>상품명</th>
            <th>수량</th>
            <th>단가</th>
            <th>할인액</th>
            <th>결제금액</th>
            <th>수익</th>
            <th>카테고리명</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) =>
            transaction.details.map((detail) => (
              <tr key={`${transaction.transactionId}-${detail.salesDetailId}`}>
                <td>{transaction.transactionId}</td>
                <td>{transaction.paymentMethod}</td>
                <td>{transaction.finalAmount?.toLocaleString()}원</td>
                <td>{new Date(transaction.paidAt).toLocaleString()}</td>
                <td>{transaction.isRefunded === 1 ? '환불' : '정상'}</td>
                <td>{detail.productName || '-'}</td>
                <td>{detail.salesQuantity}</td>
                <td>{detail.unitPrice?.toLocaleString()}원</td>
                <td>{detail.discountPrice?.toLocaleString()}원</td>
                <td>{detail.finalAmount?.toLocaleString()}원</td>
                <td>{detail.realIncome?.toLocaleString()}원</td>
                <td>{detail.category || '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
