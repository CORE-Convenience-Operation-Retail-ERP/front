import React, { useEffect, useState } from "react";
import TransactionTable from "../../components/store/sales/TransactionTable";
import Pagination from "../../components/store/common/Pagination";
import { fetchTransactionsByStore } from "../../service/store/TransactionService";
import { PageTitle, PageWrapper, TableSection, FilterActionRow, ActionGroup, FilterGroup } from "../../features/store/styles/common/PageLayout";
import LoadingLottie from '../../components/common/LoadingLottie.tsx';
import StoreSearchBar from "../../components/store/common/StoreSearchBar";
import TransactionDetailModal from "../../components/store/sales/TransactionDetailModal";
import * as XLSX from "xlsx";
import { IconButton } from "../../features/store/styles/common/Button.styled";
import { BsFiletypeXlsx } from "react-icons/bs";

const ITEMS_PER_PAGE = 10;

const TransactionCon = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const storeId = localStorage.getItem("storeId");

  const filterOptions = [
    {
      key: "paymentMethod",
      label: "결제수단",
      type: "select",
      options: [
        { value: "CARD", label: "카드" },
        { value: "CASH", label: "현금" },
      ],
    },
    {
      key: "transactionStatus",
      label: "거래 상태",
      type: "select",
      options: [
        { value: 0, label: "정상" },
        { value: 1, label: "환불" },
      ],
    },
  ];

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        const data = await fetchTransactionsByStore(storeId);
        setAllTransactions(data);
        setFilteredTransactions(data);
      } catch (error) {
        console.error("❌ 거래내역 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) loadTransactions();
  }, [storeId]);

  const handleSearch = (params) => {
    const filtered = allTransactions.filter((row) =>
      Object.entries(params).every(([key, value]) => {
        const rowValue = row[key];
        if (typeof rowValue === "number") return Number(value) === rowValue;
        if (typeof rowValue === "string") return rowValue.toUpperCase() === String(value).toUpperCase();
        return String(rowValue) === String(value);
      })
    );

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  };

  const handleDownloadExcel = () => {
    const data = filteredTransactions.map((row) => ({
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

  const handleDetailOpen = (tx) => {
    setSelectedTx(tx);
    setShowModal(true);
  };

  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentData = filteredTransactions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  if (loading) return <LoadingLottie />;

  return (
    <PageWrapper>
      <PageTitle>| 거래내역</PageTitle>

      <FilterActionRow style={{ justifyContent: "flex-end", marginBottom: "-1px" }}>
        <FilterGroup>
          <StoreSearchBar filterOptions={filterOptions} onSearch={handleSearch} />
        </FilterGroup>
        <ActionGroup>
          <IconButton onClick={handleDownloadExcel}>
            Excel
            <BsFiletypeXlsx />
          </IconButton>
        </ActionGroup>
      </FilterActionRow>

      <TableSection>
        <TransactionTable
          rows={currentData}
          onDetailClick={handleDetailOpen}
        />
        <Pagination
          currentPage={currentPage - 1}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page + 1)}
        />
      </TableSection>

      <TransactionDetailModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        transaction={selectedTx}
      />
    </PageWrapper>
  );
};

export default TransactionCon;
