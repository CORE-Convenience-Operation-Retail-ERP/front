import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";
import { useState } from "react";
import { buttonStyle, activeStyle } from "../../../features/store/styles/statistics/CategorySalesDonut.styled";

export function OrderTopProductsCom({ data, loading, mode = "summary" }) {
    const COLORS = [
        "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1",
        "#d0ed57", "#a4de6c", "#d88884", "#b49eff", "#ffd6a5"
    ];

    const [metric, setMetric] = useState("quantity"); // "quantity" or "amount"
    const [activeIndex, setActiveIndex] = useState(null);

    const emptyData = [{ productName: "데이터 없음", orderQuantity: 0, orderAmount: 0 }];
    const isEmpty = !data || data.length === 0;
    const chartData = isEmpty ? emptyData : data;

    const visibleData = chartData.slice(0, mode === "detail" ? 10 : 5);

    const dataKey = metric === "quantity" ? "orderQuantity" : "orderAmount";
    const unit = metric === "quantity" ? "건" : "원";

    if (loading) return <div>로딩 중...</div>;

    return (
        <div style={{ marginTop: mode === "detail" ? "2rem" : "8rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>상위 발주 상품 {mode === "detail" && "(상세)"}</h3>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                        onClick={() => setMetric("quantity")}
                        style={{
                            ...buttonStyle,
                            ...(metric === "quantity" ? activeStyle : {})
                        }}
                    >
                        수량 기준
                    </button>
                    <button
                        onClick={() => setMetric("amount")}
                        style={{
                            ...buttonStyle,
                            ...(metric === "amount" ? activeStyle : {})
                        }}
                    >
                        금액 기준
                    </button>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={visibleData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, bottom: 5, left: 100 }}
                    onMouseLeave={() => setActiveIndex(null)}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis dataKey="productName" type="category" />
                    <Tooltip
                        formatter={(value) => `${value.toLocaleString()}${unit}`}
                        labelStyle={{ fontWeight: "bold" }}
                        wrapperStyle={{ pointerEvents: "none" }}
                    />
                    <Bar dataKey={dataKey} barSize={20} isAnimationActive={false}>
                        {visibleData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                style={
                                    index === activeIndex
                                        ? {
                                            transform: "scale(1.05)",
                                            transformOrigin: "left center",
                                            filter: "brightness(1.1)",
                                            transition: "transform 0.2s, filter 0.2s",
                                            cursor: "pointer"
                                        }
                                        : { transition: "transform 0.2s" }
                                }
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {isEmpty && (
                <p style={{ textAlign: "center", marginTop: "0.5rem" }}>
                    데이터 없음
                </p>
            )}
        </div>
    );
}

export default OrderTopProductsCom;
