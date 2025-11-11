import React, { useState, useMemo, useCallback } from "react";
import LaunchSection from "./LaunchSection";
import CategorySection from "./CategorySection";
import Listing from "./Listing";

export default function CategorySectionGroup() {
  const [showModal, setShowModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // useCallback to memoize handleChoose and avoid unnecessary re-renders downstream
  const handleChoose = useCallback((locationData) => {
    setSelectedLocation(locationData);
    setShowModal(true);
  }, []);

  // useMemo to optimize filtering when searchTerm changes
  const filteredCategories = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return Listing; // if search empty, return all categories

    return Listing.map(category => ({
      ...category,
      services: category.services.filter(service =>
        [service.title, service.location || ""]
          .join(" ")
          .toLowerCase()
          .includes(search)
      ),
    })).filter(category => category.services.length > 0);
  }, [searchTerm]);

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto bg-[#e5f4fb]">
      <h1 className="text-3xl font-semibold mb-6 ">Explore Ad Spaces</h1>

      {/* Search Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search by location or title"
        className="w-full border border-gray-900 px-4 py-3 rounded-lg mb-10 shadow-sm"
        autoComplete="off"
        aria-label="Search locations or titles"
      />

      {/* Categories List */}
      {filteredCategories.length > 0 ? (
        filteredCategories.map(category => (
          <CategorySection
            key={category.title}
            title={category.title}
            services={category.services}
            onChoose={handleChoose}
          />
        ))
      ) : (
        <p className="text-center text-gray-500 text-lg mt-10">
          No matching ads found.
        </p>
      )}

      {/* Launch Modal */}
      {showModal && (
        <LaunchSection
          selectedLocation={selectedLocation}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
