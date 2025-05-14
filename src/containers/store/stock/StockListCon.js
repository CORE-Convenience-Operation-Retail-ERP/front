import React, { useEffect, useState } from 'react';
import StockListCom from '../../../components/store/stock/StockListCom';
import { fetchStoreStockList } from '../../../service/store/StockService';
import { fetchParentCategories, fetchChildCategories } from '../../../service/store/CategoryService';
import {
  applyInventoryCheck,
  applyInventoryCheckBulk,
  applyInventoryCheckAll,
  rollbackInventoryCheck,
  rollbackInventoryCheckBulk,
  rollbackInventoryCheckAll
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

  const handleApplyCheck = async (checkItemId) => {
    if (!checkItemId) return;
    if (!window.confirm("해당 실사를 반영하시겠습니까?")) return;

    try {
      await applyInventoryCheck(checkItemId);
      alert("실사 반영이 완료되었습니다.");
      setSearchParams(prev => ({ ...prev }));
    } catch (err) {
      console.error("실사 반영 실패:", err);
      alert("실사 반영 중 오류가 발생했습니다.");
    }
  };

  const handleApplyChecks = async (checkItemIds = []) => {
    try {
      if (checkItemIds.length > 0) {
        if (!window.confirm("선택된 실사를 모두 반영하시겠습니까?")) return;
        await applyInventoryCheckBulk(checkItemIds);
        alert("선택 항목 반영 완료");
      } else {
        if (!window.confirm("전체 미반영 실사를 반영하시겠습니까?")) return;
        await applyInventoryCheckAll();
        alert("전체 반영 완료");
      }
      setSearchParams(prev => ({ ...prev }));
    } catch (err) {
      console.error("실사 반영 오류:", err);
      alert("실사 반영 중 오류가 발생했습니다.");
    }
  };

  const handleRollbackCheck = async (checkItemId) => {
    if (!window.confirm("해당 실사를 롤백하시겠습니까?")) return;

    try {
      await rollbackInventoryCheck(checkItemId);
      alert("실사 롤백이 완료되었습니다.");
      setSearchParams(prev => ({ ...prev }));
    } catch (err) {
      console.error("실사 롤백 실패:", err);
      alert("실사 롤백 중 오류가 발생했습니다.");
    }
  };

  const handleRollbackChecks = async (checkItemIds = []) => {
    try {
      if (checkItemIds.length > 0) {
        if (!window.confirm("선택된 실사를 롤백하시겠습니까?")) return;
        await rollbackInventoryCheckBulk(checkItemIds);
        alert("선택 항목 롤백 완료");
      } else {
        if (!window.confirm("전체 반영된 실사를 롤백하시겠습니까?")) return;
        await rollbackInventoryCheckAll();
        alert("전체 롤백 완료");
      }
      setSearchParams(prev => ({ ...prev }));
    } catch (err) {
      console.error("실사 롤백 오류:", err);
      alert("실사 롤백 중 오류가 발생했습니다.");
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
          onApplyChecks={handleApplyChecks}
          onRollbackCheck={handleRollbackCheck}
          onRollbackChecks={handleRollbackChecks}
          filters={filters}
          onParentChange={handleParentChange}
          onChildChange={handleChildChange}
          onSubChildChange={handleSubChildChange}
      />
  );
}

export default StockListCon;