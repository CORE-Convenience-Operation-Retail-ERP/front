import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

export function ProductSalesChartCom({ data, loading }) {
    const COLORS = [
        "#8884d8", "#82ca9d", "#ffc658", "#ff8042",
        "#8dd1e1", "#d0ed57", "#a4de6c", "#d88884",
        "#b49eff", "#ffd6a5"
    ];

    // 빈 데이터용 fallback
    const emptyData = [{ productName: "데이터 없음", salesAmount: 0 }];

    if (loading) return <div>로딩 중...</div>;

    const isEmpty = !data || data.length === 0;
    const chartData = isEmpty ? emptyData : data;

    return (
        <div style={{ marginTop: "2rem" }}>
            <h3>💰 상품별 매출 순위</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="productName"
                        angle={-15}
                        textAnchor="end"
                        interval={0}
                        height={80}
                    />
                    <YAxis
                        allowDecimals={false}
                        domain={[0, 'dataMax + 1000']} // 👈 중요: 0부터 시작 + 여유값 추가
                        tickFormatter={(v) => `${v.toLocaleString()}원`}
                    />
                    <Tooltip formatter={(v) => `${v.toLocaleString()}원`} />
                    <Bar dataKey="totalAmount" barSize={30} minPointSize={5}>
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

export default ProductSalesChartCom;