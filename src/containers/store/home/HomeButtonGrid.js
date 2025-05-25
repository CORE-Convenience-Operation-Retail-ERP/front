import React from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/home.css";

export default function HomeButtonGrid({ menus }) {
  const navigate = useNavigate();

  return (
    <nav className="home-nav">
      {menus.map((btn, i) => (
        <button
          key={i}
          className="nav-button"
          onClick={() => navigate(btn.path)}
        >
          {btn.icon && <span className="nav-icon">{btn.icon}</span>}
          <span>{btn.name}</span>
        </button>
      ))}
    </nav>
  );
}
