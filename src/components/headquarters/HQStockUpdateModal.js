import React, { useState, useEffect } from 'react';
import { updateHQStock } from '../../service/headquarters/HQStockService';

const HQStockUpdateModal = ({ productId, initialQuantity, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState(initialQuantity || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    setQuantity(initialQuantity || 0);
  }, [initialQuantity]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (quantity < 0) {
      setError('재고 수량은 음수가 될 수 없습니다.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await updateHQStock(productId, quantity);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      setError(`재고 업데이트 실패: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '300px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ marginTop: 0 }}>본사 재고 수정</h3>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              재고 수량:
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
          
          {error && (
            <div style={{
              color: '#a94442',
              backgroundColor: '#f2dede',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px'
            }}>
              {error}
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              취소
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '8px 16px',
                backgroundColor: '#5bc0de',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? '처리 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HQStockUpdateModal;