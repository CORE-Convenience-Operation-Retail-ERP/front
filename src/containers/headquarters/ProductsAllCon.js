import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductsAllCom from '../../components/headquarters/ProductsAllCom';
import axios from "axios";

const ProductsAllCon = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      // 페이징 API 사용
      const response = await axios.get(`/api/products/paged?page=${currentPage}&size=10`);
      
      // 응답 구조 확인 및 데이터 처리
      if (response.data && response.data.content) {
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalElements);
      } else {
        // 오류를 방지하기 위한 백업 처리
        try {
          // 기존 API 형식 시도
          const allProductsResponse = await axios.get("/api/products/all");
          const allProducts = Array.isArray(allProductsResponse.data) ? allProductsResponse.data : [];
          
          // 페이지 계산
          const start = currentPage * 10;
          const end = start + 10;
          const pagedProducts = allProducts.slice(start, end);
          
          setProducts(pagedProducts);
          setTotalPages(Math.ceil(allProducts.length / 10) || 1);
          setTotalItems(allProducts.length);
        } catch (error) {
          console.error("전체 제품 목록 로딩 실패:", error);
          setProducts([]);
          setTotalPages(0);
          setTotalItems(0);
        }
      }
    } catch (err) {
      console.error("페이징 제품 데이터 로딩 오류:", err);
      
      // 오류 발생 시 기존 API 시도
      try {
        const allProductsResponse = await axios.get("/api/products/all");
        const allProducts = Array.isArray(allProductsResponse.data) ? allProductsResponse.data : [];
        
        // 페이지 계산
        const start = currentPage * 10;
        const end = start + 10;
        const pagedProducts = allProducts.slice(start, end);
        
        setProducts(pagedProducts);
        setTotalPages(Math.ceil(allProducts.length / 10) || 1);
        setTotalItems(allProducts.length);
      } catch (error) {
        console.error("전체 제품 목록 로딩 실패:", error);
        setProducts([]);
        setTotalPages(0);
        setTotalItems(0);
      }
    }
  };

  const handleRegister = () => {
    navigate("/headquarters/products/register");
  };

  const handleEdit = (id) => {
    navigate(`/headquarters/products/edit/${id}`);
  };

  const handleDetail = (id) => {
    navigate(`/headquarters/products/detail/${id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <ProductsAllCom
      products={products || []}
      onRegister={handleRegister}
      onEdit={handleEdit}
      onDetail={handleDetail}
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      onPageChange={handlePageChange}
    />
  );
};

export default ProductsAllCon;