import React from "react";
import BB from "/images/bbstatic1.jpg";

// Component name must be Capitalized
export default function Section() {
  return (
    <>
      {/* Top Section: Strategy Cards */}
      <div className="p-5 lg:p-20 bg-[#e5f4fb]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold font-mono text-center mb-4 text-gray-900">
            Maximize ROI with Multi-channel Advertising
          </h1>
          <h2 className="text-xl lg:text-2xl text-center text-gray-700 mb-10">
            Position your brand for success with custom advertising campaigns that
            drive real results across Nigeria.
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="flex flex-col items-center text-center bg-white p-6 rounded-3xl shadow-sm">
              <img
                src={BB}
                alt="Strategic Campaign"
                className="rounded-2xl h-64 w-full object-cover mb-4"
              />
              <h3 className="text-2xl font-bold font-mono mb-2">
                Strategic Campaign Development
              </h3>
              <p className="text-gray-600">
                Craft tailored strategies to boost your brand visibility and
                engagement across digital platforms.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center text-center bg-white p-6 rounded-3xl shadow-sm">
              <img
                src="/images/socia m.jpg"
                alt="Social Media"
                className="rounded-2xl h-64 w-full object-cover mb-4"
              />
              <h3 className="text-2xl font-bold font-mono mb-2">
                Build a Stronger Online Brand
              </h3>
              <p className="text-gray-600">
                Strengthen your digital presence with expert content strategy,
                planning, and audience engagement.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col items-center text-center bg-white p-6 rounded-3xl shadow-sm">
              <img
                src="/images/seo.jpg"
                alt="SEO"
                className="rounded-2xl h-64 w-full object-cover mb-4"
              />
              <h3 className="text-2xl font-bold font-mono mb-2">
                Search Engine Optimization
              </h3>
              <p className="text-gray-600">
                Improve your website's ranking on search engines to attract more
                organic traffic and potential clients.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Image Gallery Grid */}
      {/* Using 'object-cover' and fixed heights (h-80 or h-96) 
          makes sure the images look "upright" and uniform.
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-[#e5f4fb] pb-10">
        <img
          src="/images/digitalm.jpg"
          alt="Campaign 1"
          className="w-full h-80 lg:h-96 object-cover border-2 border-[#e5f4fb]"
        />
        <img 
          src="/images/jetourbillboardstamp.jpg" 
          alt="Campaign 2" 
          className="w-full h-80 lg:h-96 object-cover border-2 border-[#e5f4fb]" 
        />
        <img
          src="/images/losodebillb.jpg"
          alt="Campaign 3"
          className="w-full h-80 lg:h-96 object-cover border-2 border-[#e5f4fb]"
        />
        <img
          src="/images/jetourlamp1.jpg"
          alt="Campaign 4"
          className="w-full h-80 lg:h-96 object-cover border-2 border-[#e5f4fb]"
        />
        <img 
          src="/images/img3.jpeg" 
          alt="Campaign 5" 
          className="w-full h-80 lg:h-96 object-cover border-2 border-[#e5f4fb]" 
        />
        <img
          src="/images/brt-bus.webp"
          alt="Campaign 6"
          className="w-full h-80 lg:h-96 object-cover border-2 border-[#e5f4fb]"
        />
      </div>
    </>
  );
}