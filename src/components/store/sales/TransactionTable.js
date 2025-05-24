import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  Table
} from "../../../features/store/styles/common/Table.styled";

import {
  PageWrapper,
  TableWrapper,
  FilterActionRow,
  ActionGroup,
  FilterGroup
} from "../../../features/store/styles/common/PageLayout";

import {IconButton, IconOnlyButton, PrimaryButton} from "../../../features/store/styles/common/Button.styled";
import TransactionDetailModal from "./TransactionDetailModal";
import StoreSearchBar from "../common/StoreSearchBar";
import {AiOutlineSearch} from "react-icons/ai";
import {FiSearch} from "react-icons/fi";
import {IoIosSearch} from "react-icons/io";
import {BsFiletypeXlsx} from "react-icons/bs";

const TransactionTable = ({
                            rows = [],
                            filterOptions = [],
                            onSearch,
                          }) => {
  const [selectedTx, setSelectedTx] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleDownloadExcel = () => {
    const data = rows.map((row) => ({
      거래ID: row.transactionId,
      결제일시: new Date(row.paidAt).toLocaleString(),
      결제수단: row.paymentMethod,
      총결제금액: row.finalAmount,
      할인합계: row.discountTotal,
      환불여부: row.transactionStatus === 1 ? "환불" : "정상",
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
      <PageWrapper>
        <FilterActionRow style={{ justifyContent: "flex-end" }}>
          <FilterGroup>
            <StoreSearchBar
                filterOptions={filterOptions}
                onSearch={onSearch}
            />
          </FilterGroup>
          <ActionGroup>
            <IconButton onClick={handleDownloadExcel}>
              Excel
              <BsFiletypeXlsx />
            </IconButton>          </ActionGroup>
        </FilterActionRow>

        <TableWrapper>
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
                  <td>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        backgroundColor: row.paymentMethod?.toUpperCase() === 'CARD' ? '#e9ecef' : row.paymentMethod?.toUpperCase() === 'CASH' ? '#adb5bd' : '#ced4da',
                        color: '#495057',
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}
                    >
                      {row.paymentMethod?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ fontWeight: "bold" }}>{row.finalAmount?.toLocaleString()}원</td>
                  <td>{row.discountTotal?.toLocaleString()}원</td>
                  <td>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        backgroundColor: row.transactionStatus === 1 ? '#fee2e2' : '#dbeafe',
                        color: row.transactionStatus === 1 ? '#ef4444' : '#1d4ed8',
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}
                    >
                      {row.transactionStatus === 1 ? '환불' : '정상'}
                    </span>
                  </td>
                  <td>{row.items?.length || 0}건</td>
                  <td>
                    <IconOnlyButton onClick={() => handleOpenModal(row)}>
                      <FiSearch size={18} />
                    </IconOnlyButton>
                  </td>
                </tr>
            ))}
            </tbody>
          </Table>
        </TableWrapper>

        <TransactionDetailModal
            visible={showModal}
            onClose={handleCloseModal}
            transaction={selectedTx}
        />
      </PageWrapper>
  );
};

export default TransactionTable;