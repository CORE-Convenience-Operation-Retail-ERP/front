import {Bar, CartesianGrid, Cell, BarChart, ResponsiveContainer, XAxis, YAxis} from "recharts";
import {Tooltip} from "chart.js";

export function ProductSalesChartCom({ data, loading }) {
    const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#d0ed57", "#a4de6c", "#d88884", "#b49eff", "#ffd6a5"];

    if (loading) return <div>로딩 중...</div>;
    if (!data || data.length === 0) return <div>데이터 없음</div>;

    return (
        <div style={{ marginTop: "2rem" }}>
            <h3>💰 상품별 매출 순위</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="productName" angle={-15} textAnchor="end" interval={0} height={80} />
                    <YAxis allowDecimals={false} />
                    <Tooltip formatter={(v) => `${v.toLocaleString()}원`} />
                    <Bar dataKey="salesAmount" barSize={30}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default ProductSalesChartCom;