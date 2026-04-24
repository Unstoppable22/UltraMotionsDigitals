  import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

  // Layout
  import Navbar from "./components/Navbar";
  import Footer from "./components/Footer";

  // Pages
  import Home from "./pages/Home";
  import Faq from "./components/Faq";
  import AboutUs from "./pages/AboutUs";
  import CategorySectionGroup from "./components/CategorySectionGroup";
  import Testimonials from "./components/Testimonials";
  import Launchsection from "./components/Launchsection";

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
  import Protectedroute from "./components/Protectedroute";

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
          <Route path="/launch" element={<Launchsection />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* PROTECTED ROUTES */}
          <Route path="/dashboard" element={<Protectedroute><Dashboard /></Protectedroute>} />
          <Route path="/user-dashboard" element={<Protectedroute><UserDashboard /></Protectedroute>} />
          <Route path="/profile" element={<Protectedroute><Profile /></Protectedroute>} />

          {/* ADMIN ROUTES */}
          <Route path="/AdminLogin" element={<AdminLogin />} />
          <Route
            path="/AdminDashboard"
            element={
              <Protectedroute adminOnly>
                <AdminDashboard 
                  users={[]} 
                  bookings={[]} 
                  API_BASE_URL={API_URL} 
                />
              </Protectedroute>
            }
          />
          <Route path="*" element={<h1 className="text-center mt-20 text-3xl">404 - Page Not Found</h1>} />
        </Routes>
        <Footer />
      </Router>
    );
  }