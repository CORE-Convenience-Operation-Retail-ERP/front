import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductsAllCom from '../../components/headquarters/ProductsAllCom';
import HQStockUpdateModal from '../../components/headquarters/HQStockUpdateModal';
import axios from "../../service/axiosInstance";
import { recalculateHQStock, silentRecalculateAllHQStocks } from "../../service/headquarters/HQStockService";

const ProductsAllCon = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initPage = async () => {
      try {
        setIsRecalculating(true);
        await silentRecalculateAllHQStocks();
      } catch (error) {
        console.error("본사 재고 재계산 오류:", error);
      } finally {
        setIsRecalculating(false);
      }
      
      fetchProducts();
    };
    
    initPage();
  }, []);

  useEffect(() => {
    if (currentPage > 0) {
      fetchProducts();
    }
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`/api/products/paged?page=${currentPage}&size=10`);
      
      if (response.data && response.data.content) {
        console.log("받아온 상품 데이터:", response.data.content);
        
        const hasCategory = response.data.content.some(p => p.categoryName);
        const hasRecentDate = response.data.content.some(p => p.recentStockInDate);
        console.log("카테고리 필드 있음:", hasCategory);
        console.log("최근입고일 필드 있음:", hasRecentDate);
        
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalElements);
      } else {
        try {
          const allProductsResponse = await axios.get("/api/products/all");
          const allProducts = Array.isArray(allProductsResponse.data) ? allProductsResponse.data : [];
          
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
      
      try {
        const allProductsResponse = await axios.get("/api/products/all");
        const allProducts = Array.isArray(allProductsResponse.data) ? allProductsResponse.data : [];
        
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
  
  const handleUpdateHQStock = (productId, currentQuantity) => {
    setSelectedProduct({
      productId,
      quantity: currentQuantity
    });
    setModalVisible(true);
  };
  
  const handleHQStockUpdateSuccess = async () => {
    await fetchProducts();
    
    if (selectedProduct) {
      try {
        await recalculateHQStock(selectedProduct.productId);
      } catch (error) {
        console.error("재고 재계산 오류:", error);
      }
    }
  };

  return (
    <>
      <ProductsAllCom
        products={products || []}
        onRegister={handleRegister}
        onEdit={handleEdit}
        onDetail={handleDetail}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={handlePageChange}
        onUpdateHQStock={handleUpdateHQStock}
        isRecalculating={isRecalculating}
      />
      
      {modalVisible && selectedProduct && (
        <HQStockUpdateModal
          productId={selectedProduct.productId}
          initialQuantity={selectedProduct.quantity}
          onClose={() => setModalVisible(false)}
          onSuccess={handleHQStockUpdateSuccess}
        />
      )}
    </>
  );
};

export default ProductsAllCon; 