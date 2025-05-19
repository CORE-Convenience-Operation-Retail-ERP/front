import { Sector } from "recharts";

const renderActiveShape = (props) => {
    const {
        cx, cy,
        innerRadius, outerRadius,
        startAngle, endAngle,
        fill
    } = props;

    return (
        <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius + 10}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
            style={{ transition: "all 0.3s ease" }}
        />
    );
};
export default renderActiveShape;