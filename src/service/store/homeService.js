import axiosInstance from "../axiosInstance";
import { MdAttachMoney, MdInventory2, MdListAlt, MdPeople } from "react-icons/md";

// 오늘 출근한 사람들 불러오기 (출근 완료자 기준)
// export async function fetchTodayAttendees(storeId, today) {
//   const token = localStorage.getItem("token"); 

//   console.log("[fetchTodayAttendees] 🔍 storeId:", storeId);
//   console.log("[fetchTodayAttendees] 📅 today:", today);
//   console.log("[fetchTodayAttendees] 🔑 token:", token);

//   const res = await axios.get("/api/attendance/part-timer/list", {
//     headers: {
//       Authorization: `Bearer ${token}` 
//     },
//     params: {
//       storeId,
//       startDate: today,
//       endDate: today,
//       page: 0,
//       size: 100
//     }
//   });

//   console.log("[fetchTodayAttendees] ✅ response:", res.data);
//   return res.data?.content || [];
// }

// 오늘 스케줄 있는 출근 예정자 불러오기
export async function fetchTodayScheduledPartTimers() {
  const token = localStorage.getItem("token");
  const today = new Date();

  const { start, end } = getTodayRange();

  try {
    const res = await axiosInstance.get("/api/parttimer-schedule", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        start,
        end
      }
    });

    // 항목 구조 하나씩 출력
    if (res.data.length > 0) {
    }
    return res.data.map(item => {
      const name = item.title || item.partName || item.partTimerName;
      return name;
    });

  } catch (err) {
    return [];
  }
}

// KST 기준 오늘 날짜 범위 (YYYY-MM-DDTHH:mm:ss)
function getTodayRange() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const start = `${yyyy}-${mm}-${dd}T00:00:00`;
  const end = `${yyyy}-${mm}-${dd}T23:59:59`;

  return { start, end };
}

// 재고 요약 조회 후 부족 상품 필터링 (수량 <= minStock 또는 수량 <= 0)
export async function fetchStockShortages(storeId) {
  const token = localStorage.getItem("token");
  const res = await axiosInstance.get("/api/stock/summary", {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      storeId,
      page: 0,
      size: 1000
    }
  });

  const all = res.data?.content || [];

  const shortages = all.filter(item => item.storeQuantity <= 0);

  return shortages;
}

// 폐기 예정 상품 목록 조회
export async function fetchDisposalTargets() {
  const token = localStorage.getItem("token");

  try {
    const res = await axiosInstance.get("/api/erp/disposal/expired", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.data || [];

  } catch (err) {
    return [];
  }
}


// 메뉴 목록 반환
export function getMenus() {
  return [
    {
      name: "발주 현황",
      path: "/store/order/list",
      icon: <MdListAlt />,
    },
    {
      name: "재고 현황",
      path: "/store/stock/list",
      icon: <MdInventory2 />,
    },
    {
      name: "직원 관리",
      path: "/store/parttimer/list",
      icon: <MdPeople />,
    },
    {
      name: "매출 정산",
      path: "/store/sales/summary",
      icon: <MdAttachMoney />,
    },
  ];
}
