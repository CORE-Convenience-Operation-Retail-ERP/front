import React from 'react';
import StoreSearchBar from '../../components/store/common/StoreSearchBar';

function TransactionCon({ onSearch }) {
  const filterOptions = [
    {
      key: "transactionId",
      label: "거래 ID",
      type: "number",
      placeholder: "거래 ID 입력"
    },
    {
      key: "paymentMethod",
      label: "결제수단",
      type: "select",
      options: [
        { value: "CARD", label: "카드" },
        { value: "CASH", label: "현금" }
      ]
    }
  ];

  return (
    <StoreSearchBar filterOptions={filterOptions} onSearch={onSearch} />
  );
}

export default TransactionCon;
