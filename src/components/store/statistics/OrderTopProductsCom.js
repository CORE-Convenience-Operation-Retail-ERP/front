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

export function OrderTopProductsCom({ data, loading }) {
    const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#d0ed57", "#a4de6c", "#d88884", "#b49eff", "#ffd6a5"];

    if (loading) return <div>로딩 중...</div>;
    if (!data || data.length === 0) return <div>데이터 없음</div>;

    return (
        <div style={{ marginTop: "2rem" }}>
            <h3>📦 상위 발주 상품</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 20, right: 30, bottom: 5, left: 100 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis dataKey="productName" type="category" />
                    <Tooltip formatter={(v) => `${v}건`} />
                    <Bar dataKey="orderCount" barSize={20}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default OrderTopProductsCom;