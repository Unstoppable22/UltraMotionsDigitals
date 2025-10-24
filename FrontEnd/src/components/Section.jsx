import React from "react";
import BB from "/images/bbstatic1.jpg"

export default function section() {
  return (
    <>
      <div className="p-5 lg:p-20 justify-center gap-10  bg-[#e5f4fb]">
        <h1 className="text-3xl font-bold font-mono text-center py-3 lg:py-5 text-left">
          Maximize ROI with Multi-channel Advertising
        </h1>
        <h2 className="text-2xl">
          Position your brand for success with custom advertising campaigns that
          drive real results across Nigeria.
        </h2>
        <div className="grid grid-cols-1  lg:grid-cols-3 lg:gap-5 lg:py-10">
          <div className="py-5">
            <img
              src={BB}
              alt=""
              className="rounded-3xl h-90 w-100  lg:h-90 w-100 py-2"
            />
            <h1 className="text-2xl font-bold font-mono">
              Strategic Campaign Development
            </h1>
            <h2 className="text-1xl ">
              Craft tailored strategies to boost your brand visibility and
              engagement across digital platform
            </h2>
          </div>
          <div className=" py-5">
            <img
              src="/images/socia m.jpg"
              alt=""
              className="rounded-3xl h-90 w-100 py-2"
            />
            <h1 className="text-2xl font-bold font-mono">
              Build a Stronger Online Brand
            </h1>
            <h2 className="text-1xl ">
              Strengthen your digital presence with expert content strategy,
              planning, and audience engagement.
            </h2>
          </div>
          <div className=" py-5">
            <img
              src="/images/seo.jpg"
              alt=""
              className="rounded-3xl h-90 w-100 py-2"
            />
            <h1 className="text-2xl font-bold font-mono">
              Search Engine Optimization
            </h1>
            <h2 className="text-1xl ">
              Improve your website's ranking on search engines to attract more
              organic traffic and potential clients.
            </h2>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3  py-10 bg-[#e5f4fb]">
        <img
          src="/images/digitalm.jpg"
          alt=""
          className=" lg:w-[full] h-full lg:h-110"
        />
        <img 
        src="/images/img1.jpeg" 
        alt="" 
        className=" w-full h-full lg:w-full h-110" />
        <img
          src="/images/gettyimages-2213438682-2048x2048.jpg"
          alt=""
          className="w-[full] h-full lg:h-110"
        />
        <img
          src="/images/housewall.jpg"
          alt=""
          className="w-full h-full lg:h-110"
        />
        <img src="/images/img3.jpeg" alt="" className="w-full h-full lg:w-full h-110" />
        <img
          src="/images/brt-bus.webp"
          alt=""
          className="w-full h-full lg:h-110"
        />
      </div>
    </>
  );
}
