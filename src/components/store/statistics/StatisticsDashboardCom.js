import CategorySalesDonutCom from "./CategorySalesDonutCom";
import HourlySalesChartCom from "./HourlySalesChartCom";
import KpiStatsCom from "./KpiStatsCom";
import OrderTopProductsCom from "./OrderTopProductsCom";
import ProductSalesChartCom from "./ProductSalesChartCom";

function StatisticsDashboardCom() {
    return (
        <>
        <CategorySalesDonutCom />
        <HourlySalesChartCom />
        <KpiStatsCom />
        <OrderTopProductsCom />
        <ProductSalesChartCom />
        </>
    )
}
export default StatisticsDashboardCom;