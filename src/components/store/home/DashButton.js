import React from "react";

export default function DashButton({ label, onClick }) {
  return (
    <button className="dash-button" onClick={onClick}>
      {label}
    </button>
  );
}