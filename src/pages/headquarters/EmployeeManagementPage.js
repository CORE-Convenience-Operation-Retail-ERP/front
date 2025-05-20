import React from 'react';
import EmployeeManagementCon from '../../containers/headquarters/EmployeeManagementCon';
import { useNavigate } from 'react-router-dom';

const EmployeeManagementPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <EmployeeManagementCon />
    </div>
  );
};

export default EmployeeManagementPage; 