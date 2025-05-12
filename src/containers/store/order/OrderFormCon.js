// src/containers/store/order/OrderFormCon.js
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
import Pagination from "../../../components/store/common/Pagination";
import StoreSearchBar from "../../../components/store/common/StoreSearchBar";

const PAGE_SIZE = 10;

// 공통: Null, 빈 값 제거
const cleanParams = (params) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== null && v !== undefined && v !== ""
    )
  );

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
  const [searchParams, setSearchParams] = useState({
    storeId: role === "ROLE_HQ" ? "" : defaultStoreId,
    page: 0,
    size: PAGE_SIZE,
  });
  const [storeOptions, setStoreOptions] = useState([]);

  // 카테고리 트리 상태
  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [grandChildCategories, setGrandChildCategories] = useState([]);
  const [filters, setFilters] = useState({
    parentCategoryId: "",
    categoryId: "",
    subCategoryId: "",
  });

  // 초기 로드: 매장 리스트(본사), 카테고리, 기존 발주
  useEffect(() => {
    if (role === "ROLE_HQ") fetchStoreList().then(setStoreOptions);
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

  // 상품 목록 로드
  useEffect(() => {
    async function load() {
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
    load();
  }, [searchParams, page]);

  // 카테고리 변경 핸들러 공통
  const handleCategoryChange = useCallback(
    (level, id) => {
      const f = { ...filters };
      if (level === "parent") {
        f.parentCategoryId = id; f.categoryId = ""; f.subCategoryId = "";
        setChildCategories([]); setGrandChildCategories([]);
        if (id) fetchChildCategories(id).then(setChildCategories);
      }
      if (level === "child") {
        f.categoryId = id; f.subCategoryId = "";
        setGrandChildCategories([]);
        if (id) fetchChildCategories(id).then(setGrandChildCategories);
      }
      if (level === "sub") {
        f.subCategoryId = id;
      }
      setFilters(f);
      const cat = f.subCategoryId || f.categoryId || f.parentCategoryId || null;
      setSearchParams((p) => ({ ...p, categoryId: cat, page: 0 }));
      setPage(0);
    },
    [filters]
  );

  // 검색 핸들러 (상품명, 바코드, 프로모션, 매장 변경 등)
  const handleSearch = useCallback(
    (params) => {
      const base = role === "ROLE_HQ" ? params.storeId || defaultStoreId : defaultStoreId;
      setSearchParams({ storeId: base, ...params, page: 0, size: PAGE_SIZE });
      setPage(0);
    },
    [role, defaultStoreId]
  );

  // 발주 제출
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

  if (loading) return <div>로딩 중...</div>;

  const filterOptions = [
    { key: "productName", label: "상품명", type: "text" },
    { key: "barcode", label: "바코드", type: "number" },
    {
      key: "categoryId",
      label: "카테고리",
      type: "tree",
      filters,
      parentCategories,
      childCategories,
      grandChildCategories,
      onParentChange: (id) => handleCategoryChange("parent", id),
      onChildChange:  (id) => handleCategoryChange("child",  id),
      onSubChildChange:(id) => handleCategoryChange("sub",    id),
    },
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

  return (
    <>
      <StoreSearchBar filterOptions={filterOptions} onSearch={handleSearch} />
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
      />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
}
