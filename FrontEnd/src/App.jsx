import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Faq from "./components/Faq";
import AboutUs from "./pages/AboutUs"; // Fixed U
import CategorySectionGroup from "./components/CategorySectionGroup"; // Fixed Case
import Testimonials from "./components/Testimonials";
import LaunchSection from "./components/LaunchSection"; // Fixed S

// User Pages
import Dashboard from "./components/Dashboard";
import UserDashboard from "./pages/UserDashboard"; // Fixed Spelling
import Profile from "./components/Profile";
import Signup from "./components/Signup";
import Login from "./components/Login";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin"; // Ensure file is AdminLogin.jsx
import AdminDashboard from "./pages/admin/AdminDashboard"; // Ensure file is AdminDashboard.jsx

// Route Protection
import ProtectedRoute from "./components/ProtectedRoute"; // Fixed Case

export default function App() {
  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/category" element={<CategorySectionGroup />} />
        <Route path="/launch" element={<LaunchSection />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTES */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* ADMIN ROUTES */}
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route
          path="/AdminDashboard"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard 
                users={[]} 
                bookings={[]} 
                API_BASE_URL={API_URL} 
              />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<h1 className="text-center mt-20 text-3xl">404 - Page Not Found</h1>} />
      </Routes>
      <Footer />
    </Router>
  );
}