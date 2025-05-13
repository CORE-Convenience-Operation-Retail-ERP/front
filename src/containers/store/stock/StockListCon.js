import React, { useEffect, useState } from 'react';
import StockListCom from '../../../components/store/stock/StockListCom';
import { fetchStoreStockList } from '../../../service/store/StockService';
import { fetchParentCategories, fetchChildCategories } from '../../../service/store/CategoryService';
import {
  applyInventoryCheck,
  applyInventoryCheckBulk,
  applyInventoryCheckAll,
  rollbackInventoryCheck
} from '../../../service/store/InventoryCheckService';

function StockListCon() {
  const [stockList, setStockList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [grandChildCategories, setGrandChildCategories] = useState([]);

  const [searchParams, setSearchParams] = useState({
    productName: '',
    barcode: '',
    categoryId: null,
    page: 0,
    size: 10,
  });

  const [filters, setFilters] = useState({
    parentCategoryId: '',
    categoryId: '',
    subCategoryId: '',
  });

  useEffect(() => {
    fetchParentCategories().then(data => setParentCategories(data || []));
  }, []);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await fetchStoreStockList(searchParams);
        setStockList(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [searchParams]);

  const handleApplyAllPendingChecks = async () => {
    if (!window.confirm("현재 매장의 모든 미반영 실사 데이터를 반영하시겠습니까?")) return;

    try {
      await applyInventoryCheckAll();
      alert("전체 실사 항목이 반영되었습니다.");
      setSearchParams(prev => ({ ...prev }));  // 목록 재조회
    } catch (err) {
      console.error("전체 반영 실패:", err);
      alert("전체 반영 중 오류가 발생했습니다.");
    }
  };

  const handleApplyCheck = async (checkId) => {
    if (!checkId) {
      alert("유효하지 않은 실사 ID입니다.");
      return;
    }

    if (!window.confirm("해당 실사를 반영하시겠습니까?")) return;

    try {
      await applyInventoryCheck(checkId);
      alert("실사 반영이 완료되었습니다.");
      setSearchParams(prev => ({ ...prev }));
    } catch (err) {
      console.error("실사 반영 실패:", err);
      alert("실사 반영 중 오류가 발생했습니다.");
    }
  };

  const handleApplyAll = async (checkIds) => {
    if (!checkIds.length) return alert("선택된 항목이 없습니다.");

    if (!window.confirm("선택된 실사를 모두 반영하시겠습니까?")) return;

    try {
      await applyInventoryCheckBulk(checkIds);
      alert("일괄 반영 완료");
      setSearchParams(prev => ({ ...prev }));
    } catch (e) {
      console.error("일괄 반영 오류:", e);
      alert("일괄 반영 실패");
    }
  };

  const handleParentChange = id => {
    setFilters({ parentCategoryId: id, categoryId: '', subCategoryId: '' });
    setChildCategories([]);
    setGrandChildCategories([]);

    if (id) {
      fetchChildCategories(id).then(data => setChildCategories(data || [])).catch(console.error);
    }

    setSearchParams(prev => ({
      ...prev,
      productName: '',
      barcode: '',
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

  const handleSearch = (params) => {
    setSearchParams(prev => ({
      ...prev,
      productName: params.productName || '',
      barcode: params.barcode || '',
      page: 0,
    }));
  };

  const handlePageChange = (newPage) => {
    setSearchParams(prev => ({ ...prev, page: newPage }));
  };

  const handleRollbackCheck = async (checkId) => {
    if (!window.confirm("해당 실사를 롤백하시겠습니까?")) return;

    try {
      await rollbackInventoryCheck(checkId);
      alert("실사 롤백이 완료되었습니다.");
      setSearchParams(prev => ({ ...prev })); // 데이터 새로고침
    } catch (err) {
      console.error("실사 롤백 실패:", err);
      alert("실사 롤백 중 오류가 발생했습니다.");
    }
  };

  return (
      <StockListCom
          stockList={stockList}
          isLoading={isLoading}
          currentPage={searchParams.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          parentCategories={parentCategories}
          childCategories={childCategories}
          grandChildCategories={grandChildCategories}
          onApplyCheck={handleApplyCheck}
          onApplyChecks={handleApplyAll}
          filters={filters}
          onParentChange={handleParentChange}
          onChildChange={handleChildChange}
          onSubChildChange={handleSubChildChange}
          onApplyAllPendingChecks={handleApplyAllPendingChecks}
          onRollbackCheck={handleRollbackCheck}
      />
  );
}

export default StockListCon;