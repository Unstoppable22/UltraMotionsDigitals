import React from 'react';
import { FaTwitter, FaInstagram, FaTiktok, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#102116] text-white py-10 px-25 items-center flex lg:px-6">
      <div className="max-w-7xl mx-auto items-center flex-row lg:flex justify-between gap-10 space-y-10 ">

        {/* Logo & Branding */}
        <div className="text-center md:text-left">
          <img src="/images/logo.png" alt="logo footer" className="h-25 mx-auto md:mx-0" />
          <p className="mt-2 text-sm text-gray-400">© {new Date().getFullYear()} Ultra Motions Digital</p>
        </div>

        {/* Contact Info */}
        <div className="text-center md:text-left flex flex-col md:flex-col">
          <h2 className="text-2xl lg:text-3xl font-semibold">Contact Us</h2>
          <p >Email: ultramotions@gmail.com</p>
          <p>Phone: +2349067964045</p>
          <p>Location: Lagos, Nigeria</p>
        </div>

        {/* Social Media Icons */}
        <div className="lg:flex gap-6  text-2xl text-center md:text-left flex flex-row">
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
