import { Navigate } from "react-router-dom";

export default function Protectedroute({ children, adminOnly = false }) {
  // Check both possible keys to ensure the user isn't kicked out
  const token = localStorage.getItem("userToken") || localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // 1. If no token is found, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. If it's an admin route but the user isn't an admin, redirect to user dashboard
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/user-dashboard" replace />;
  }

  // 3. Otherwise, allow access to the component (Profile, Dashboard, etc.)
  return children;
}