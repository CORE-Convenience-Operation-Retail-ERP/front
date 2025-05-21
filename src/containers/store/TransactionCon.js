import React, { useEffect, useState } from "react";
import TransactionTable from "../../components/store/sales/TransactionTable";
import Pagination from "../../components/store/common/Pagination";
import { fetchTransactionsByStore } from "../../service/store/TransactionService";
import { PageTitle } from "../../features/store/styles/common/PageLayout";

const ITEMS_PER_PAGE = 10;

const TransactionCon = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

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
        const data = await fetchTransactionsByStore(storeId);
        setAllTransactions(data);
        setFilteredTransactions(data);
      } catch (error) {
        console.error("❌ 거래내역 불러오기 실패:", error);
      }
    };

    if (storeId) loadTransactions();
  }, [storeId]);

  const handleSearch = (params) => {
    const filtered = allTransactions.filter((row) =>
        Object.entries(params).every(([key, value]) => {
          const rowValue = row[key];
          if (typeof rowValue === "number") {
            return Number(value) === rowValue;
          }
          if (typeof rowValue === "string") {
            return rowValue.toUpperCase() === String(value).toUpperCase();
          }
          return String(rowValue) === String(value);
        })
    );

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  };

  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentData = filteredTransactions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  return (
      <>
        <PageTitle>거래내역</PageTitle>

        <TransactionTable
            rows={currentData}
            filterOptions={filterOptions}
            onSearch={handleSearch}
            currentPage={currentPage - 1}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page + 1)}
        />

        <Pagination
            currentPage={currentPage - 1}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page + 1)}
        />
      </>
  );
};

export default TransactionCon;