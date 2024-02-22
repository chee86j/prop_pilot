/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const PropertyDetails = ({ propertyId }) => {
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/properties/${propertyId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching property details");
        }

        const data = await response.json();
        setPropertyDetails(data);
        setEditedDetails(data);
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  const handleEditChange = (e) => {
    setEditedDetails({ ...editedDetails, [e.target.name]: e.target.value });
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const saveChanges = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/properties/${propertyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(editedDetails),
        }
      );

      if (!response.ok) {
        throw new Error("Error saving property details");
      }

      const data = await response.json();
      setPropertyDetails(data);
      toggleEditMode();
    } catch (error) {
      console.error("Error saving property details:", error);
    }
  };

  const renderEditableField = (label, name, value, type = "text") => {
    return (
      <div className="flex justify-between items-center mb-2">
        <strong>{label}:</strong>
        {editMode ? (
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleEditChange}
            className="border rounded px-2 py-1"
          />
        ) : (
          <span>{value}</span>
        )}
      </div>
    );
  };

  if (!propertyDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
      <h1 className="text-xl md:text-2xl font-bold text-gray-700 mb-6">
        Property Details
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location Section */}
        <div className="propHeader bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Location</h2>
          {renderEditableField(
            "Property Name",
            "propertyName",
            editedDetails.propertyName || ""
          )}
          {renderEditableField(
            "Address",
            "address",
            editedDetails.address || ""
          )}
          {renderEditableField("City", "city", editedDetails.city || "")}
          {renderEditableField("State", "state", editedDetails.state || "")}
          {renderEditableField(
            "Zip Code",
            "zipCode",
            editedDetails.zipCode || "",
            "number"
          )}
          {renderEditableField("County", "county", editedDetails.county || "")}
        </div>

        {/* Departments Section */}
        <div className="propDepartments bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Departments
          </h2>
          {renderEditableField(
            "Municipal Building Address",
            "municipalBuildingAddress",
            editedDetails.municipalBuildingAddress || ""
          )}
          {renderEditableField(
            "Building Dept",
            "buildingDepartmentContact",
            editedDetails.buildingDepartmentContact || ""
          )}
          {renderEditableField(
            "Electric Dept",
            "electricDepartmentContact",
            editedDetails.electricDepartmentContact || ""
          )}
          {renderEditableField(
            "Plumbing Dept",
            "plumbingDepartmentContact",
            editedDetails.plumbingDepartmentContact || ""
          )}
          {renderEditableField(
            "Fire Dept",
            "fireDepartmentContact",
            editedDetails.fireDepartmentContact || ""
          )}
          {renderEditableField(
            "Environmental Dept",
            "environmentalDepartmentContact",
            editedDetails.environmentalDepartmentContact || ""
          )}
        </div>

        {/* Total Outlay To Date Section */}
        <div className="totalOutlayToDate bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Total Outlay To Date
          </h2>
          {renderEditableField(
            "Purchase Cost",
            "purchaseCost",
            editedDetails.purchaseCost || "",
            "number"
          )}
          {renderEditableField(
            "Refinance Cost",
            "refinanceCost",
            editedDetails.refinanceCost || "",
            "number"
          )}
          {renderEditableField(
            "Total Rehab Cost",
            "totalRehabCost",
            editedDetails.totalRehabCost || "",
            "number"
          )}
          {renderEditableField(
            "Kick Start Funds",
            "kickStartFunds",
            editedDetails.kickStartFunds || "",
            "number"
          )}
          {renderEditableField(
            "Lender Construction Draws Received",
            "lenderConstructionDrawsReceived",
            editedDetails.lenderConstructionDrawsReceived || "",
            "number"
          )}
          {renderEditableField(
            "Utilities Cost",
            "utilitiesCost",
            editedDetails.utilitiesCost || "",
            "number"
          )}
          {renderEditableField(
            "Yearly Property Taxes",
            "yearlyPropertyTaxes",
            editedDetails.yearlyPropertyTaxes || "",
            "number"
          )}
          {renderEditableField(
            "Mortgage Paid",
            "mortgagePaid",
            editedDetails.mortgagePaid || "",
            "number"
          )}
          {renderEditableField(
            "Homeowners Insurance",
            "homeownersInsurance",
            editedDetails.homeownersInsurance || "",
            "number"
          )}
          {renderEditableField(
            "Expected Yearly Rent",
            "expectedYearlyRent",
            editedDetails.expectedYearlyRent || "",
            "number"
          )}
          {renderEditableField(
            "Rental Income Received",
            "rentalIncomeReceived",
            editedDetails.rentalIncomeReceived || "",
            "number"
          )}
          {renderEditableField(
            "Vacancy Loss",
            "vacancyLoss",
            editedDetails.vacancyLoss || "",
            "number"
          )}
          {renderEditableField(
            "Management Fees",
            "managementFees",
            editedDetails.managementFees || "",
            "number"
          )}
          {renderEditableField(
            "Maintenance Costs",
            "maintenanceCosts",
            editedDetails.maintenanceCosts || "",
            "number"
          )}
          {renderEditableField(
            "Total Equity",
            "totalEquity",
            editedDetails.totalEquity || "",
            "number"
          )}
        </div>

        {/* Sale Projection Section */}
        <div className="saleProjection bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Sale Projection
          </h2>
          {renderEditableField(
            "ARV Sale Price",
            "arvSalePrice",
            editedDetails.arvSalePrice || "",
            "number"
          )}
          {renderEditableField(
            "Realtor Fees",
            "realtorFees",
            editedDetails.realtorFees || "",
            "number"
          )}
          {renderEditableField(
            "Prop Tax till End of Year",
            "propTaxTillEndOfYear",
            editedDetails.propTaxTillEndOfYear || "",
            "number"
          )}
          {renderEditableField(
            "Lender Loan Balance",
            "lenderLoanBalance",
            editedDetails.lenderLoanBalance || "",
            "number"
          )}
          {renderEditableField(
            "Pay Off Statement",
            "payOffStatement",
            editedDetails.payOffStatement || "",
            "number"
          )}
          {renderEditableField(
            "Attorney Fees",
            "attorneyFees",
            editedDetails.attorneyFees || "",
            "number"
          )}
          {renderEditableField(
            "Misc Fees",
            "miscFees",
            editedDetails.miscFees || "",
            "number"
          )}
          {renderEditableField(
            "Utilities",
            "utilities",
            editedDetails.utilities || "",
            "number"
          )}
          {renderEditableField(
            "Cash 2 Close from Purchase",
            "cash2closeFromPurchase",
            editedDetails.cash2closeFromPurchase || "",
            "number"
          )}
          {renderEditableField(
            "Cash 2 Close from Refinance",
            "cash2closeFromRefinance",
            editedDetails.cash2closeFromRefinance || "",
            "number"
          )}
          {renderEditableField(
            "Total Rehab Costs",
            "totalRehabCosts",
            editedDetails.totalRehabCosts || "",
            "number"
          )}
          {renderEditableField(
            "Expected Remaining Rent End To Year",
            "expectedRemainingRentEndToYear",
            editedDetails.expectedRemainingRentEndToYear || "",
            "number"
          )}
          {renderEditableField(
            "Mortgage Paid",
            "mortgagePaid",
            editedDetails.mortgagePaid || "",
            "number"
          )}
          {renderEditableField(
            "Total Expenses",
            "totalExpenses",
            editedDetails.totalExpenses || "",
            "number"
          )}
          {renderEditableField(
            "Total Construction Draws In",
            "totalConstructionDrawsReceived",
            editedDetails.totalConstructionDrawsReceived || "",
            "number"
          )}
          {renderEditableField(
            "Project Net Profit If Sold",
            "projectNetProfitIfSold",
            editedDetails.projectNetProfitIfSold || "",
            "number"
          )}
        </div>
      </div>
      {/* Edit and Save Buttons */}
      {editMode ? (
        <button
          onClick={saveChanges}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      ) : (
        <button
          onClick={toggleEditMode}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Edit
        </button>
      )}
    </div>
  );
};

export default PropertyDetails;
