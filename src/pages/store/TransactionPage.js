import React, { useEffect, useState } from "react";
import TransactionTable from "../../components/store/sales/TransactionTable";
import { fetchTransactionsByStore } from "../../service/store/TransactionService";


const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const storeId = localStorage.getItem("storeId"); // 로그인 시 저장된 값

    const loadTransactions = async () => {
      try {
        const data = await fetchTransactionsByStore(storeId);
        setTransactions(data);
      } catch (error) {
        console.error("거래내역 불러오기 실패:", error);
      }
    };

    if (storeId) {
      loadTransactions();
    }
  }, []);

  return (
    <div>
      <TransactionTable transactions={transactions} />
    </div>
  );
};

export default TransactionPage;
