import React from "react";

export default function Testimonials() {
  return (
    <>
    <div className="bg-[#e5f4fb] justify-items-center lg:p-5 pb-5">
      <h1 className="text-4xl font-bold font-mono text-center py-3 lg:py-5 text-center ">
        Client Experiences
      </h1>
      <h2 className="text-xl py-3  text-center lg:py-0">
        Industry Success Stories: Ultra Motions Digital in Action
      </h2>
      <div className=" items-center flex-col lg:flex flex-row  space-y-8 lg:gap-5 lg:py-5 bg-[#e5f4fb]">
        <div className="rounded-xl lg:bg-[#e5f4fb] bg-gray-200 justify-items-center w-85 lg:w-full lg:h-full p-5 lg:px-10 lg:py-10">
          <img
            src="/images/hassy.jpg"
            alt="" 
            className="rounded-full w-15 h-15 " 
          />
          <h1 className="text-[15px] text-left  lg:py-5">
            Ultra Motions Digital has been a game-changer for our business. Their unmatched creativity, attention to detail, and dedication helped shape a digital presence that truly reflects our brand’s vision. We witnessed incredible growth in both engagement and sales. Their professionalism and passion shine through, and we wholeheartedly recommend them to any company aiming for success and long-term results.
          </h1>
          <h2>- Adekunle Akinola</h2>
        </div>
        <div className="rounded-xl lg:bg-[#e5f4fb] bg-gray-200 justify-items-center w-85 lg:w-full lg:h-full p-5 lg:px-10 lg:py-10">
          <img
            src="public\images\aji.jpg"
            alt=""
            className="rounded-full w-15 h-15 "
          />
          <h1 className="text-[15px] text-left py-5">
            Partnering with Ultra Motions Digital was the best decision we made for our brand. Their creativity, precision, and unwavering dedication turned our digital presence into something truly remarkable. We not only saw our engagement soar but also built a stronger connection with our audience. Their work speaks volumes, and we wholeheartedly recommend them to any business striving for excellence.
          </h1>
          <h2>- Oladimej Alabi</h2>
        </div>
        <div className="rounded-xl lg:bg-[#e5f4fb] bg-gray-200 justify-items-center w-85 lg:w-full lg:h-full p-5 lg:px-10 lg:py-10">
          <img
            src="public\images\femal.jpg"
            alt=""
            className="rounded-full w-15 h-15 "
          />
          <h1 className="text-[15px] text-left py-5">
           Working with Ultra Motions Digital delivered Massive results for our brand. Their vision, creative excellence, and unwavering dedication elevated our online presence to new heights. We saw tremendous growth in engagement and conversions. Their commitment to delivering excellence is evident, and we confidently recommend their services to any business looking to achieve lasting success and remarkable impact.
          </h1>
          <h2>- Ogunsanwo Mide</h2>
        </div>
      </div>
    </div>
    <div className="justify-items-center bg-[#e5f4fb]">
      <img src="public\images\Staticc.jpg" alt="" className=" w-full h-full lg:w-180 h-100"/>
    </div>
    </>
  );
}
