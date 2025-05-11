import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchOrderDetail,
  registerOrder,
  updateOrder,
  fetchOrderProductList,
  fetchStoreList,
} from "../../../service/store/OrderService";
import { fetchParentCategories, fetchChildCategories } from '../../../service/store/CategoryService';
import OrderFormCom from "../../../components/store/order/OrderFormCom";
import Pagination from "../../../components/store/common/Pagination";
import StoreSearchBar from "../../../components/store/common/StoreSearchBar";

function OrderFormCon() {
  const { id: orderId } = useParams();
  const isEdit = !!orderId;
  const navigate = useNavigate();
  const PAGE_SIZE = 10;

  const [allProducts, setAllProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({});
  const [storeOptions, setStoreOptions] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [grandChildCategories, setGrandChildCategories] = useState([]);
  const [filters, setFilters] = useState({
    parentCategoryId: "",
    categoryId: "",
    subCategoryId: ""
  });

  const loadProducts = useCallback(async (params = {}) => {
    const cleanParams = {
      page: params.page ?? 0,
      size: PAGE_SIZE,
      storeId: params.storeId || searchParams.storeId || localStorage.getItem("storeId"),
      ...(params.productName && { productName: params.productName }),
      ...(params.barcode && { barcode: params.barcode }),
      ...(params.categoryId && { categoryId: params.categoryId }),
      ...(params.isPromo && { isPromo: params.isPromo }),
    };

    try {
      const res = await fetchOrderProductList(cleanParams);
      setAllProducts(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("상품 정보 로딩 실패:", err);
      alert("상품 정보를 불러오지 못했습니다.");
    }
  }, [searchParams]);

  const handleCategoryChange = async (level, id) => {
    const updatedFilters = { ...filters };

    if (level === "parent") {
      updatedFilters.parentCategoryId = id;
      updatedFilters.categoryId = "";
      updatedFilters.subCategoryId = "";
      setChildCategories([]);
      setGrandChildCategories([]);
      if (id) fetchChildCategories(id).then(setChildCategories);
    } else if (level === "child") {
      updatedFilters.categoryId = id;
      updatedFilters.subCategoryId = "";
      setGrandChildCategories([]);
      if (id) fetchChildCategories(id).then(setGrandChildCategories);
    } else if (level === "sub") {
      updatedFilters.subCategoryId = id;
    }

    setFilters(updatedFilters);
    const selectedCategory = updatedFilters.subCategoryId || updatedFilters.categoryId || updatedFilters.parentCategoryId;
    setSearchParams(prev => ({ ...prev, categoryId: selectedCategory || null, page: 0 }));
    loadProducts({ ...searchParams, categoryId: selectedCategory || null, page: 0 });
  };

  useEffect(() => {
    if (localStorage.getItem("role") === "ROLE_HQ") {
      fetchStoreList().then(setStoreOptions);
    }
    fetchParentCategories().then(setParentCategories);
  }, []);

  const loadInitialOrder = useCallback(async () => {
    if (!isEdit) return setLoading(false);
    try {
      const res = await fetchOrderDetail(orderId);
      const mapped = res.data.map(item => ({
        productId: item.productId,
        quantity: item.orderQuantity,
        unitPrice: item.unitPrice,
        productName: item.productName,
      }));
      setSelectedItems(mapped);
    } catch {
      alert("기존 발주 조회 실패");
      navigate("/store/order/list");
    } finally {
      setLoading(false);
    }
  }, [isEdit, orderId, navigate]);

  useEffect(() => {
    loadProducts({ ...searchParams, page });
  }, [loadProducts, searchParams, page]);

  useEffect(() => {
    loadInitialOrder();
  }, [loadInitialOrder]);

  const handleSubmit = async () => {
    const items = selectedItems
      .filter(item => item.quantity > 0)
      .map(({ productId, quantity, unitPrice }) => ({ productId, quantity, unitPrice }));

    if (!items.length) return alert("1개 이상의 유효한 상품을 선택해주세요.");

    const confirmMessage = isEdit ? "정말 발주를 수정하시겠습니까?" : "정말 발주를 등록하시겠습니까?";
    if (!window.confirm(confirmMessage)) return;

    try {
      if (isEdit) {
        await updateOrder(orderId, items);
        alert("발주 수정 완료!");
      } else {
        await registerOrder({ storeId: localStorage.getItem("storeId"), items });
        alert("발주 등록 완료!");
      }
      navigate("/store/order/list");
    } catch (err) {
      alert(err?.message || "처리 실패");
    }
  };

  const handleSearch = (params) => {
    const role = localStorage.getItem("role");
    const defaultStoreId = localStorage.getItem("storeId");

    const newParams = {
      storeId: role === "ROLE_HQ" ? params.storeId || "" : defaultStoreId,
      ...params,
    };

    setPage(0);
    setSearchParams(newParams);
    loadProducts({ ...newParams, page: 0 });
  };

  const filterOptions = [
    { key: "productName", label: "상품명", type: "text" },
    { key: "barcode", label: "바코드", type: "number" },
    {
      key: "categoryId", label: "카테고리", type: "tree", 
      parentCategories, 
      childCategories, 
      grandChildCategories, 
      filters, 
      onParentChange: id => handleCategoryChange("parent", id),
      onChildChange: id => handleCategoryChange("child", id),
      onSubChildChange: id => handleCategoryChange("sub", id),
    },
    {
      key: "isPromo", label: "프로모션", type: "select", options: [
        { value: "", label: "전체" },
        { value: "0", label: "없음" },
        { value: "2", label: "1+1" },
        { value: "3", label: "2+1" },
      ]
    }
  ];

  if (loading) return <div>로딩 중...</div>;

  return (
    <>
      <StoreSearchBar filterOptions={filterOptions} onSearch={handleSearch} />
      <OrderFormCom
        productList={allProducts}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        onSubmit={handleSubmit}
        isEdit={isEdit}
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          setPage(newPage);
          loadProducts({ ...searchParams, page: newPage });
        }}
        storeOptions={storeOptions}
        selectedStoreId={searchParams.storeId || ""}
        onStoreChange={e => handleSearch({ storeId: e.target.value })}
      />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          setPage(newPage);
          loadProducts({ ...searchParams, page: newPage });
        }}
      />
    </>
  );
}

export default OrderFormCon;