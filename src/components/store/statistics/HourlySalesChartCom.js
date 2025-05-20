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

    // 0~23시를 보장하는 시간대 배열 생성
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));

    // 실제 데이터를 해당 시간대에 매핑 (없으면 0으로 채움)
    const filledData = hours.map((hour) => {
        const found = data.find((d) => d.hour === hour);
        return {
            hour,
            quantity: found?.quantity ?? 0,
            total: found?.total ?? 0,
        };
    });

    return (
        <div>
            <h3>시간대별 매출 차트</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filledData} margin={{ top: 20, right: 30, bottom: 5, left: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis
                        tickFormatter={(v) =>
                            typeof v === "number" && !isNaN(v) ? `${v.toLocaleString()}원` : ""
                        }
                    />
                    <Tooltip
                        formatter={(value, name) => {
                            return name === "total"
                                ? [`${value.toLocaleString()}원`, "매출"]
                                : [`${value}건`, "수량"];
                        }}
                        labelFormatter={(label) => `${label}시`}
                    />
                    <Line
                        type="monotone"
                        dataKey="total"
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
