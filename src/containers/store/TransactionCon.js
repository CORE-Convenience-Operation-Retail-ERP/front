import React, { useState } from "react";

const TransactionCon = ({ onSearch }) => {
  const [transactionId, setTransactionId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (transactionId) {
      onSearch(Number(transactionId));
      setTransactionId("");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="number"
        placeholder="거래 ID를 입력하세요"
        value={transactionId}
        onChange={(e) => setTransactionId(e.target.value)}
        required
      />
      <button type="submit">조회</button>
    </form>
  );
};

export default TransactionCon;
