import { useState, useEffect } from "react";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");

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
        setError(err.message);
      }
    };

    fetchProperties();
  }, []);

  const handleDetails = (propertyId) => {
    // Navigate to details page or maybe open a details modal
    console.log("Details for property:", propertyId);
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
        setError(err.message);
      }
    }
  };

  return (
    <div>
      <h2>My Properties</h2>
      {error && <p className="error">{error}</p>}
      <div className="property-list">
        {properties.map((property) => (
          <div key={property.id} className="property-item">
            <h3>{property.propertyName}</h3>
            <p>Address: {property.address}</p>
            <p>City: {property.city}</p>
            <p>State: {property.state}</p>
            <p>Purchase Costs: {property.purchaseCost}</p>
            <p>Total Rehab Costs: {property.totalRehabCost}</p>
            <p>ARV Sale Price: {property.arvSalePrice}</p>
            <p>Project Net Profit If Sold: {property.projectNetProfitIfSold}</p>
            <button onClick={() => handleDetails(property.id)}>Details</button>
            <button onClick={() => handleDelete(property.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
