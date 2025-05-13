import React, { useState } from 'react';
import { initializeAllHQStocks, recalculateAllHQStocks } from '../../service/headquarters/HQStockService';

const HQStockManagement = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' 또는 'error'
  
  const handleInitialize = async () => {
    if (window.confirm('모든 상품의 본사 재고를 1000개로 초기화하시겠습니까?')) {
      setIsInitializing(true);
      setMessage('');
      
      try {
        const response = await initializeAllHQStocks();
        setMessage('본사 재고가 성공적으로 초기화되었습니다.');
        setMessageType('success');
      } catch (error) {
        setMessage(`초기화 실패: ${error.response?.data?.message || error.message}`);
        setMessageType('error');
      } finally {
        setIsInitializing(false);
      }
    }
  };
  
  const handleRecalculate = async () => {
    if (window.confirm('매장 재고를 기반으로 본사 재고를 재계산하시겠습니까?')) {
      setIsRecalculating(true);
      setMessage('');
      
      try {
        const response = await recalculateAllHQStocks();
        setMessage('본사 재고가 성공적으로 재계산되었습니다.');
        setMessageType('success');
      } catch (error) {
        setMessage(`재계산 실패: ${error.response?.data?.message || error.message}`);
        setMessageType('error');
      } finally {
        setIsRecalculating(false);
      }
    }
  };
  
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          disabled={isInitializing}
          onClick={handleInitialize}
          style={{
            padding: '8px 16px',
            background: '#f0ad4e',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: isInitializing ? 'not-allowed' : 'pointer'
          }}
        >
          {isInitializing ? '초기화 중...' : '본사 재고 초기화 (1000개/상품)'}
        </button>
        
        <button
          disabled={isRecalculating}
          onClick={handleRecalculate}
          style={{
            padding: '8px 16px',
            background: '#5bc0de',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: isRecalculating ? 'not-allowed' : 'pointer'
          }}
        >
          {isRecalculating ? '재계산 중...' : '본사 재고 재계산'}
        </button>
      </div>
      
      {message && (
        <div
          style={{
            marginTop: '8px',
            padding: '8px',
            borderRadius: '4px',
            background: messageType === 'success' ? '#dff0d8' : '#f2dede',
            color: messageType === 'success' ? '#3c763d' : '#a94442'
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default HQStockManagement;
