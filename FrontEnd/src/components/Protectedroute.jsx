import { Navigate } from "react-router-dom";

export default function Protectedroute({ children, adminOnly = false }) {
  // Use "userToken" to match your Login and Profile logic
  const token = localStorage.getItem("userToken");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // 1. If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. If it's an admin route but the user isn't an admin, send them to user dashboard
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/user-dashboard" replace />;
  }

  return children;
}