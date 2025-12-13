import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Faq from "./components/Faq";
import AboutUs from "./pages/AboutUs";
import CategorySectionGroup from "./components/CategorySectionGroup";
import Testimonials from "./components/Testimonials";
import LaunchSection from "./components/LaunchSection";
import Dashboard from "./components/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
import UserDashboard from "./pages/UserDashboard";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/Testimonials" element={<Testimonials />} />
        <Route path="/" element={<Home />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/category" element={<CategorySectionGroup />} />
        <Route path="/launch" element={<LaunchSection />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* 🔒 Protect routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}
