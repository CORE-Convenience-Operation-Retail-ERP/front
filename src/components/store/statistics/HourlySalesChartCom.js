import {
    ResponsiveContainer,
    ComposedChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend
  } from "recharts";


// 상세 테이블 (mode === 'detail'일 때만 표시)
function HourlySalesTable({ data }) {
    const filteredData = data.filter(row => row.quantity > 0);

    return (
        <div style={{ marginTop: "20px" }}>
            <h4>상세 테이블</h4>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={thStyle}>시간대</th>
                        <th style={thStyle}>판매 수량</th>
                        <th style={thStyle}>총 매출액</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map(({ hour, quantity, total }) => (
                        <tr key={hour}>
                            <td style={tdStyle}>{hour}시</td>
                            <td style={tdStyle}>
                                {typeof quantity === "number" ? quantity.toLocaleString() + "건" : "-"}
                            </td>
                            <td style={tdStyle}>
                                {typeof total === "number" ? total.toLocaleString() + "원" : "-"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const thStyle = {
    borderBottom: "2px solid #ccc",
    padding: "10px",
    backgroundColor: "#f8f8f8",
    textAlign: "left"
};

const tdStyle = {
    borderBottom: "1px solid #eee",
    padding: "10px",
    textAlign: "left"
};

export function HourlySalesChartCom({ data, loading, mode = "detail" }) {
    if (loading) return <div>로딩 중...</div>;

    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
    const filledData = hours.map((hour) => {
        const found = data.find((d) => d.hour.toString().padStart(2, "0") === hour);
        return {
            hour,
            quantity: found?.quantity ?? 0,
            total: found?.total ?? 0,
        };
    });

    return (
        <div style={{ marginTop: "3rem" }}>
            <h3 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "0.5em", marginLeft: "100px" }}>
                시간대별 매출 차트
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={filledData} margin={{ top: 20, right: 40, bottom: 5, left: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis
                        yAxisId="left"
                        tickFormatter={(v) =>
                            typeof v === "number" && !isNaN(v) ? `${v.toLocaleString()}원` : ""
                        }
                    />
                    <Tooltip
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                const total = payload.find(p => p.dataKey === "total")?.value || 0;

                                if (mode === "detail") {
                                    const quantity = payload.find(p => p.dataKey === "quantity")?.value || 0;
                                    return (
                                        <div style={{ backgroundColor: "white", border: "1px solid #ccc", padding: "10px" }}>
                                            <p>{label}시</p>
                                            <p style={{ color: "#8884d8" }}>매출: {total.toLocaleString()}원</p>
                                            <p style={{ color: "#82ca9d" }}>수량: {quantity.toLocaleString()}건</p>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div style={{ backgroundColor: "white", border: "1px solid #ccc", padding: "10px" }}>
                                            <p>{label}시</p>
                                            <p style={{ color: "#8884d8" }}>매출: {total.toLocaleString()}원</p>
                                        </div>
                                    );
                                }
                            }
                            return null;
                        }}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="total"
                        name="매출"
                        yAxisId="left"
                        stroke="#8884d8"
                        strokeWidth={3}
                        activeDot={{ r: 6 }}
                    />
                   {mode === "detail" && (
                        <Line
                          type="monotone"
                          dataKey="quantity"
                          name="수량"
                          yAxisId="left"
                          stroke="transparent"
                          dot={false}
                          activeDot={false}
                          legendType="none"
                        />
                      )}
                    </ComposedChart>
            </ResponsiveContainer>

            {mode === "detail" && <HourlySalesTable data={filledData} />}
        </div>
    );
}

export default HourlySalesChartCom;
