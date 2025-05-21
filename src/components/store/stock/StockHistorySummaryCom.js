import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  font-size: 14px;

  th, td {
    padding: 8px;
    border: 1px solid #ddd;
    text-align: center;
  }

  th {
    background-color: #f9f9f9;
  }
`;

const MoreLink = styled.div`
  text-align: right;
  margin-top: 8px;
  font-size: 13px;
  cursor: pointer;
  color: #007bff;

  &:hover {
    text-decoration: underline;
  }
`;

export default function StockHistorySummaryCom({ historyList = [], productId }) {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between'}}>
      <h4> 수량 변화 로그 (최근 10건)</h4>
      {productId && (
          <MoreLink onClick={() => navigate(`/store/stock/flow/search`)}>
            자세히 보러가기 →
          </MoreLink>
      )}
    </div>
      <Table>
        <thead>
          <tr>
            <th>날짜</th>
            <th>유형</th>
            <th>위치</th>
            <th>수량</th>
            <th>담당자</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          {historyList.length > 0 ? (
            historyList.map((log, idx) => (
              <tr key={idx}>
                <td>{log.flowDate?.slice(0, 10)}</td>
                <td>{log.flowTypeLabel || log.type}</td>
                <td>{log.location}</td>
                <td style={{
                  color: log.quantity > 0 ? 'green' : log.quantity < 0 ? 'red' : 'black'
                }}>
                  {log.quantity > 0 ? `+${log.quantity}` : log.quantity}
                  {log.beforeQuantity != null && log.afterQuantity != null && (
                    <span style={{ fontSize: '12px', marginLeft: '6px', color: '#666' }}>
                      ({log.beforeQuantity} → {log.afterQuantity})
                    </span>
                  )}
                </td>
                <td>{log.processedBy || log.by}</td>
                <td>{log.note}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>수량 변화 이력이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </Table>

    </div>
  );
}
