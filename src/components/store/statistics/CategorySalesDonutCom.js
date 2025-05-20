import React, { useState, useMemo, useRef } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, Sector } from "recharts";
import CategoryColorPicker from "../common/CategoryColorPicker";
import {
    ChartWrapper,
    LegendItem,
    ColorCircle,
    PickerContainer
} from "../../../features/store/styles/statistics/CategorySalesDonut.styled";

function CategorySalesDonutCom({ data, loading, colorOverrides, onColorChange }) {
    const pickerRef = useRef(null);
    const DEFAULT_COLORS = [
        "#A8DADC", "#FFBCBC", "#FFD6A5", "#FDFFB6",
        "#CAFFBF", "#9BF6FF", "#BDB2FF", "#FFC6FF"
    ];
    const [activeCategory, setActiveCategory] = useState(null);

    const safeData = useMemo(() => {
        if (!Array.isArray(data) || data.length === 0) {
            return [{ categoryName: "데이터 없음", salesRatio: 1, isEmpty: true }];
        }

        const totalSales = data.reduce((sum, item) => sum + item.totalSales, 0);
        return data.map(item => ({
            categoryName: item.category,
            salesRatio: totalSales === 0 ? 0 : item.totalSales / totalSales,
            totalSales: item.totalSales,
        }));
    }, [data]);

    const activeIndex = safeData.findIndex((d) => d.categoryName === activeCategory);

    const renderActiveShape = (props) => {
        const {
            cx, cy,
            innerRadius, outerRadius,
            startAngle, endAngle,
            fill
        } = props;

        return (
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 10}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                filter="url(#shadow)"
                style={{ transition: "all 0.3s ease" }}
            />
        );
    };

    const handleTogglePicker = (categoryName) => {
        setActiveCategory(prev => prev === categoryName ? null : categoryName);
    };

    if (loading) return <div>로딩 중...</div>;

    const isEmpty = safeData.length === 1 && safeData[0].isEmpty;

    return (
        <ChartWrapper>
            <div>
                <h3>카테고리별 매출 비율</h3>

                {/* 카테고리별 분류 라벨 */}
                {!isEmpty && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "1rem" }}>
                        {safeData.map((entry, index) => (
                            <LegendItem
                                key={entry.categoryName}
                                onClick={() => handleTogglePicker(entry.categoryName)}
                                active={activeCategory === entry.categoryName}
                            >
                                <ColorCircle
                                    color={colorOverrides?.[entry.categoryName] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                                    active={activeCategory === entry.categoryName}
                                />
                                <span>{entry.categoryName}</span>
                            </LegendItem>
                        ))}
                    </div>
                )}

                <PieChart width={400} height={300}>
                    <defs>
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="4" dy="4" stdDeviation="3" floodColor="rgba(0, 0, 0, 0.4)" />
                        </filter>
                    </defs>
                    <Pie
                        data={safeData}
                        dataKey="salesRatio"
                        nameKey="categoryName"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ categoryName }) => categoryName}
                        activeIndex={activeIndex >= 0 ? activeIndex : null}
                        activeShape={renderActiveShape}
                    >
                        {safeData.map((entry, index) => {
                            const color = entry.isEmpty
                                ? "#E0E0E0"
                                : colorOverrides?.[entry.categoryName] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
                            return (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={color}
                                    onClick={entry.isEmpty ? null : () => handleTogglePicker(entry.categoryName)}
                                    style={{ cursor: entry.isEmpty ? "default" : "pointer" }}
                                />
                            );
                        })}
                    </Pie>
                    {!isEmpty && <Tooltip
                        formatter={(value, name, props) => {
                            const { categoryName, totalSales } = props.payload;
                            return [`${totalSales.toLocaleString()}원`, categoryName];
                        }}
                    />}
                    {!isEmpty && <Legend />}
                </PieChart>
            </div>

            <PickerContainer ref={pickerRef}>
                {activeCategory && (
                    <div style={{ position: "relative" }}>
                        {/* 닫기 버튼 */}
                        <button
                            onClick={() => setActiveCategory(null)}
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                background: "transparent",
                                border: "none",
                                fontSize: "1.2rem",
                                cursor: "pointer",
                                padding: "4px",
                                color: "#999",
                            }}
                            aria-label="닫기"
                        >
                            ×
                        </button>

                        {/* 실제 피커 */}
                        <CategoryColorPicker
                            categoryName={activeCategory}
                            onClose={() => setActiveCategory(null)}
                            currentColor={
                                colorOverrides?.[activeCategory] ||
                                DEFAULT_COLORS[
                                safeData.findIndex((d) => d.categoryName === activeCategory) %
                                DEFAULT_COLORS.length
                                    ]
                            }
                            onColorChange={onColorChange}
                        />
                    </div>
                )}
            </PickerContainer>

        </ChartWrapper>
    );
}

export default CategorySalesDonutCom;