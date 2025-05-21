import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  Wrapper,
  Table,
  DownloadButton,
} from  '../../../features/store/styles/stock/StockList.styled';
import TransactionDetailModal from "./TransactionDetailModal";

const TransactionTable = ({ rows = [] }) => {
  const [selectedTx, setSelectedTx] = useState(null); 
  const [showModal, setShowModal] = useState(false);  

  const handleDownloadExcel = () => {
    const data = rows.map((row) => ({
      거래ID: row.transactionId,
      결제일시: new Date(row.paidAt).toLocaleString(),
      결제수단: row.paymentMethod,
      총결제금액: row.finalAmount,
      할인합계: row.discountTotal,
      환불여부: row.transactionStatus === 1 ? '환불' : '정상',
      결제건수: row.details?.length || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "거래내역");
    XLSX.writeFile(workbook, "거래내역.xlsx");
  };

  const handleOpenModal = (transaction) => {
    setSelectedTx(transaction);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedTx(null);
    setShowModal(false);
  };

  return (
    <Wrapper>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
        <h2>거래내역</h2>
        <DownloadButton onClick={handleDownloadExcel}>엑셀 다운로드</DownloadButton>
      </div>

      <Table>
        <thead>
          <tr>
            <th>결제일시</th>
            <th>결제수단</th>
            <th>총 결제액</th>
            <th>할인 합계</th>
            <th>환불여부</th>
            <th>결제건수</th>
            <th>상세보기</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.transactionId}>
              <td>{new Date(row.paidAt).toLocaleString()}</td>
              <td>{row.paymentMethod?.toUpperCase()}</td>
              <td style={{fontWeight: 'bold' }}>
                {row.finalAmount?.toLocaleString()}원
              </td>
              <td>{row.discountTotal?.toLocaleString()}원</td>
              <td style={{ color: row.transactionStatus === 1 ? 'red' : '#111' }}>
                {row.transactionStatus === 1 ? '환불' : '정상'}
              </td>
              <td>{row.items?.length || 0}건</td>
              <td>
              <button onClick={() => handleOpenModal(row)}>🔍</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <TransactionDetailModal
        visible={showModal}
        onClose={handleCloseModal}
        transaction={selectedTx}
      />
      </Wrapper>
  );
};

export default TransactionTable;