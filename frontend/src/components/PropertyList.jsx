import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatting";
import { fetchUserProfile } from "../utils/fetchUserProfile";
import SkyScrapers from "../assets/icons/skyscrapers.png";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/properties", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching properties");
        }

        const data = await response.json();
        setProperties(data);
      } catch (err) {
        console.error("Error fetching properties:", err);
      }
    };

    fetchProperties();
    fetchUserProfile(setUser);
  }, []);

  const handleDetails = (propertyId) => {
    if (propertyId) {
      navigate(`/property/${propertyId}`);
    } else {
      console.error("PropertyId is undefined");
    }
  };

  const handleDelete = async (propertyId) => {
    const confirmDelete = window.confirm(
      "Are You Sure You Want to DELETE this property?"
    );

    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/properties/${propertyId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error deleting property");
        }

        // Filter out deleted property from state
        setProperties(
          properties.filter((property) => property.id !== propertyId)
        );
      } catch (err) {
        console.error("Error deleting property:", err);
      }
    }
  };

  const goToAddPropertyPage = () => {
    navigate("/addproperty");
  };

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="flex flex-col">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={SkyScrapers}
                  alt="SkyScrapers"
                  className="w-24 h-24"
                />
                <div>
                  <h1 className="text-xl font-semibold text-gray-700">
                    Displaying Properties
                  </h1>
                  {user && (
                    <h2 className="text-lg font-medium text-green-500">
                      {`for ${user.first_name} ${user.last_name}`}
                    </h2>
                  )}
                </div>
                <img
                  src={SkyScrapers}
                  alt="SkyScrapers"
                  className="w-24 h-24"
                />
              </div>
              <button
                onClick={goToAddPropertyPage}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition ease-in-out duration-300"
              >
                Add New Property
              </button>
            </div>
          </div>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="py-3 px-6">Property Name</th>
                  <th className="py-3 px-6">Address</th>
                  <th className="py-3 px-6">City</th>
                  <th className="py-3 px-6 hidden md:table-cell">
                    Purchase Cost
                  </th>
                  <th className="py-3 px-6 hidden md:table-cell">Rehab Cost</th>
                  <th className="py-3 px-6 hidden md:table-cell">Sale Price</th>
                  <th className="py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr
                    key={property.id}
                    className="bg-white border-b hover:bg-gray-100"
                  >
                    <td className="py-4 px-6">{property.propertyName}</td>
                    <td className="py-4 px-6">{property.address}</td>
                    <td className="py-4 px-6">{property.city}</td>
                    <td className="py-4 px-6 hidden md:table-cell">
                      {formatCurrency(property.purchaseCost)}
                    </td>
                    <td className="py-4 px-6 hidden md:table-cell">
                      {formatCurrency(property.totalRehabCost)}
                    </td>
                    <td className="py-4 px-6 hidden md:table-cell">
                      {formatCurrency(property.arvSalePrice)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2 justify-center">
                        <button
                          onClick={() => handleDetails(property.id)}
                          className="inline-block px-2 py-1 border text-blue-600 hover:bg-blue-100 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                          title="Edit Product"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="inline-block px-2 py-1 border text-red-600 hover:bg-red-100 rounded-md focus:outline-none focus:ring focus:border-red-300"
                          title="Delete Product"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyList;
