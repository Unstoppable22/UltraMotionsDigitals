import React from 'react';
import { FaTwitter, FaInstagram, FaTiktok, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center md:items-center justify-between gap-8">

        {/* Logo & Branding */}
        <div className="flex-shrink-0 text-center md:text-left">
          <img src="/images/logo.png" alt="logo footer" className="h-16 mx-auto md:mx-0" />
          <p className="mt-2 text-sm text-gray-400">© {new Date().getFullYear()} Ultra Motions Digital</p>
        </div>

        {/* Contact Info */}
        <div className="text-center md:text-left flex flex-col space-y-1">
          <h2 className="text-xl md:text-2xl font-semibold">Contact Us</h2>
          <p className="text-sm text-gray-300">Email: ultramotions@gmail.com</p>
          <p className="text-sm text-gray-300">Phone: +2349067964045</p>
          <p className="text-sm text-gray-300">Location: Lagos, Nigeria</p>
        </div>

        {/* Social Media Icons */}
        <div className="flex items-center gap-6 text-2xl">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
            <FaInstagram />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-black">
            <FaTiktok />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
}
