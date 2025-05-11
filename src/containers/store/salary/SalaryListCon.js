import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StoreSearchBar from "../../../components/store/common/StoreSearchBar";
import SalaryListCom from "../../../components/store/salary/SalaryListCom";
import Pagination from "../../../components/store/common/Pagination";
import {
  fetchSalaryList,
  generateSalaryForMonth,
} from "../../../service/store/SalartService";
import {
  ButtonGroup,
  ViewToggleButton,
} from "../../../features/store/styles/salary/SalaryList.styled";

function SalaryListCon() {
  const now = new Date();
  const [searchParams, setSearchParams] = useState({
    name: null,
    status: null,
    year: now.getFullYear(),
    month: String(now.getMonth() + 1).padStart(2, "0"),
  });

  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("monthly");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const handleRowClick = (id) => {
    const query = new URLSearchParams({
      view: viewMode,
      year: searchParams.year,
    });

    if (viewMode === "monthly" && searchParams.month) {
      query.set("month", searchParams.month);
    }

    navigate(`/store/hr/salary/${id}/detail?${query.toString()}`);
  };

  useEffect(() => {
    console.log("[🔥 검색 파라미터]", { ...searchParams, view: viewMode });
    loadSalaries();
  }, [searchParams, viewMode, page]);

  const loadSalaries = async () => {
    setLoading(true);
    try {
      const res = await fetchSalaryList({ 
        ...searchParams,
        name: searchParams.name || null,
        status: searchParams.status || null,
        page, 
        size, 
        view: viewMode 
      });
      setSalaries(res.data.content); // 
      setTotalPages(res.data.totalPages); // 
    } catch (e) {
      console.error("급여 조회 실패", e);
    } finally {
      setLoading(false);
    }
  };
  

  const handleSearch = (params) => {
    if (params.startDate && params.endDate) {
      setSearchParams(prev => ({
        ...prev,
        startDate: params.startDate,
        endDate: params.endDate,
        year: null,
        month: null,            
      }));
    } else if (params.date) {
      const [year, month] = params.date.split("-");
      setSearchParams({
        ...searchParams,
        year: Number(year),
        month,
        startDate: null,
        endDate: null,
      });
    } else {
      setSearchParams(prev => ({
        ...prev,
        ...params,
      }));
    }
    setPage(0);
  };
  

  const handleGenerate = async () => {
    const { year, month } = searchParams;
    const confirm = window.confirm(`${year}-${month} 급여를 생성하시겠습니까?`);
    if (!confirm) return;

    try {
      await generateSalaryForMonth(year, month);
      alert("급여 생성 완료");
      loadSalaries();
    } catch (err) {
      alert("급여 생성 실패");
    }
  };

  const handleViewChange = (mode) => {
    setViewMode(mode);
    setSearchParams(prev => ({
      ...prev,
      view: mode,
    }));
    setPage(0);
  };
  

  const filterOptions = [
    { key: "name",    label: "이름",       type: "text" },
    { key: "status",  label: "재직 상태", type: "select", options: [
        { value: "1", label: "재직중" },
        { value: "0", label: "퇴사자" },
      ]
    },
    { key: "date",       label: "단일 날짜",  type: "date" },
    { key: "dateRange",  label: "기간(날짜)", type: "date-range" },
  ];

  return (
    <div>
      <StoreSearchBar filterOptions={filterOptions} onSearch={handleSearch} />

      <ButtonGroup>
        <ViewToggleButton
          active={viewMode === "monthly"}
          onClick={() => handleViewChange("monthly")}
        >
          월별 보기
        </ViewToggleButton>
        <ViewToggleButton
          active={viewMode === "yearly"}
          onClick={() => handleViewChange("yearly")}
        >
          연도별 보기
        </ViewToggleButton>
        <button onClick={handleGenerate}>급여 생성</button>
      </ButtonGroup>

      <SalaryListCom
        data={salaries}
        loading={loading}
        viewMode={viewMode}
        onRowClick={handleRowClick}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

export default SalaryListCon;