import { useEffect, useState } from "react";
import { fetchStockShortages } from "../../../service/store/homeService";
import StockShortageCom from "../../../components/store/home/StockShortageCom";

export default function StockShortageCon({ storeId }) {
    const [shortages, setShortages] = useState([]);
  
    useEffect(() => {
      if (!storeId) return;
      fetchStockShortages(storeId).then(data => {
        setShortages(data);
      });
    }, [storeId]);
  
    return <StockShortageCom count={shortages.length} />;
}
  