import React, { useEffect } from 'react';
import CustomerInquiryCon from '../../containers/customer/CustomerInquiryCon';

const CustomerInquiryPage = () => {
  useEffect(() => {
    // 페이지 타이틀 직접 설정
    const originalTitle = document.title;
    document.title = '매장 문의하기';
    
    // 컴포넌트 언마운트 시 원래 타이틀로 복원
    return () => {
      document.title = originalTitle;
    };
  }, []);
  
  return <CustomerInquiryCon />;
};

export default CustomerInquiryPage; 