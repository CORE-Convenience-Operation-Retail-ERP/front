import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductsRegisterCom from "../../components/headquarters/ProductsRegisterCom";
import axios from "../../service/axiosInstance";

const ProductsRegisterCon = () => {
  const navigate = useNavigate();
  const [categoryTree, setCategoryTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("/api/categories/tree");
        setCategoryTree(res.data);
      } catch (e) {
        setError("카테고리 정보를 불러오지 못했습니다.");
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  // 등록 성공 시 상세페이지로 이동
  const handleSuccess = (productId) => {
    navigate(`/headquarters/products/detail/${productId}`);
  };

  // 취소 시 이전 페이지로 이동
  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) return <div>카테고리 정보를 불러오는 중...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <ProductsRegisterCom
      onSuccess={handleSuccess}
      onCancel={handleCancel}
      categoryTree={categoryTree}
    />
  );
};

export default ProductsRegisterCon;