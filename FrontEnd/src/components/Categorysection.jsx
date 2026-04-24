import React from "react";

function ServiceCard({ service, onChoose }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm flex flex-col ">
      <img  
        src={service.image}
        alt={service.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-sm font-semibold uppercase">{service.location}</p>
        <h3 className="mt-1 mb-2 font-semibold text-base">{service.title}</h3>
        <p className="text-lg font-bold">
          From <span className="line-through text-gray-400">{service.originalPrice}</span> {service.price} 
        </p>
        <button
          className="mt-auto border border-[#102116] rounded px-4 py-2 text-center hover:bg-gray-900 hover:text-white transition"
          onClick={() => onChoose(service)}
        >
          Choose Options
        </button>
      </div>
    </div>
  );
}

export default function CategorySection({ title, services, onChoose }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <ServiceCard key={index} service={service} onChoose={onChoose} />
        ))}
      </div>
    </div>
  );
}
