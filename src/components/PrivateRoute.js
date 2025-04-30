import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import jwtDecode from "jwt-decode";

export default function PrivateRoute({ allowedDeptIds }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;
  try {
    const { deptId } = jwtDecode(token);
    if (!allowedDeptIds.includes(deptId)) return <Navigate to="/login" />;
    return <Outlet />;
  } catch {
    return <Navigate to="/login" />;
  }
}