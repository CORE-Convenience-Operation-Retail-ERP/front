import React, { useEffect, useState } from "react";
import CategorySalesDonutCom from "../../../components/store/statistics/CategorySalesDonutCom";
import { fetchCategorySales } from "../../../service/store/StatisticsService";
import { fetchAllDescendants } from "../../../service/store/CategoryService";

function CategorySalesDonutCon({ filters }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [colorOverrides, setColorOverrides] = useState({});

    //  로컬스토리지 색상 불러오기
    useEffect(() => {
        const savedColors = localStorage.getItem("categoryColors");
        if (savedColors) {
            setColorOverrides(JSON.parse(savedColors));
        }
    }, []);

    //  색상 변경 핸들러
    const handleColorChange = (categoryName, newColor) => {
        const updated = { ...colorOverrides, [categoryName]: newColor };
        setColorOverrides(updated);
        localStorage.setItem("categoryColors", JSON.stringify(updated));
    };

    //  통계 데이터 로드
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);

                let categoryIds = [];
                if (filters?.categoryId) {
                    categoryIds = await fetchAllDescendants(filters.categoryId); // 🎯 리팩토링된 fetch 함수 사용
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
    }, [filters]);

    return (
        <CategorySalesDonutCom
            data={data}
            loading={loading}
            colorOverrides={colorOverrides}
            onColorChange={handleColorChange}
        />
    );
}

export default CategorySalesDonutCon;
