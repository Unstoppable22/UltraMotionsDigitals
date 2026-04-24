import React from "react";

export default function ServiceCard({ title, price, image, description, location, onChoose }) {
  const handleChoose = () => {
    onChoose({
      name: title,
      price,
      imageUrl: image,
      description,
      location,
    });
  };

  return (
    <div className="bg-white shadow rounded overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        {location && <p className="text-gray-500 text-sm">{location}</p>}
        <p className="text-green-600">{price}</p>
        <button
          onClick={handleChoose}
          className="mt-2 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition"
        >
          Choose Options
        </button>
      </div>
    </div>
  );
}
