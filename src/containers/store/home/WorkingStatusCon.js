import { useEffect, useState } from "react";
import WorkingStatusCom from "../../../components/store/home/WorkingStatusCom";
import { fetchTodayScheduledPartTimers } from "../../../service/store/homeService";


export default function WorkingStatusCon() {
    const [names, setNames] = useState([]);
  
    useEffect(() => {
      fetchTodayScheduledPartTimers().then(res => {
        setNames(res);
      }).catch(err => {
        console.error("출근 예정자 조회 실패", err);
      });
    }, []);
  
    return <WorkingStatusCom value={names} />;
  }