import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    /* FIX 1: Removed 'sticky' and 'top-0'. 
       FIX 2: Added 'w-full' and kept 'justify-between' for firm spacing.
    */
    <nav className="relative w-full z-50 flex items-center justify-between bg-gray-900 px-4 md:px-6 py-3">
      
      {/* FIX 3: Logo Container. 
         Ensured no extra margin/padding is pushing it from the left.
      */}
      <Link to="/" className="flex items-center">
        <img 
          src="/images/logo.png" 
          alt="Logo" 
          className="h-[80px] md:h-[100px] w-auto object-contain" 
        />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-8 text-[18px] text-white items-center">
        <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
        <li><Link to="/category" className="hover:text-blue-400 transition">Service</Link></li>
        <li><Link to="/about" className="hover:text-blue-400 transition">About Us</Link></li>

        {!isLoggedIn ? (
          <>
            <li><Link to="/login" className="hover:text-blue-400 transition">Login</Link></li>
            <li>
              <Link to="/signup" className="bg-blue-600 px-5 py-2 rounded-md hover:bg-blue-700 transition">
                Sign Up
              </Link>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/user-dashboard" className="hover:text-blue-400 transition">Dashboard</Link></li>
            <li><Link to="/profile" className="hover:text-blue-400 transition">Profile</Link></li>
            <li>
              <button 
                onClick={handleLogout} 
                className="text-white bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>

      {/* Hamburger Button (Mobile) */}
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white text-3xl">
          <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <ul className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center gap-8 text-white text-2xl z-50">
          <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
          <li><Link to="/category" onClick={handleLinkClick}>Service</Link></li>
          {!isLoggedIn ? (
            <>
              <li><Link to="/login" onClick={handleLinkClick}>Login</Link></li>
              <li><Link to="/signup" onClick={handleLinkClick}>Sign Up</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/user-dashboard" onClick={handleLinkClick}>Dashboard</Link></li>
              <li><Link to="/profile" onClick={handleLinkClick}>Profile</Link></li>
              <li><button onClick={() => { handleLogout(); handleLinkClick(); }}>Logout</button></li>
            </>
          )}
          <button onClick={handleLinkClick} className="mt-10 text-sm border border-gray-500 px-6 py-2 rounded-full hover:bg-white hover:text-black transition">
            Close Menu
          </button>
        </ul>
      )}
    </nav>
  );
}