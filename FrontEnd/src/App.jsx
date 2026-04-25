import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import CategorySectionGroup from "./components/CategorySectionGroup";
import UserDashboard from "./pages/UserDashboard";
import Signup from "./components/Signup";
import Login from "./components/Login";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Protectedroute from "./components/Protectedroute";
import CampaignDetails from "./pages/CampaignDetails";

export default function App() {
  const API_URL = import.meta.env.VITE_API_BASE_URL || "https://ultramotionsdigitals.onrender.com";

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/category" element={<CategorySectionGroup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* User Routes */}
        <Route 
          path="/user-dashboard" 
          element={<Protectedroute><UserDashboard /></Protectedroute>} 
        />
        {/* FIX: Added the /profile route so your Navbar doesn't break */}
        <Route 
          path="/profile" 
          element={<Protectedroute><UserDashboard /></Protectedroute>} 
        />
        <Route 
          path="/campaign/:id" 
          element={<Protectedroute><CampaignDetails /></Protectedroute>} 
        />

        {/* Admin Routes */}
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route
          path="/AdminDashboard"
          element={
            <Protectedroute adminOnly={true}>
              <AdminDashboard API_BASE_URL={API_URL} />
            </Protectedroute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}