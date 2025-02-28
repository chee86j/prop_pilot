import { useState } from "react";
import { countyWebsites } from "../utils/countyWebsites";

const ResearchDropdown = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLink, setSelectedLink] = useState("");

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedLink("");
  };

  const handleLinkChange = (e) => {
    setSelectedLink(e.target.value);
    if (e.target.value) {
      window.open(e.target.value, "_blank");
    }
  };

  return (
    <div className="county-websites-dropdown bg-gray-50 p-4 shadow-sm rounded-md mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Due Diligence Websites
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a County/Category</option>
          {countyWebsites.map((category, index) => (
            <option key={index} value={category.category}>
              {category.category}
            </option>
          ))}
        </select>

        <select
          value={selectedLink}
          onChange={handleLinkChange}
          className="block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          disabled={!selectedCategory}
        >
          <option value="">Select a Website</option>
          {selectedCategory &&
            countyWebsites
              .find((cat) => cat.category === selectedCategory)
              ?.links.map((link, index) => (
                <option key={index} value={link.url}>
                  {link.name}
                </option>
              ))}
        </select>
      </div>
    </div>
  );
};

export default ResearchDropdown;
