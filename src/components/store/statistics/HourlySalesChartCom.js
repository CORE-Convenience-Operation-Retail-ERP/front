import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";

export function HourlySalesChartCom({ data, loading }) {
    if (loading) return <div>로딩 중...</div>;
    if (!data || data.length === 0) return <div>데이터 없음</div>;

    return (
        <div>
            <h3>시간대별 매출 차트</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 20, right: 30, bottom: 5, left: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis
                        tickFormatter={(v) =>
                            typeof v === "number" && !isNaN(v) ? `${v.toLocaleString()}원` : ""
                        }
                    />
                    <Tooltip
                        formatter={(value) =>
                            typeof value === "number" && !isNaN(value)
                                ? `${value.toLocaleString()}원`
                                : value
                        }
                    />
                    <Line
                        type="monotone"
                        dataKey="salesAmount"
                        stroke="#8884d8"
                        strokeWidth={3}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default HourlySalesChartCom;