import React from 'react';
import { useParams } from 'react-router-dom';
import BranchFormCon from '../../containers/headquarters/BranchFormCon';

const BranchFormPage = () => {
  const { storeId } = useParams();
  const isEdit = Boolean(storeId);

  return (
    <div>
      <BranchFormCon isEdit={isEdit} storeId={storeId} />
    </div>
  );
};

export default BranchFormPage; 