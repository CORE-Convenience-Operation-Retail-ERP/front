import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductsEditCom from "../../components/headquarters/ProductsEditCom";
import axios from "../../service/axiosInstance";

const ProductsEditCon = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [categoryTree, setCategoryTree] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/products/detail/${id}`)
      .then(res => setDetail(res.data))
      .catch(err => console.error(err));
    axios.get("/api/categories/tree")
      .then(res => setCategoryTree(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleSubmit = async (form) => {
    await axios.put(`/api/products/edit/${id}`, form);
    alert("수정 완료!");
    navigate(`/headquarters/products/detail/${id}`);
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("/api/products/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data; // 업로드된 이미지 URL
  };

  return (
    <ProductsEditCom
      detail={detail}
      categoryTree={categoryTree}
      onSubmit={handleSubmit}
      onImageUpload={handleImageUpload}
      onCancel={() => navigate(`/headquarters/products/detail/${id}`)}
    />
  );
};

export default ProductsEditCon;