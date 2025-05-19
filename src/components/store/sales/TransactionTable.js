import React from 'react';
import * as XLSX from 'xlsx';
import Pagination from '../common/Pagination';

const TransactionTable = ({ rows = [], currentPage = 0, totalPages = 1, onPageChange }) => {

    const handleDownloadExcel = () => {
        const data = rows.map((row) => ({
          거래ID: row.transactionId,
          결제수단: row.paymentMethod,
          결제일시: new Date(row.paidAt).toLocaleString(),
          환불여부: row.isRefunded === 1 ? "환불" : "정상",
          상품명: row.productName,
          수량: row.salesQuantity,
          단가: row.unitPrice,
          할인액: row.discountPrice,
          결제금액: row.finalAmount,
          수익: row.realIncome,
          카테고리: row.category,
        }));
    
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "거래내역");
        XLSX.writeFile(workbook, "거래내역.xlsx");
      };

    return (
        <div style={{ overflowX: "auto", position: "relative", padding: "20px" }}>
          <style>{`
            .transaction-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 14px;
              margin-top: 20px;
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

            .excel-button {
              position: absolute;
              top: 20px;
              right: 20px;
              padding: 8px 16px;
              background-color: #2563eb;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              transition: all 0.2s ease;
            }

            .excel-button:hover {
              background-color: #1d4ed8;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            .pagination-container {
              margin-top: 20px;
              display: flex;
              justify-content: center;
            }
          `}</style>

            <button className="excel-button" onClick={handleDownloadExcel}>
                📥 엑셀 다운로드
            </button>

          <h2>거래내역</h2>
          <table className="transaction-table">
            <thead>
                <tr>
                    <th>상품명</th>
                    <th>결제일시</th>
                    <th>카테고리</th>
                    <th>수량</th>
                    <th>결제수단</th>
                    <th>단가</th>
                    <th>할인액</th>
                    <th>수익</th>
                    <th>총 결제액</th>
                    <th>환불여부</th>
                </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.transactionId}-${row.salesDetailId}`}>
                  <td>{row.productName || "-"}</td>
                  <td>{new Date(row.paidAt).toLocaleString()}</td>
                  <td>{row.category || "-"}</td>
                  <td>{row.salesQuantity}</td>
                  <td>{row.paymentMethod?.toUpperCase()}</td>
                  <td>{row.unitPrice?.toLocaleString()}원</td>
                  <td>{row.discountPrice?.toLocaleString()}원</td>
                  <td>{row.realIncome?.toLocaleString()}원</td>
                  <td>{row.finalAmount?.toLocaleString()}원</td>
                  <td>{row.isRefunded === 1 ? "환불" : "정상"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  );
};

export default TransactionTable;