import React from "react";
import { useNavigate } from "react-router-dom";
import ProductsRegisterCom from "../../components/headquarters/ProductsRegisterCom";

const ProductsRegisterCon = () => {
  const navigate = useNavigate();

  // 등록 성공 시 상세페이지로 이동
  const handleSuccess = (productId) => {
    navigate(`/headquarters/products/detail/${productId}`);
  };

  // 취소 시 이전 페이지로 이동
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <ProductsRegisterCom
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
};

export default ProductsRegisterCon;