// components/store/stock/history/StockHistorySummaryCom.jsx
import React from 'react';
import styled from 'styled-components';

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

  .plus {
    color: green;
    font-weight: bold;
  }

  .minus {
    color: red;
    font-weight: bold;
  }
`;

export default function StockHistorySummaryCom({ historyList = [] }) {
    return (
        <div>
            <h4>📦 수량 변화 로그 (최근 10건)</h4>
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
                            <td>{log.date?.slice(0, 10)}</td>
                            <td>{log.type}</td>
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
                            <td>{log.by}</td>
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
