import React from "react";

export default function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <marquee behavior="scroll" direction="left" scrollamount="5" className="mb-10">
        <img src="/images/img.jpg" alt="Ad 1" className="inline-block h-32 mx-4 rounded" />
        <img src="/images\socia m.jpg" alt="Ad 2" className="inline-block h-32 mx-4 rounded" />
        <img src="/images/LED .jpg" alt="Ad 3" className="inline-block h-32 mx-4 rounded" />
        <img src="/images/wal bb.jpg" alt="Ad 4" className="inline-block h-32 mx-4 rounded" />
        <img src="/images/seo.jpg" alt="Ad 5" className="inline-block h-32 mx-4 rounded" />
        <img src="/images/brt-bus.webp" alt="Ad 6" className="inline-block h-32 mx-4 rounded" />
      </marquee>

      <h1 className="text-4xl font-bold mb-8 text-center text-[#102116]">
        About Ultra Motions Digitals
      </h1>

      <p className="text-lg leading-relaxed text-gray-700 mb-6">
        At Ultra Motions Digitals, we believe that every brand has a unique story waiting to be told  and we're here to make sure the world sees it loud and clear. As a leading advertising service provider, we empower brands, businesses, and individuals with impactful outdoor advertising solutions that truly resonate.
      </p>

      <p className="text-lg leading-relaxed text-gray-700 mb-6">
        From bustling city billboards and vibrant LED displays to eye-catching wall drapes and BRT bus branding, our extensive network covers every corner of the nation. No matter your size or industry, we tailor each campaign to deliver maximum visibility and engagement  helping you reach the right audience at the right time.
      </p>

      <p className="text-lg leading-relaxed text-gray-700 mb-6">
        What sets us apart is our commitment to seamless service and partnership. From the moment you reach out, our dedicated team works closely with you to craft a smooth, hassle-free experience guiding you through every step from initial consultation to campaign launch and beyond.
      </p>

      <p className="text-lg leading-relaxed text-gray-700">
        Join the many brands who trust Ultra Motions Digitals to elevate their presence and create lasting impressions. Together, let's bring your vision to life and turn every outdoor space into a powerful storytelling platform.
      </p>
    </div>
  );
}
