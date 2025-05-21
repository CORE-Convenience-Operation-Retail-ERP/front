import React, { useEffect, useState } from "react";
import CategorySalesDonutCom from "../../../components/store/statistics/CategorySalesDonutCom";
import CategorySalesTableCom from "../../../components/store/statistics/CategorySalesTableCom";
import {
    fetchCategorySales
} from "../../../service/store/StatisticsService";
import {
    fetchAllDescendants,
    fetchParentCategories,
    fetchChildCategories
} from "../../../service/store/CategoryService";
import { selectStyle } from "../../../features/store/styles/statistics/CategorySalesDonut.styled";

function CategorySalesDonutCon({ filters, mode = "summary", showTable = false }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [colorOverrides, setColorOverrides] = useState({});

    const [parentCategories, setParentCategories] = useState([]);
    const [childCategories, setChildCategories] = useState([]);
    const [grandChildCategories, setGrandChildCategories] = useState([]);

    const [categoryFilter, setCategoryFilter] = useState({
        parentCategoryId: "",
        categoryId: "",
        subCategoryId: ""
    });

    // 색상 로딩
    useEffect(() => {
        const savedColors = localStorage.getItem("categoryColors");
        if (savedColors) {
            setColorOverrides(JSON.parse(savedColors));
        }
    }, []);

    const handleColorChange = (categoryName, newColor) => {
        const updated = { ...colorOverrides, [categoryName]: newColor };
        setColorOverrides(updated);
        localStorage.setItem("categoryColors", JSON.stringify(updated));
    };

    // 카테고리 목록 로딩
    useEffect(() => {
        fetchParentCategories().then(data => setParentCategories(data || []));
    }, []);

    const handleParentChange = async (id) => {
        setCategoryFilter({ parentCategoryId: id, categoryId: "", subCategoryId: "" });
        setChildCategories([]);
        setGrandChildCategories([]);
        if (id) {
            const children = await fetchChildCategories(id);
            setChildCategories(children || []);
        }
    };

    const handleChildChange = async (id) => {
        setCategoryFilter(prev => ({ ...prev, categoryId: id, subCategoryId: "" }));
        setGrandChildCategories([]);
        if (id) {
            const children = await fetchChildCategories(id);
            setGrandChildCategories(children || []);
        }
    };

    const handleSubChildChange = (id) => {
        setCategoryFilter(prev => ({ ...prev, subCategoryId: id }));
    };

    // 통계 로딩
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                let categoryIds = [];

                const selectedCategoryId =
                    categoryFilter.subCategoryId ||
                    categoryFilter.categoryId ||
                    categoryFilter.parentCategoryId;

                if (selectedCategoryId) {
                    categoryIds = await fetchAllDescendants(selectedCategoryId);
                }

                const stats = await fetchCategorySales({
                    storeId: filters.storeId,
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                    categoryIds: categoryIds.join(","),
                });

                setData(stats);
            } catch (err) {
                console.error("카테고리 매출 통계 조회 실패:", err);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        if (filters?.storeId) {
            load();
        }
    }, [filters, categoryFilter]);

    return (
        <div>
            {/* 🧭 카테고리 필터 */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
                <select
                    value={categoryFilter.parentCategoryId}
                    onChange={e => handleParentChange(e.target.value)}
                    style={selectStyle}
                >
                    <option value="">대분류 선택</option>
                    {parentCategories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                <select
                    value={categoryFilter.categoryId}
                    onChange={e => handleChildChange(e.target.value)}
                    style={selectStyle}
                >
                    <option value="">중분류 선택</option>
                    {childCategories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                <select
                    value={categoryFilter.subCategoryId}
                    onChange={e => handleSubChildChange(e.target.value)}
                    style={selectStyle}
                >
                    <option value="">소분류 선택</option>
                    {grandChildCategories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            {/* 🍩 도넛 차트 */}
            <CategorySalesDonutCom
                data={data}
                loading={loading}
                colorOverrides={colorOverrides}
                onColorChange={handleColorChange}
                mode={mode}
            />

            {/* 📋 상세 테이블 (옵션) */}
            {showTable && mode === "detail" && (
                <CategorySalesTableCom data={data} loading={loading} />
            )}
        </div>
    );
}

export default CategorySalesDonutCon;