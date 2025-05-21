import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchOrderDetail,
  registerOrder,
  updateOrder,
  fetchOrderProductList,
  fetchStoreList,
} from "../../../service/store/OrderService";
import {
  fetchParentCategories,
  fetchChildCategories,
} from "../../../service/store/CategoryService";
import OrderFormCom from "../../../components/store/order/OrderFormCom";

const PAGE_SIZE = 10;

export default function OrderFormCon() {
  const { id: orderId } = useParams();
  const isEdit = Boolean(orderId);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const defaultStoreId = localStorage.getItem("storeId");

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [storeOptions, setStoreOptions] = useState([]);

  const [searchParams, setSearchParams] = useState({
    storeId: role === "ROLE_HQ" ? "" : defaultStoreId,
    page: 0,
    size: PAGE_SIZE,
  });

  const [filters, setFilters] = useState({
    parentCategoryId: "",
    categoryId: "",
    subCategoryId: "",
  });

  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [grandChildCategories, setGrandChildCategories] = useState([]);

  const handleParentChange = id => {
    setFilters({ parentCategoryId: id, categoryId: '', subCategoryId: '' });
    setChildCategories([]);
    setGrandChildCategories([]);

    if (id) {
      fetchChildCategories(id).then(data => setChildCategories(data || [])).catch(console.error);
    }

    setSearchParams(prev => ({
      ...prev,
      categoryId: id || null,
      page: 0,
    }));
  };

  const handleChildChange = (id) => {
    setFilters(f => ({ ...f, categoryId: id, subCategoryId: '' }));
    setGrandChildCategories([]);
    if (id) fetchChildCategories(id).then(data => setGrandChildCategories(data || []));
    updateCategoryFilter(id);
  };

  const handleSubChildChange = (id) => {
    setFilters(f => ({ ...f, subCategoryId: id }));
    updateCategoryFilter(id);
  };

  const updateCategoryFilter = (categoryId) => {
    const finalCategoryId = categoryId || filters.subCategoryId || filters.categoryId || filters.parentCategoryId || null;
    setSearchParams(prev => ({ ...prev, categoryId: finalCategoryId, page: 0 }));
  };

  const cleanParams = (params) =>
      Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== null && v !== undefined && v !== "")
      );

  const handleSearch = useCallback(
      (params) => {
        const baseStoreId = role === "ROLE_MASTER" ? params.storeId || defaultStoreId : defaultStoreId;
        setSearchParams({ storeId: baseStoreId, ...params, page: 0, size: PAGE_SIZE });
        setPage(0);
      },
      [role, defaultStoreId]
  );

  const handleSubmit = useCallback(async () => {
    const items = selectedItems
        .filter((i) => i.quantity > 0)
        .map(({ productId, quantity, unitPrice }) => ({ productId, quantity, unitPrice }));

    if (!items.length) return alert("1개 이상의 유효한 상품을 선택해주세요.");
    if (!window.confirm(isEdit ? "발주를 수정하시겠습니까?" : "발주를 등록하시겠습니까?")) return;

    try {
      if (isEdit) await updateOrder(orderId, items);
      else await registerOrder({ storeId: defaultStoreId, items });
      alert(isEdit ? "발주 수정 완료!" : "발주 등록 완료!");
      navigate("/store/order/list");
    } catch (e) {
      alert(e.message || "처리 실패");
    }
  }, [isEdit, orderId, selectedItems, defaultStoreId, navigate]);

  useEffect(() => {
    if (role === "ROLE_MASTER") fetchStoreList().then(setStoreOptions);
    fetchParentCategories().then(setParentCategories);

    if (isEdit) {
      fetchOrderDetail(orderId)
          .then((res) => {
            const items = res.data.map((i) => ({
              productId: i.productId,
              quantity: i.orderQuantity,
              unitPrice: i.unitPrice,
              productName: i.productName,
            }));
            setSelectedItems(items);
          })
          .catch(() => {
            alert("기존 발주 조회 실패");
            navigate("/store/order/list");
          })
          .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isEdit, orderId, role, navigate]);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const params = cleanParams({ ...searchParams, page });
        const res = await fetchOrderProductList(params);
        setProducts(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
      } catch {
        alert("상품 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [searchParams, page]);

  const filterOptions = [
    { key: "productName", label: "상품명", type: "text" },
    { key: "barcode", label: "바코드", type: "number" },
    {
      key: "isPromo",
      label: "프로모션",
      type: "select",
      options: [
        { value: "", label: "전체" },
        { value: "0", label: "없음" },
        { value: "2", label: "1+1" },
        { value: "3", label: "2+1" },
      ],
    },
  ];

  if (loading) return <div>로딩 중...</div>;

  return (
      <OrderFormCom
          productList={products}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          onSubmit={handleSubmit}
          isEdit={isEdit}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          storeOptions={storeOptions}
          selectedStoreId={searchParams.storeId}
          onStoreChange={(id) => handleSearch({ storeId: id })}
          filterOptions={filterOptions}
          onSearch={handleSearch}
          parentCategories={parentCategories}
          childCategories={childCategories}
          grandChildCategories={grandChildCategories}
          filters={filters}
          onParentChange={handleParentChange}
          onChildChange={handleChildChange}
          onSubChildChange={handleSubChildChange}
      />
  );
}