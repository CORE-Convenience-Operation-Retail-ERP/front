import PartTimerCom from "../../../components/store/partTimer/PartTimerCom";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchPartTimers} from "../../../service/store/PartTimeService";
import {deletePartTimer} from "../../../service/store/PartTimeService";
import SearchBar from "../../../components/store/common/StoreSearchBar";
import Pagination from "../../../components/store/common/Pagination";

function PartTimerCon(){
    const navigate = useNavigate();


    //  상태 관리
    const [partTimers, setPartTimers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useState({ partName: '', partStatus: null });
    const [selectedIds, setSelectedIds] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    //  데이터 로드 함수
    const loadPartTimers = async () => {
        setLoading(true);
        try {
            const data = await fetchPartTimers({ ...searchParams, page, size });
    
            if (Array.isArray(data)) {
                setPartTimers(data);       
                setTotalPages(1);             
            } else {
                setPartTimers(data.content || []);  
                setTotalPages(data.totalPages || 1);
            }
        } catch (error) {
            console.error('불러오기 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    //  마운트 & 검색 & 페이지 이동할 때마다 reload
    useEffect(() => {
        (async () => {
            await loadPartTimers();
        })();
    }, [searchParams, page]);

    //  체크박스 개별 선택
    const handleCheck = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    //  전체 선택
    const handleCheckAll = (checked) => {
        if (checked) {
            const allIds = partTimers.map(pt => pt.partTimerId);
            setSelectedIds(allIds);
        } else {
            setSelectedIds([]);
        }
    };

    //  삭제 버튼 클릭
    const handleDelete = async () => {
        if (selectedIds.length === 0) {
            alert('삭제할 아르바이트를 선택하세요.');
            return;
        }

        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        try {
            await Promise.all(selectedIds.map(id => deletePartTimer(id)));
            alert('삭제 성공');
            setSelectedIds([]);
            loadPartTimers();
        } catch (error) {
            console.error('삭제 실패:', error);
        }
    };

    //  검색창 입력
    const handleSearch = (params) => {
        const [key, value] = Object.entries(params)[0];
    
        setSearchParams({
            partName: key === 'partName' ? value : '',
            position: key === 'position' ? value : null,
            partStatus: key === 'partStatus' ? value : null,
        });
    
        setPage(0);
    };

    //  등록 버튼 클릭
    const handleRegister = () => {
        navigate('/store/parttimer/register');
    };

    

    return (
        <div>
            <SearchBar
            filterOptions={[
                { key: "partName", label: "이름", type: "text" },
                {
                key: "position",
                label: "직책",
                type: "select",
                options: [
                    { value: "", label: "전체" },
                    { value: "아르바이트", label: "아르바이트" },
                    { value: "매니저", label: "매니저" },
                    { value: "점장", label: "점장" }
                ]
                },
                {
                key: "partStatus",
                label: "상태",
                type: "select",
                options: [
                    { value: "", label: "전체" },
                    { value: "1", label: "재직" },
                    { value: "0", label: "퇴사" }
                ]
                }
            ]}
            onSearch={handleSearch}
            />
            <div style={{ margin: '10px 0' }}>
                <button onClick={handleRegister}>Register</button>
                <button onClick={handleDelete} style={{ marginLeft: '10px' }}>Delete</button>
        </div>
            <PartTimerCom
                data={partTimers}
                loading={loading}
                selectedIds={selectedIds}
                onCheck={handleCheck}
                onCheckAll={handleCheckAll}
            />
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </div>
    );
}
export default PartTimerCon;