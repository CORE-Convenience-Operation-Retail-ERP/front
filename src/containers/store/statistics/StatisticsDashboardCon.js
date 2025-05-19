import KpiStatsCon from "./KpiStatsCon";
import HourlySalesChartCon from "./HourlySalesChartCon";
import ProductSalesChartCon from "./ProductSalesChartCon";
import CategorySalesDonutCon from "./CategorySalesDonutCon";
import OrderTopProductsCon from "./OrderTopProductsCon";

function StatisticsDashboardCon() {
    return (
        <>
            <KpiStatsCon />
            <HourlySalesChartCon />
            <ProductSalesChartCon />
            <CategorySalesDonutCon />
            <OrderTopProductsCon />
        </>
    );
}
export default StatisticsDashboardCon;