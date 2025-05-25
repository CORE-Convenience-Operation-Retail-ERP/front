import React from 'react';
import { Table } from '../../../features/store/styles/common/Table.styled';

const SettlementTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <p style={{ padding: '20px', fontSize: '16px', color: '#555' }}>
        조회된 정산 내역이 없습니다.
      </p>
    );
  }

  const typeLabelMap = {
    DAILY: '일별',
    SHIFT: '교대',
    MONTHLY: '월별',
    YEARLY: '연별'
  };

  return (
      <Table>
        <thead>
          <tr>
            <th>정산일</th>
            <th>정산유형</th>
            <th>총매출</th>
            <th>할인</th>
            <th>환불</th>
            <th>실매출</th>
            <th>거래건수</th>
            <th>환불건수</th>
            <th>정산방식</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => {
            const manual = item.settlementType === 'SHIFT' || item.isManual === 1;
            return (
              <tr key={item.settlementId}>
                <td>{item.settlementDate}</td>
                <td>{typeLabelMap[item.settlementType] || item.settlementType}</td>
                <td>{item.totalRevenue?.toLocaleString()}원</td>
                <td>{item.discountTotal?.toLocaleString()}원</td>
                <td>{item.refundTotal?.toLocaleString()}원</td>
                <td>{item.finalAmount?.toLocaleString()}원</td>
                <td>{item.transactionCount}</td>
                <td>{item.refundCount}</td>
                <td>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      backgroundColor: manual ? '#dbeafe' : '#f3f4f6',
                      color: manual ? '#1d4ed8' : '#6b7280',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}
                  >
                    {manual ? '수동' : '자동'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
  );
};

export default SettlementTable;
