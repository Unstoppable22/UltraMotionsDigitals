import React from "react";
import TestimonialCard from "./Testimonialcard";

export default function Testimonials() {
  const clientLogos = [
    { name: "CoastNG", src: "/images/download.png" },
    { name: "Billpoint", src: "/images/unnamed.jpg" },
    { name: "Losode", src: "/images/LOSDOE.png" },
    { name: "Diamonds and Pearls", src: "/images/dandp.webp" },
    { name: "W motors", src: "/images/wmotorslogo.png" },
    { name: "Dj Neptune", src: "/images/neptune.jpg" },
    { name: "tenece", src: "/images/tenecelogo.png" },
    { name: "handy pros", src: "/images/handypros.jfif" },
    { name: "dee sensic", src: "/images/deesensic.png" },
    { name: "mano", src: "/images/MANO.webp" },
  ];

  return (
    <>
      <div className="bg-[#e5f4fb] flex flex-col items-center lg:p-10 pb-20">
        <h1 className="text-4xl font-bold font-mono text-center py-3 lg:py-5">
          Client Experiences
        </h1>
        <h2 className="text-xl py-3 text-center lg:py-0 mb-12">
          Industry Success Stories: Ultra Motions Digital in Action
        </h2>

        {/* Testimonial Cards Container */}
        <div className="flex items-center flex-col lg:flex-row gap-10 lg:gap-8 max-w-7xl">
          <TestimonialCard
            comment="Ultra Motions Digital has been a game-changer for our business. Their unmatched creativity, attention to detail, and dedication helped shape a digital presence..."
            name="- Adekunle Akinola"
            image="/images/hassy.jpg"
          />

          <TestimonialCard
            comment="Partnering with Ultra Motions Digital was the best decision we made for our brand. Their creativity, precision, and unwavering dedication..."
            name="- Oladimeji Alabi"
            image="/images/aji.jpg"
          />

          <TestimonialCard
            comment="Working with Ultra Motions Digital delivered Massive results for our brand. Their vision, creative excellence, and unwavering dedication elevated our presence..."
            name="- Ogunsanwo Mide"
            image="/images/femal.jpg"
          />
        </div>

        {/* --- BRAND LOGO SECTION --- */}
        <div className="mt-24 w-full max-w-7xl px-4">
          <p className="text-center text-gray-800 font-bold uppercase tracking-[0.2em] text-sm mb-12">
            Trusted by Industry Leaders
          </p>
          
          {/* GRID UPDATES:
              - Changed gap to 4 to bring them closer to "edge-to-edge"
              - Increased max-h and removed grayscale
          */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8 items-center bg-white/30 p-10 rounded-3xl shadow-inner">
            {clientLogos.map((logo, index) => (
              <div key={index} className="flex justify-center items-center h-32 p-2">
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="max-h-20 md:max-h-24 w-full object-contain hover:scale-110 transition-transform duration-300 ease-in-out"
                />
              </div>
            ))}
          </div>
        </div>
        {/* --- END BRAND LOGO SECTION --- */}
      </div>
    </>
  );
}