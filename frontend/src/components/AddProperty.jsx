/* this component allows auth user to create a new single property */
import { useState } from "react";

const AddProperty = () => {
  const [property, setProperty] = useState({
    propertyName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    county: "",
    municipalBuildingAddress: "",
    buildingDepartmentContact: "",
    electricDepartmentContact: "",
    plumbingDepartmentContact: "",
    fireDepartmentContact: "",
    environmentalDepartmentContact: "",
    purchaseCost: 0,
    refinanceCosts: 0,
    totalRehabCost: 0,
    kickStartFunds: 0,
    lenderConstructionDrawsReceived: 0,
    utilitiesCost: 0,
    yearlyPropertyTaxes: 0,
    mortgagePaid: 0,
    homeownersInsurance: 0,
    expectedYearlyRent: 0,
    rentalIncomeReceived: 0,
    vacancyLoss: 0,
    managementFees: 0,
    maintenanceCosts: 0,
    totalEquity: 0,
    arvSalePrice: 0,
    realtorFees: 0,
    propTaxtillEndOfYear: 0,
    lenderLoanBalance: 0,
    payOffStatement: 0,
    attorneyFees: 0,
    miscFees: 0,
    utilities: 0,
    cash2closeFromPurchase: 0,
    cash2closeFromRefinance: 0,
    totalRehabCosts: 0,
    expectedRemainingRentEndToYear: 0,
    totalExpenses: 0,
    totalConstructionDrawsReceived: 0,
    projectNetProfitIfSold: 0,
    typeOfHeatingAndCooling: "",
    waterCompany: "",
    waterAccountNumber: "",
    electricCompany: "",
    electricAccountNumber: "",
    gasOrOilCompany: "",
    gasOrOilAccountNumber: "",
    sewerCompany: "",
    sewerAccountNumber: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty({ ...property, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if propertyName is empty, if not, proceed with saving the property
    if (!property.propertyName.trim()) {
      setErrorMessage("Property Name is required");
      return;
    }

    // API call to save the new property
    fetch("http://localhost:5000/api/properties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(property),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Property save failed");
        }
        return response.json();
      })
      .then(() => {
        // Handle successful property save
        console.log("Property added successfully");
        // Redirect or update UI accordingly
      })
      .catch((error) => {
        setErrorMessage("Failed to save property: " + error.message);
      });
  };

  // Helper function to render input fields
  const renderInputField = (label, name, type = "text", isNumber = false) => {
    return (
      <label className="flex justify-between items-center mb-2">
        <span className="text-gray-700">{label}:</span>
        <input
          type={type}
          name={name}
          value={property[name]}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
            isNumber ? "text-right" : ""
          }`}
        />
      </label>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
      <h1 className="text-xl md:text-2xl font-bold text-gray-700 mb-6">
        Add New Property
      </h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Location Section */}
        <div className="propHeader bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Location</h2>
          {renderInputField("Property Name", "propertyName")}
          {renderInputField("Address", "address")}
          {renderInputField("City", "city")}
          {renderInputField("State", "state")}
          {renderInputField("Zip Code", "zipCode")}
          {renderInputField("County", "county")}
        </div>

        {/* Departments Section */}
        <div className="propDepartments bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Departments
          </h2>
          {renderInputField(
            "Municipal Building Address",
            "municipalBuildingAddress"
          )}
          {renderInputField("Building Dept", "buildingDepartmentContact")}
          {renderInputField("Electric Dept", "electricDepartmentContact")}
          {renderInputField("Plumbing Dept", "plumbingDepartmentContact")}
          {renderInputField("Fire Dept", "fireDepartmentContact")}
          {renderInputField(
            "Environmental Dept",
            "environmentalDepartmentContact"
          )}
        </div>

        {/* Total Outlay To Date Section */}
        <div className="totalOutlayToDate bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Total Outlay To Date
          </h2>
          {renderInputField("Purchase Cost", "purchaseCost", "number", true)}
          {renderInputField(
            "Refinance Costs",
            "refinanceCosts",
            "number",
            true
          )}
          {renderInputField(
            "Total Rehab Cost",
            "totalRehabCost",
            "number",
            true
          )}
          {renderInputField(
            "Kick Start Funds",
            "kickStartFunds",
            "number",
            true
          )}
          {renderInputField(
            "Lender Construction Draws Received",
            "lenderConstructionDrawsReceived",
            "number",
            true
          )}
          {renderInputField("Utilities Cost", "utilitiesCost", "number", true)}
          {renderInputField(
            "Yearly Property Taxes",
            "yearlyPropertyTaxes",
            "number",
            true
          )}
          {renderInputField("Mortgage Paid", "mortgagePaid", "number", true)}
          {renderInputField(
            "Homeowners Insurance",
            "homeownersInsurance",
            "number",
            true
          )}
          {renderInputField(
            "Expected Yearly Rent",
            "expectedYearlyRent",
            "number",
            true
          )}
          {renderInputField(
            "Rental Income Received",
            "rentalIncomeReceived",
            "number",
            true
          )}
          {renderInputField("Vacancy Loss", "vacancyLoss", "number", true)}
          {renderInputField(
            "Management Fees",
            "managementFees",
            "number",
            true
          )}
          {renderInputField(
            "Maintenance Costs",
            "maintenanceCosts",
            "number",
            true
          )}
          {renderInputField("Total Equity", "totalEquity", "number", true)}
        </div>

        {/* Sale Projection Section */}
        <div className="saleProjection bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Sale Projection
          </h2>
          {renderInputField("ARV Sale Price", "arvSalePrice", "number", true)}
          {renderInputField("Realtor Fees", "realtorFees", "number", true)}
          {renderInputField(
            "Prop Tax till End of Year",
            "propTaxtillEndOfYear",
            "number",
            true
          )}
          {renderInputField(
            "Lender Loan Balance",
            "lenderLoanBalance",
            "number",
            true
          )}
          {renderInputField(
            "Pay Off Statement",
            "payOffStatement",
            "number",
            true
          )}
          {renderInputField("Attorney Fees", "attorneyFees", "number", true)}
          {renderInputField("Misc Fees", "miscFees", "number", true)}
          {renderInputField("Utilities", "utilities", "number", true)}
          {renderInputField(
            "Cash to Close from Purchase",
            "cash2closeFromPurchase",
            "number",
            true
          )}
          {renderInputField(
            "Cash to Close from Refinance",
            "cash2closeFromRefinance",
            "number",
            true
          )}
          {renderInputField(
            "Total Rehab Costs",
            "totalRehabCosts",
            "number",
            true
          )}
          {renderInputField(
            "Expected Remaining Rent End To Year",
            "expectedRemainingRentEndToYear",
            "number",
            true
          )}
          {renderInputField("Total Expenses", "totalExpenses", "number", true)}
          {renderInputField(
            "Total Construction Draws Received",
            "totalConstructionDrawsReceived",
            "number",
            true
          )}
          {renderInputField(
            "Project Net Profit If Sold",
            "projectNetProfitIfSold",
            "number",
            true
          )}
        </div>

        {/* Utility Information Section */}
        <div className="utilityInformation bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Utility Information
          </h2>
          {renderInputField(
            "Type of Heating & Cooling",
            "typeOfHeatingAndCooling"
          )}
          {renderInputField("Water Company", "waterCompany")}
          {renderInputField(
            "Water Account Number",
            "waterAccountNumber",
            "number",
            true
          )}
          {renderInputField("Electric Company", "electricCompany")}
          {renderInputField(
            "Electric Account Number",
            "electricAccountNumber",
            "number",
            true
          )}
          {renderInputField("Gas or Oil Company", "gasOrOilCompany")}
          {renderInputField(
            "Gas or Oil Account Number",
            "gasOrOilAccountNumber",
            "number",
            true
          )}
          {renderInputField("Sewer Company", "sewerCompany")}
          {renderInputField(
            "Sewer Account Number",
            "sewerAccountNumber",
            "number",
            true
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="md:col-span-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Add New Property
        </button>
      </form>
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </div>
  );
};

export default AddProperty;
