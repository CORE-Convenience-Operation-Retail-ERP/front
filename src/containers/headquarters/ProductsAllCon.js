import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductsAllCom from '../../components/headquarters/ProductsAllCom';
import axios from "axios";
const ProductsAllCon = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/products/all")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleRegister = () => {
    navigate("/headquarters/products/register");
  };

  const handleEdit = (id) => {
    navigate(`/headquarters/products/edit/${id}`);
  };

  const handleDetail = (id) => {
    navigate(`/headquarters/products/detail/${id}`);
  };

  return (
    <ProductsAllCom
      products={products}
      onRegister={handleRegister}
      onEdit={handleEdit}
      onDetail={handleDetail}
    />
  );
};

export default ProductsAllCon;