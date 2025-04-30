import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: #eef2ff;
  padding: 20px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const Amount = styled.div`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const Rate = styled.div`
  font-size: 14px;
  color: ${({ up }) => (up ? '#16a34a' : '#dc2626')};
  margin-bottom: 16px;
`;

const AlertList = styled.ul`
  padding-left: 18px;
  font-size: 13px;
  color: #374151;
`;

const AmountRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 15px;
  margin-bottom: 16px;
`;

const SalesSummaryCard = ({ sales, rate, alerts }) => {
  const isUp = rate >= 0;

  return (
    <Card>
      <Title>오늘 매출</Title>
      <AmountRow>
        <Amount>{sales.toLocaleString()}원</Amount>
        <Rate up={isUp}>
          {isUp ? '▲' : '▼'} {Math.abs(rate).toFixed(1)}%
        </Rate>
      </AmountRow>
      <AlertList>
        {alerts.map((msg, idx) => (
          <li key={idx}>• {msg}</li>
        ))}
      </AlertList>
    </Card>
  );
};

export default SalesSummaryCard;
