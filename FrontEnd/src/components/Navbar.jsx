import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login status whenever the component mounts
  useEffect(() => {
    // SYNC: Changed 'userToken' to 'token' to match your Login.jsx
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Logout function
  const handleLogout = () => {
    // SYNC: Changed 'userToken' to 'token'
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Clean up user data too
    setIsLoggedIn(false);
    
    // Use window.location to force a clean state reset
    window.location.href = "/login";
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="top-0 left-0 w-full z-50 flex items-center justify-between bg-gray-900 px-4 lg:px-8 py-3 sticky">
      <img src="/images/logo.png" alt="Logo" className="h-[100px]" />

      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-10 text-[19px] text-white items-center">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/category">Service</Link></li>
        
        {/* Always visible for navigation ease */}
        <li><Link to="/about">About Us</Link></li>

        {!isLoggedIn ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/user-dashboard">Dashboard</Link></li>
            <li><Link to="/Profile">Profile</Link></li>
            <li>
              <button onClick={handleLogout} className="text-white hover:text-red-400 transition">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>

      {/* Hamburger Button */}
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white text-3xl">
          <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
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
              <li><Link to="/Profile" onClick={handleLinkClick}>Profile</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          )}
          <button onClick={handleLinkClick} className="mt-10 text-sm border p-2 rounded">Close Menu</button>
        </ul>
      )}
    </nav>
  );
}