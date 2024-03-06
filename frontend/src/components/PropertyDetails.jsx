/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import ConstructionDraw from "./ConstructionDraw";
import { ChevronsUp, ChevronsDown } from "lucide-react";

const PropertyDetails = ({ propertyId }) => {
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    departments: true,
    outlayToDate: true,
    saleProjection: true,
    utilityInformation: true,
  });

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

  const cancelChanges = () => {
    setEditedDetails(propertyDetails);
    toggleEditMode();
  };

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return "";
    return parseFloat(value).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const renderEditableField = (
    label,
    name,
    value,
    type = "text",
    isCurrency = false
  ) => {
    // for formatting Currency
    const displayValue =
      isCurrency && !editMode ? formatCurrency(value) : value;

    // for formatting Account Number
    const formattedValue =
      name.includes("AccountNumber") && typeof value === "number"
        ? value.toString().replace(/\B(?=(\d{4})+(?!\d))/g, "-")
        : displayValue;

    return (
      <div className="flex justify-between items-center mb-2">
        <strong>{label}:</strong>
        {editMode ? (
          <input
            type={type}
            name={name}
            value={displayValue}
            onChange={handleEditChange}
            className="border rounded px-2 py-1"
          />
        ) : (
          <span>{formattedValue}</span>
        )}
      </div>
    );
  };

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  if (!propertyDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
      <ConstructionDraw propertyId={propertyId} />
      <h1 className="text-xl md:text-2xl font-bold text-gray-700 my-6">
        Property Details
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location Section */}
        <div className="propHeader bg-gray-50 p-4 shadow-sm rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-700">Location</h2>
            <button
              onClick={() => toggleSection("location")}
              className="focus:outline-none"
            >
              {expandedSections.location ? (
                <ChevronsUp size={24} className="text-gray-700" />
              ) : (
                <ChevronsDown size={24} className="text-gray-700" />
              )}
            </button>
          </div>
          {expandedSections.location && (
            <>
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
              {renderEditableField(
                "County",
                "county",
                editedDetails.county || ""
              )}
            </>
          )}
        </div>

        {/* Departments Section */}
        <div className="propDepartments bg-gray-50 p-4 shadow-sm rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-700">Departments</h2>
            <button
              onClick={() => toggleSection("departments")}
              className="focus:outline-none"
            >
              {expandedSections.departments ? (
                <ChevronsUp size={24} className="text-gray-700" />
              ) : (
                <ChevronsDown size={24} className="text-gray-700" />
              )}
            </button>
          </div>
          {expandedSections.departments && (
            <>
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
            </>
          )}
        </div>

        {/* Total Outlay To Date Section */}
        <div className="totalOutlayToDate bg-gray-50 p-4 shadow-sm rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Outlay To Date
            </h2>
            <button
              onClick={() => toggleSection("outlayToDate")}
              className="focus:outline-none"
            >
              {expandedSections.outlayToDate ? (
                <ChevronsUp size={24} className="text-gray-700" />
              ) : (
                <ChevronsDown size={24} className="text-gray-700" />
              )}
            </button>
          </div>
          {expandedSections.outlayToDate && (
            <>
              {renderEditableField(
                "Purchase Cost",
                "purchaseCost",
                editedDetails.purchaseCost || "",
                "number",
                true
              )}
              {renderEditableField(
                "Refinance Cost",
                "refinanceCost",
                editedDetails.refinanceCost || "",
                "number",
                true
              )}
              {renderEditableField(
                "Total Rehab Cost",
                "totalRehabCost",
                editedDetails.totalRehabCost || "",
                "number",
                true
              )}
              {renderEditableField(
                "Kick Start Funds",
                "kickStartFunds",
                editedDetails.kickStartFunds || "",
                "number",
                true
              )}
              {renderEditableField(
                "Lender Construction Draws Received",
                "lenderConstructionDrawsReceived",
                editedDetails.lenderConstructionDrawsReceived || "",
                "number",
                true
              )}
              <div className="border-t-2 border-black border-solid my-4"></div>
              {renderEditableField(
                "Utilities Cost",
                "utilitiesCost",
                editedDetails.utilitiesCost || "",
                "number",
                true
              )}
              {renderEditableField(
                "Yearly Property Taxes",
                "yearlyPropertyTaxes",
                editedDetails.yearlyPropertyTaxes || "",
                "number",
                true
              )}
              {renderEditableField(
                "Mortgage Paid",
                "mortgagePaid",
                editedDetails.mortgagePaid || "",
                "number",
                true
              )}
              {renderEditableField(
                "Homeowners Insurance",
                "homeownersInsurance",
                editedDetails.homeownersInsurance || "",
                "number",
                true
              )}
              {renderEditableField(
                "Expected Yearly Rent",
                "expectedYearlyRent",
                editedDetails.expectedYearlyRent || "",
                "number",
                true
              )}
              {renderEditableField(
                "Rental Income Received",
                "rentalIncomeReceived",
                editedDetails.rentalIncomeReceived || "",
                "number",
                true
              )}
              {renderEditableField(
                "Vacancy Loss",
                "vacancyLoss",
                editedDetails.vacancyLoss || "",
                "number",
                true
              )}
              {renderEditableField(
                "Management Fees",
                "managementFees",
                editedDetails.managementFees || "",
                "number",
                true
              )}
              {renderEditableField(
                "Maintenance Costs",
                "maintenanceCosts",
                editedDetails.maintenanceCosts || "",
                "number",
                true
              )}
              <div className="border-t-2 border-black border-solid my-4"></div>
              {renderEditableField(
                "Total Equity",
                "totalEquity",
                editedDetails.totalEquity || "",
                "number",
                true
              )}
            </>
          )}
        </div>

        {/* Sale Projection Section */}
        <div className="saleProjection bg-gray-50 p-4 shadow-sm rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-700">
              Sale Projection
            </h2>
            <button
              onClick={() => toggleSection("saleProjection")}
              className="focus:outline-none"
            >
              {expandedSections.saleProjection ? (
                <ChevronsUp size={24} className="text-gray-700" />
              ) : (
                <ChevronsDown size={24} className="text-gray-700" />
              )}
            </button>
          </div>
          {expandedSections.saleProjection && (
            <>
              {renderEditableField(
                "ARV Sale Price",
                "arvSalePrice",
                editedDetails.arvSalePrice || "",
                "number",
                true
              )}
              <div className="border-t-2 border-black border-solid my-4"></div>
              {renderEditableField(
                "Realtor Fees",
                "realtorFees",
                editedDetails.realtorFees || "",
                "number",
                true
              )}
              {renderEditableField(
                "Remaining Property Tax",
                "propTaxTillEndOfYear",
                editedDetails.propTaxTillEndOfYear || "",
                "number",
                true
              )}
              {renderEditableField(
                "Lender Loan Balance",
                "lenderLoanBalance",
                editedDetails.lenderLoanBalance || "",
                "number",
                true
              )}
              {renderEditableField(
                "Pay Off Statement",
                "payOffStatement",
                editedDetails.payOffStatement || "",
                "number",
                true
              )}
              {renderEditableField(
                "Attorney Fees",
                "attorneyFees",
                editedDetails.attorneyFees || "",
                "number",
                true
              )}
              {renderEditableField(
                "Misc Fees",
                "miscFees",
                editedDetails.miscFees || "",
                "number",
                true
              )}
              {renderEditableField(
                "Utilities",
                "utilities",
                editedDetails.utilities || "",
                "number",
                true
              )}
              {renderEditableField(
                "Cash to Close from Purchase",
                "cash2closeFromPurchase",
                editedDetails.cash2closeFromPurchase || "",
                "number",
                true
              )}
              {renderEditableField(
                "Cash to Close from Refinance",
                "cash2closeFromRefinance",
                editedDetails.cash2closeFromRefinance || "",
                "number",
                true
              )}
              {renderEditableField(
                "Total Rehab Costs",
                "totalRehabCosts",
                editedDetails.totalRehabCost || "",
                "number",
                true
              )}
              {renderEditableField(
                "Expected Remaining Rent End To Year",
                "expectedRemainingRentEndToYear",
                editedDetails.expectedRemainingRentEndToYear || "",
                "number",
                true
              )}
              {renderEditableField(
                "Mortgage Paid",
                "mortgagePaid",
                editedDetails.mortgagePaid || "",
                "number",
                true
              )}
              <div className="border-t-2 border-black border-solid my-4"></div>

              {renderEditableField(
                "Total Expenses",
                "totalExpenses",
                editedDetails.totalExpenses || "",
                "number",
                true
              )}
              {renderEditableField(
                "Total Expected Draws In",
                "totalConstructionDrawsReceived",
                editedDetails.totalConstructionDrawsReceived || "",
                "number",
                true
              )}
              <div className="border-t-2 border-black border-solid my-4"></div>
              {renderEditableField(
                "Project Net Profit If Sold",
                "projectNetProfitIfSold",
                editedDetails.projectNetProfitIfSold || "",
                "number",
                true
              )}
            </>
          )}
        </div>

        {/* Utility Information Section */}
        <div className="utilityInformation bg-gray-50 p-4 shadow-sm rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-700">
              Utility Information
            </h2>
            <button
              onClick={() => toggleSection("utilityInformation")}
              className="focus:outline-none"
            >
              {expandedSections.utilityInformation ? (
                <ChevronsUp size={24} className="text-gray-700" />
              ) : (
                <ChevronsDown size={24} className="text-gray-700" />
              )}
            </button>
          </div>
          {expandedSections.utilityInformation && (
            <>
              {renderEditableField(
                "Type of Heating & Cooling",
                "typeOfHeatingAndCooling",
                editedDetails.typeOfHeatingAndCooling || ""
              )}
              <div className="border-t-2 border-transparent my-2"></div>
              {renderEditableField(
                "Water Company",
                "waterCompany",
                editedDetails.waterCompany || ""
              )}
              {renderEditableField(
                "Water Account Number",
                "waterAccountNumber",
                editedDetails.waterAccountNumber || ""
              )}
              <div className="border-t-2 border-transparent my-2"></div>
              {renderEditableField(
                "Electric Company",
                "electricCompany",
                editedDetails.electricCompany || ""
              )}
              {renderEditableField(
                "Electric Account Number",
                "electricAccountNumber",
                editedDetails.electricAccountNumber || ""
              )}
              <div className="border-t-2 border-transparent my-2"></div>
              {renderEditableField(
                "Gas or Oil Company",
                "gasOrOilCompany",
                editedDetails.gasOrOilCompany || ""
              )}
              {renderEditableField(
                "Gas or Oil Account Number",
                "gasOrOilAccountNumber",
                editedDetails.gasOrOilAccountNumber || ""
              )}
              <div className="border-t-2 border-transparent my-2"></div>
              {renderEditableField(
                "Sewer Company",
                "sewerCompany",
                editedDetails.sewerCompany || ""
              )}
              {renderEditableField(
                "Sewer Account Number",
                "sewerAccountNumber",
                editedDetails.sewerAccountNumber || ""
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit, Save, and Cancel Buttons */}
      {editMode ? (
        <div className="flex justify-between">
          <button
            onClick={cancelChanges}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={saveChanges}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
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
