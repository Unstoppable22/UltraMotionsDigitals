import { Link } from "react-router-dom";
import React, { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 items-center justify-between flex  bg-[#102116]  lg:px-4">
      <img src="/images/logo.png" alt="Logo" className="h-[100px]" />

      {/* Desktop Menu */}
      <ul className="flex gap-10 text-[19px] text-white hidden md:flex">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/category">Service</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/testimonials">Testimonials</Link></li>
        <li><Link to="/admin/login">Admin</Link></li>
        <li><Link to="/signup">Sign up</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>

      {/* Hamburger Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white text-2xl focus:outline-none mx-2"
        >
          {isMenuOpen ? (
            <i class="fa-solid fa-xmark"></i> 
          ) : (
            <i className="fa-solid fa-bars text-3xl"></i>  
          )}
        </button>
      </div>

      {/* Mobile Fullscreen Menu */}
      {isMenuOpen && (
        <ul className="fixed inset-0 bg-[#102116] bg-opacity-95 flex flex-col items-center justify-center gap-8 text-white text-2xl z-50">
          <li><Link to="/admin/login" onClick={() => setIsMenuOpen(false)}>Admin</Link></li>
          <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link to="/category" onClick={() => setIsMenuOpen(false)}>Service</Link></li>
          <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link></li>
          <li><Link to="/testimonials" onClick={() => setIsMenuOpen(false)}>Testimonials</Link></li>
        </ul>
      )}
    </nav>
  );
}
