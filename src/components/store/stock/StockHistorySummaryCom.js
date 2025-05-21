import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Table } from '../../../features/store/styles/common/Table.styled';

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

export default function StockHistorySummaryCom({
  historyList = [],
  productId,
  enableFilter = false,
  highlightDiff = false
}) {
  const navigate = useNavigate();

  return (
    <div>
      {enableFilter && (
        <div style={{ marginBottom: '12px', display: 'flex', gap: '12px' }}>
          <input type="text" placeholder="담당자 검색" style={{ padding: '6px', fontSize: '13px' }} />
          <input type="date" style={{ padding: '6px' }} />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0 }}>수량 변화 로그 (최근 10건)</h4>
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
                <td
                  style={{
                    color: highlightDiff
                      ? log.quantity > 0
                        ? 'green'
                        : log.quantity < 0
                        ? 'red'
                        : 'black'
                      : 'inherit'
                  }}
                >
                  {log.quantity > 0 ? `+${log.quantity}` : log.quantity}
                  {log.beforeQuantity != null && log.afterQuantity != null && (
                    <span
                      style={{
                        fontSize: '12px',
                        marginLeft: '6px',
                        color: '#666'
                      }}
                    >
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