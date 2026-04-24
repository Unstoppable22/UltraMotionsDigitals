import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Match this to what you used in Login.jsx
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}