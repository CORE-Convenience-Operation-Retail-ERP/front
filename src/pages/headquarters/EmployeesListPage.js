import React, { useState } from 'react';
import EmployeesListCon from '../../containers/headquarters/EmployeesListCon';

const EmployeesListPage = () => {
  const [search, setSearch] = useState({ empName: '' });

  return (
    <div style={{ padding: '40px 60px 0 60px', background: '#F8FAFB', minHeight: '100vh' }}>
      {/* 헤더/사이드바는 별도 컴포넌트로 분리해서 이곳에 배치 */}
      <EmployeesListCon />
    </div>
  );
};

export default EmployeesListPage; 