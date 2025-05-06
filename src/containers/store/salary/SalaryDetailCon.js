import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchSalaryDetailById } from "../../../service/store/SalartService";
import SalaryDetailChart from "../../../components/store/salary/SalaryDetailChart";
import SalaryBreakdownTable from "../../../components/store/salary/SalaryBreakdownTable";


function SalaryDetailCon() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view") || "monthly";
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadDetail = async () => {
    console.log("✅ fetch detail params", { id, view, year, month });
    setLoading(true);
    try {
      const res = await fetchSalaryDetailById(id, view, year, month);
      setSalaryData(res.data);
    } catch (err) {
      console.error("상세 조회 실패", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [id, view, year, month]);

  return (
    <div>
      <h2>급여 상세 정보 ({view === "monthly" ? `${year}년 ${month}월` : `${year}년 전체`})</h2>
      {loading ? (
        <p>불러오는 중...</p>
      ) : (
        <>
          <SalaryDetailChart data={salaryData} view={view} />
          <SalaryBreakdownTable data={salaryData} view={view} />
        </>
      )}
    </div>
  );
}

export default SalaryDetailCon;
