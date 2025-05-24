import React, { useEffect, useState } from "react";
import ExpireSoonCom from "../../../components/store/home/ExpireSoonCom";
import { fetchDisposalTargets } from "../../../service/store/homeService";

export default function ExpireSoonCon() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      const result = await fetchDisposalTargets();
      setItems(result);
    };
    load();
  }, []);

  return (
    <ExpireSoonCom list={items} />
  );
}
