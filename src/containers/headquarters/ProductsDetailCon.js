import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductsDetailCom from "../../components/headquarters/ProductsDetailCom";
import axios from "axios";

const ProductsDetailCon = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/products/detail/${id}`)
      .then(res => setDetail(res.data))
      .catch(err => console.error(err));
  }, [id]);

  return (
    <ProductsDetailCom
      detail={detail}
      onBack={() => navigate("/headquarters/products/all")}
      onEdit={() => navigate(`/headquarters/products/edit/${id}`)}
      onInOut={() => navigate(`/headquarters/products/inout?productId=${id}`)}
    />
  );
};

export default ProductsDetailCon;