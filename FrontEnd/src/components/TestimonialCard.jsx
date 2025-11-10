import React from "react";

export default function TestimonialCard({ image, comment, name }) {
  return (
    <div>
      <div className="flex flex-col gap-5 rounded-xl bg-[#e5f4fb] bg-gray-200 justify-items-center items-center w-85 w-full h-[450px] px-10 py-10">
        <img src={image} alt="" className="rounded-full w-15 h-15 " />
        <p className="text-[15px] text-center  lg:py-5">{comment}</p>
        <h2>{name}</h2>
      </div>
    </div>
  );
}
