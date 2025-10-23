import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/category');
  };

  return (
    <div className="relative w-full h-screen animate-bg-cycle flex flex-col items-center justify-center text-center bg-cover bg-center">
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 px-5">
        <h1 className="text-white text-5xl py-5 font-mono">
          Expand your Audience, Elevate your Brand
        </h1>
        <h2 className="text-white text-2xl max-w-3xl mx-auto">
          Amplify your brand's presence with innovative digital strategies from ULTRA MOTIONS DIGITALS, the leading marketing agency in Lagos.
        </h2>
        <button
          onClick={handleNavigation}
          className="hover:bg-black/25 backdrop-blur-sm text-white text-xl drop-shadow-lg border border-white px-8 py-3 rounded-md mt-8 inline-block"
        >
          Boost Your Reach
        </button>
      </div>
    </div>
  );
}
