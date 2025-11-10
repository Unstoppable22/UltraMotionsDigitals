import React from "react";

export default function TestimonialCard({ image, comment, name }) {
  return (
    <div>
      <div className="rounded-xl lg:bg-[#e5f4fb] bg-gray-200 justify-items-center w-85 lg:w-full lg:h-full p-5 lg:px-10 lg:py-10">
        <img src={image} alt="" className="rounded-full w-15 h-15 " />
        <h1 className="text-[15px] text-center  lg:py-5">{comment}</h1>
        <h2>{name}</h2>
      </div>
    </div>
  );
}
