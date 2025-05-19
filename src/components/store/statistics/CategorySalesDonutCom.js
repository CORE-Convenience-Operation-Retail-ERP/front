import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, Sector } from "recharts";
import CategoryColorPicker from "../common/CategoryColorPicker";
import {
    ChartWrapper,
    LegendItem,
    ColorCircle,
    PickerContainer
} from "../../../features/store/styles/statistics/CategorySalesDonut.styled";

function CategorySalesDonutCom({ data, loading, colorOverrides, onColorChange }) {
    const DEFAULT_COLORS = [
        "#A8DADC", "#FFBCBC", "#FFD6A5", "#FDFFB6",
        "#CAFFBF", "#9BF6FF", "#BDB2FF", "#FFC6FF"
    ];
    const [activeCategory, setActiveCategory] = useState(null);

    const handleTogglePicker = (categoryName) => {
        setActiveCategory((prev) => (prev === categoryName ? null : categoryName));
    };

    const activeIndex = data.findIndex((d) => d.categoryName === activeCategory);

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

    if (loading) return <div>로딩 중...</div>;
    if (!data || data.length === 0) return <div>데이터 없음</div>;

    return (
        <ChartWrapper>
            {/*  도넛 차트 */}
            <div>
                <h3>카테고리별 매출 비율</h3>
                <PieChart width={400} height={300}>
                    <defs>
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="4" dy="4" stdDeviation="3" floodColor="rgba(0, 0, 0, 0.4)" />
                        </filter>
                    </defs>
                    <Pie
                        data={data}
                        dataKey="salesRatio"
                        nameKey="categoryName"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                        activeIndex={activeIndex >= 0 ? activeIndex : null}
                        activeShape={renderActiveShape}
                    >
                        {data.map((entry, index) => {
                            const color = colorOverrides[entry.categoryName] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
                            return (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={color}
                                    onClick={() => handleTogglePicker(entry.categoryName)}
                                    style={{ cursor: "pointer" }}
                                />
                            );
                        })}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>

                {/*  색상 클릭 핸들러 */}
                <div style={{ marginTop: "1rem" }}>
                    {data.map((entry, index) => {
                        const color = colorOverrides[entry.categoryName] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
                        return (
                            <LegendItem
                                key={entry.categoryName}
                                onClick={() => handleTogglePicker(entry.categoryName)}
                                active={activeCategory === entry.categoryName}
                            >
                                <ColorCircle
                                    color={color}
                                    active={activeCategory === entry.categoryName}
                                />
                                <span>{entry.categoryName}</span>
                            </LegendItem>
                        );
                    })}
                </div>
            </div>

            {/*  Picker */}
            <PickerContainer>
                {activeCategory && (
                    <CategoryColorPicker
                        categoryName={activeCategory}
                        currentColor={
                            colorOverrides[activeCategory] ||
                            DEFAULT_COLORS[
                            data.findIndex(d => d.categoryName === activeCategory) % DEFAULT_COLORS.length
                                ]
                        }
                        onColorChange={onColorChange}
                    />
                )}
            </PickerContainer>
        </ChartWrapper>
    );
}

export default CategorySalesDonutCom;
