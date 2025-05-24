import React from "react";
import DashButton from "../../../components/store/home/DashButton";
import { useNavigate } from "react-router-dom";

export default function HomeButtonGrid({ menus }) {
    const navigate = useNavigate();
  
    return (
      <>
        {menus.map((btn, idx) => (
          <DashButton key={idx} label={btn.name} onClick={() => navigate(btn.path)} />
        ))}
      </>
    );
  }
