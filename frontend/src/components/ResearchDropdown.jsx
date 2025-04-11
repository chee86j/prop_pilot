import { useState } from "react";
import { countyWebsites } from "../utils/data";

const ResearchDropdown = () => {
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedWebsite, setSelectedWebsite] = useState("");

  const handleCountyChange = (e) => {
    setSelectedCounty(e.target.value);
    setSelectedWebsite("");
  };

  const handleWebsiteSelect = (e) => {
    setSelectedWebsite(e.target.value);
    if (e.target.value) {
      window.open(e.target.value, "_blank");
    }
  };

  const getCountyWebsiteOptions = (county) => {
    const countyData = countyWebsites.find((c) => c.county === county);
    if (!countyData) return null;

    let options = [];

    // Add main options based on county
    if (county === "Morris") {
      options = [
        { name: "Morris County Clerk", url: countyData.website },
        { name: "Morris County Tax Records", url: countyData.parcelSearch },
      ];
    } else if (county === "Sussex") {
      options = [
        { name: "Sussex County Clerk", url: countyData.website },
        {
          name: "Sussex County Assessment Records Search",
          url: countyData.parcelSearch,
        },
      ];
    } else if (county === "Bergen") {
      options = [
        { name: "Bergen County Clerk", url: countyData.website },
        {
          name: "Bergen County Assessment Records Search",
          url: countyData.parcelSearch,
        },
      ];
    } else if (county === "Essex") {
      options = [
        { name: "Essex County Clerk", url: countyData.website },
        { name: "Essex County Tax Data Hub", url: countyData.parcelSearch },
      ];
    } else if (county === "Hudson") {
      options = [
        { name: "Hudson County Clerk", url: countyData.website },
        {
          name: "Hudson County Assessment Records Search",
          url: countyData.parcelSearch,
        },
      ];
    } else if (county === "Union") {
      options = [
        { name: "Union County Clerk", url: countyData.website },
        {
          name: "Union County Assessment Records Search",
          url: countyData.parcelSearch,
        },
      ];
    } else if (county === "Warren") {
      options = [
        { name: "Warren County Clerk", url: countyData.website },
        {
          name: "Warren County Assessment Records Search",
          url: countyData.parcelSearch,
        },
      ];
    } else if (county === "General Statistics") {
      options = [
        { name: "Property Shark", url: countyData.website },
        { name: "Demographics and Statistics", url: countyData.parcelSearch },
      ];
    }

    // Add other links
    if (countyData.otherLinks) {
      countyData.otherLinks.forEach((link) => {
        options.push(link);
      });
    }

    return options;
  };

  return (
    <div className="county-websites-dropdown bg-gray-50 p-4 shadow-sm rounded-md mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        County Research Resources
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          value={selectedCounty}
          onChange={handleCountyChange}
          className="block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a County</option>
          {countyWebsites.map((county, index) => (
            <option key={index} value={county.county}>
              {county.county}, {county.state}
            </option>
          ))}
        </select>

        <select
          value={selectedWebsite}
          onChange={handleWebsiteSelect}
          className="block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          disabled={!selectedCounty}
        >
          <option value="">Select a Website</option>
          {selectedCounty && (
            <>
              {(() => {
                const options = getCountyWebsiteOptions(selectedCounty);
                if (options) {
                  return options.map((option, index) => (
                    <option key={index} value={option.url}>
                      {option.name}
                    </option>
                  ));
                }
                return null;
              })()}
            </>
          )}
        </select>
      </div>
      {selectedCounty && (
        <div className="mt-4 text-sm text-gray-600">
          {(() => {
            const county = countyWebsites.find(
              (c) => c.county === selectedCounty
            );
            return county?.notes || "";
          })()}
        </div>
      )}
    </div>
  );
};

export default ResearchDropdown;
