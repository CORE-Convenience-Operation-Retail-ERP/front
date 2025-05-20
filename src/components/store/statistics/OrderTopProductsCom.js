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

export function OrderTopProductsCom({ data, loading }) {
    const COLORS = [
        "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1",
        "#d0ed57", "#a4de6c", "#d88884", "#b49eff", "#ffd6a5"
    ];

    const [mode, setMode] = useState("quantity"); // "quantity" or "amount"

    const emptyData = [{ productName: "데이터 없음", orderQuantity: 0, orderAmount: 0 }];
    const isEmpty = !data || data.length === 0;
    const chartData = isEmpty ? emptyData : data;

    const dataKey = mode === "quantity" ? "orderQuantity" : "orderAmount";
    const unit = mode === "quantity" ? "건" : "원";

    if (loading) return <div>로딩 중...</div>;

    return (
        <div style={{ marginTop: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>📦 상위 발주 상품</h3>
                <div>
                    <button
                        onClick={() => setMode("quantity")}
                        style={{ marginRight: "8px", fontWeight: mode === "quantity" ? "bold" : "normal" }}
                    >
                        수량 기준
                    </button>
                    <button
                        onClick={() => setMode("amount")}
                        style={{ fontWeight: mode === "amount" ? "bold" : "normal" }}
                    >
                        금액 기준
                    </button>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, bottom: 5, left: 100 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis dataKey="productName" type="category" />
                    <Tooltip formatter={(v) => `${v.toLocaleString()}${unit}`} />
                    <Bar dataKey={dataKey} barSize={20}>
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {isEmpty && <p style={{ textAlign: "center", marginTop: "0.5rem" }}>데이터 없음</p>}
        </div>
    );
}

export default OrderTopProductsCom;