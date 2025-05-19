import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductsAllCom from '../../components/headquarters/ProductsAllCom';
import HQStockUpdateModal from '../../components/headquarters/HQStockUpdateModal';
import axios from "../../service/axiosInstance";
import { recalculateHQStock, silentRecalculateAllHQStocks } from "../../service/headquarters/HQStockService";

const ProductsAllCon = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    sort: "productId",
    order: "asc",
    status: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initPage = async () => {
      setLoading(true);
      try {
        setIsRecalculating(true);
        await silentRecalculateAllHQStocks();
        setIsRecalculating(false);
        
        const response = await axios.get("/api/products/all");
        if (Array.isArray(response.data)) {
          setProducts(response.data);
          setLoading(false);
          console.log("받아온 전체 상품 데이터:", response.data);
        } else {
          throw new Error("올바른 상품 데이터 형식이 아닙니다.");
        }
      } catch (error) {
        console.error("상품 데이터 로딩 오류:", error);
        setError("상품 데이터를 불러오는데 실패했습니다.");
        setLoading(false);
      }
    };
    
    initPage();
  }, []);

  useEffect(() => {
    if (!products.length) return;
    
    let filtered = [...products];
    
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(product => 
        (typeof product.proName === 'string' && product.proName.toLowerCase().includes(term)) ||
        (typeof product.proBarcode === 'string' && product.proBarcode.toLowerCase().includes(term)) ||
        (typeof product.categoryName === 'string' && product.categoryName.toLowerCase().includes(term))
      );
    }
    
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(product => filters.status.includes(product.status));
    }
    
    if (filters.sort) {
      filtered = [...filtered].sort((a, b) => {
        let compareResult;
        
        if (['productId', 'proStock', 'hqStock', 'proCost', 'proSellCost'].includes(filters.sort)) {
          compareResult = (a[filters.sort] || 0) - (b[filters.sort] || 0);
        } 
        else if (filters.sort === 'recentStockInDate') {
          compareResult = (a[filters.sort] || '').localeCompare(b[filters.sort] || '');
        }
        else {
          compareResult = (a[filters.sort] || '').localeCompare(b[filters.sort] || '');
        }
        
        return filters.order === 'asc' ? compareResult : -compareResult;
      });
    }
    
    setFilteredProducts(filtered);
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / 10));
  }, [search, filters, products]);

  useEffect(() => {
    if (filteredProducts.length > 0) {
      if (currentPage >= Math.ceil(filteredProducts.length / 10)) {
        setCurrentPage(Math.max(0, Math.ceil(filteredProducts.length / 10) - 1));
      }
    }
  }, [filteredProducts, currentPage]);

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
    if (selectedProduct) {
      try {
        await recalculateHQStock(selectedProduct.productId);
        
        const response = await axios.get("/api/products/all");
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("재고 업데이트 후 재계산 오류:", error);
      }
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(0);
  };

  const handleSortChange = (column) => {
    setFilters(prev => ({
      ...prev,
      sort: column,
      order: prev.sort === column && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getCurrentPageProducts = () => {
    const start = currentPage * 10;
    const end = start + 10;
    return filteredProducts.slice(start, end);
  };

  return (
    <>
      <ProductsAllCom
        products={getCurrentPageProducts()}
        onRegister={handleRegister}
        onEdit={handleEdit}
        onDetail={handleDetail}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={handlePageChange}
        onUpdateHQStock={handleUpdateHQStock}
        isRecalculating={isRecalculating || loading}
        search={search}
        onSearch={handleSearch}
        filters={filters}
        onSortChange={handleSortChange}
        error={error}
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