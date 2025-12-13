import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsLoggedIn(!!token);
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
    navigate("/login");
    setIsMenuOpen(false); // close mobile menu on logout
  };

  // Close mobile menu after clicking a link
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="top-0 left-0 w-full z-50 flex items-center justify-between bg-gray-900 px-4 lg:px-8 py-3">
      <img src="/images/logo.png" alt="Logo" className="h-[100px]" />

      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-10 text-[19px] text-white items-center">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/category">Service</Link>
        </li>

        {/* Only show these links if NOT logged in */}
        {!isLoggedIn && (
          <>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
          </>
        )}

        {/* Only show these links if logged in */}
        {isLoggedIn && (
          <>
            <li>
              <Link to="/user-dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-white hover:underline"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>

      {/* Hamburger Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white text-2xl focus:outline-none"
        >
          {isMenuOpen ? (
            <i className="fa-solid fa-xmark"></i>
          ) : (
            <i className="fa-solid fa-bars text-3xl"></i>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <ul className="fixed inset-0 bg-black/25 backdrop-blur-sm flex flex-col items-center justify-center gap-8 text-white text-2xl z-50">
          <li>
            <Link to="/" onClick={handleLinkClick}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/category" onClick={handleLinkClick}>
              Service
            </Link>
          </li>

          {/* Only show these links if NOT logged in */}
          {!isLoggedIn && (
            <>
              <li>
                <Link to="/about" onClick={handleLinkClick}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/login" onClick={handleLinkClick}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" onClick={handleLinkClick}>
                  Sign Up
                </Link>
              </li>
            </>
          )}

          {/* Only show these links if logged in */}
          {isLoggedIn && (
            <>
              <li>
                <Link to="/user-dashboard" onClick={handleLinkClick}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile" onClick={handleLinkClick}>
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-white hover:underline"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
}
