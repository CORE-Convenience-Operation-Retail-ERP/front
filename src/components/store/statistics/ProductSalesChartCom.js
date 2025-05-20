import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";
import { useState } from "react";

export function ProductSalesChartCom({ data, loading, mode = "summary" }) {
    const COLORS = [
        "#8884d8", "#82ca9d", "#ffc658", "#ff8042",
        "#8dd1e1", "#d0ed57", "#a4de6c", "#d88884",
        "#b49eff", "#ffd6a5"
    ];

    const emptyData = [{ productName: "데이터 없음", totalAmount: 0 }];
    const isEmpty = !data || data.length === 0;

    const chartData = isEmpty
        ? emptyData
        : [...data]
            .sort((a, b) => b.totalAmount - a.totalAmount)
            .slice(0, mode === "detail" ? 10 : 5);

    const [activeIndex, setActiveIndex] = useState(null);

    if (loading) return <div>로딩 중...</div>;

    return (
        <div style={{ marginTop: "3.5rem" }}>
            <h3>💰 상품별 매출 순위</h3>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: -30 }}
                    onMouseLeave={() => setActiveIndex(null)}
                >
                    <XAxis
                        dataKey="productName"
                        angle={-15}
                        textAnchor="end"
                        interval={0}
                        height={80}
                    />
                    <YAxis
                        allowDecimals={false}
                        domain={[0, 'dataMax + 1000']}
                        tickFormatter={(v) => `${v.toLocaleString()}원`}
                    />
                    <Tooltip
                        formatter={(v) => `${v.toLocaleString()}원`}
                        contentStyle={{ fontSize: "14px" }}
                        cursor={{ fill: "transparent" }}
                        wrapperStyle={{ pointerEvents: "none" }}
                        onMouseMove={(e) => {
                            if (e && e.activeTooltipIndex != null) {
                                setActiveIndex(e.activeTooltipIndex);
                            }
                        }}
                    />
                    <Bar
                        dataKey="totalAmount"
                        barSize={30}
                        minPointSize={5}
                        isAnimationActive={false}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                style={
                                    index === activeIndex
                                        ? {
                                            filter: "brightness(1.15) saturate(1.1)",
                                            transition:
                                                "transform 0.2s ease, filter 0.2s ease, box-shadow 0.2s ease",
                                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                                            cursor: "pointer"
                                        }
                                        : {
                                            transform: "scale(1)",
                                            transition: "transform 0.2s ease"
                                        }
                                }
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            {isEmpty && (
                <p style={{ textAlign: "center", marginTop: "0.5rem" }}>데이터 없음</p>
            )}
        </div>
    );
}

export default ProductSalesChartCom;