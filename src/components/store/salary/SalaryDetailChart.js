import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
  } from "recharts";
  import styled from "styled-components";
  
  function SalaryDetailChart({ data, view }) {
    if (!data || data.length === 0) return <p>데이터가 없습니다.</p>;
  
    const chartData = data
    .filter((item) => item.payDate !== "총합")
    .map((item) => ({
      label: view === "monthly" ? item.payDate?.slice(0, 10) : `${item.month}월`,
      netSalary: item.netSalary || item.totalNetSalary,
    }));
  
    return (
      <StyledChartContainer>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis
              tickFormatter={(v) => `${v?.toLocaleString?.() || 0}원`}
              width={80}
            />
            <Tooltip
              formatter={(value) => `${value?.toLocaleString?.() || 0}원`}
              labelFormatter={(label) => `${label}`}
              contentStyle={{ fontSize: "14px" }}
              wrapperStyle={{ zIndex: 10 }}
            />
            <Line
              type="monotone"
              dataKey="netSalary"
              name="실지급"
              stroke="#3b82f6"
              strokeWidth={2}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </StyledChartContainer>
    );
  }
  
  export default SalaryDetailChart;
  
  const StyledChartContainer = styled.div`
    margin-top: 2rem;
  
    .title {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }
  `;
  