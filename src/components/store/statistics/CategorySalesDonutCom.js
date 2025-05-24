import React, { useState, useMemo, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Sector } from "recharts";
import CategoryColorPicker from "../common/CategoryColorPicker";
import {
    ChartWrapper,
    LegendItem,
    ColorCircle,
} from "../../../features/store/styles/statistics/CategorySalesDonut.styled";
import { createPortal } from "react-dom";

function CategorySalesDonutCom({ data, loading, colorOverrides, onColorChange, mode = "summary" }) {
    const DEFAULT_COLORS = [
        "#A8DADC", "#FFBCBC", "#FFD6A5", "#FDFFB6",
        "#CAFFBF", "#9BF6FF", "#BDB2FF", "#FFC6FF"
    ];

    const [activeCategory, setActiveCategory] = useState(null);
    const [pickerPos, setPickerPos] = useState(null);

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

    const handleTogglePicker = (categoryName, event) => {
        const rect = event.target.getBoundingClientRect();
        setActiveCategory(prev => prev === categoryName ? null : categoryName);
        setPickerPos({
            x: rect.left + rect.width / 2,
            y: rect.top - 10
        });
    };

    const handleClickOutside = (event) => {
        if (!event.target.closest(".picker-portal")) {
            setActiveCategory(null);
            setPickerPos(null);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (loading) return <div>로딩 중...</div>;

    const isEmpty = safeData.length === 1 && safeData[0].isEmpty;

    return (
        <ChartWrapper>
            <div>
            <h3 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "0.5em"}}>
                시간대별 매출 차트
            </h3>

                {!isEmpty && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "1rem" }}>
                        {safeData.map((entry, index) => (
                            <LegendItem
                                key={entry.categoryName}
                                onClick={(e) => handleTogglePicker(entry.categoryName, e)}
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

                <PieChart width={400} height={200} style={{ height: "280px" }}>
                    <defs>
                        <filter id="shadow" x="-20%" y="-20%" width="150%" height="140%">
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
                                    onClick={(e) => !entry.isEmpty && handleTogglePicker(entry.categoryName, e)}
                                    style={{ cursor: entry.isEmpty ? "default" : "pointer" }}
                                />
                            );
                        })}
                    </Pie>
                    {!isEmpty && <Tooltip
                        formatter={(value, name, props) => {
                            const { categoryName, totalSales, salesRatio } = props.payload;
                            const ratioText = mode === "detail" ? ` (${(salesRatio * 100).toFixed(1)}%)` : "";
                            return [`${totalSales.toLocaleString()}원`, categoryName + ratioText];
                        }}
                    />}
                </PieChart>
            </div>

            {activeCategory && pickerPos && createPortal(
                <div
                    className="picker-portal"
                    style={{
                        position: "absolute",
                        top: pickerPos.y,
                        left: pickerPos.x,
                        transform: "translate(-50%, -100%)",
                        zIndex: 9999
                    }}
                >
                    <CategoryColorPicker
                        categoryName={activeCategory}
                        onClose={() => {
                            setActiveCategory(null);
                            setPickerPos(null);
                        }}
                        currentColor={
                            colorOverrides?.[activeCategory] ||
                            DEFAULT_COLORS[
                            safeData.findIndex((d) => d.categoryName === activeCategory) %
                            DEFAULT_COLORS.length
                                ]
                        }
                        onColorChange={onColorChange}
                    />
                </div>,
                document.body
            )}
        </ChartWrapper>
    );
}

export default CategorySalesDonutCom;
