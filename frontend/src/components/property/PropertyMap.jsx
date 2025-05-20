import { Home } from "lucide-react";

const PropertyMap = ({ propertyDetails }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex justify-between items-center">
        <h2 className="text-white text-lg font-semibold">
          Property Location
        </h2>
        {propertyDetails.address && (
          <div className="flex space-x-2">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                `${propertyDetails.address || ""}, ${
                  propertyDetails.city || ""
                }, ${propertyDetails.state || ""} ${
                  propertyDetails.zipCode || ""
                }`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-3 py-1 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200"
            >
              <Home className="h-4 w-4 mr-1" />
              <span className="text-sm">Directions</span>
            </a>
          </div>
        )}
      </div>
      {propertyDetails.address ? (
        <div className="mt-4 border rounded-lg overflow-hidden">
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              `${propertyDetails.address || ""}, ${
                propertyDetails.city || ""
              }, ${propertyDetails.state || ""} ${
                propertyDetails.zipCode || ""
              }`
            )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onError={(e) => {
              console.error("Map failed to load", e);
              e.target.style.display = "none";
              e.target.parentNode.innerHTML += `
                <div class="flex items-center justify-center h-80 bg-gray-100">
                  <p class="text-gray-500">Map could not be loaded. Please check the property address.</p>
                </div>
              `;
            }}
          ></iframe>
        </div>
      ) : (
        <div className="flex items-center justify-center h-80 md:h-96 bg-gray-100">
          <p className="text-gray-500">
            Please add a property address to display the map.
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertyMap; 