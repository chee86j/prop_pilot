/* this component allows auth user to create a new single property */
import { useState } from "react";

const SingleProperty = () => {
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
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty({ ...property, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
      <h1 className="text-xl md:text-2xl font-bold text-gray-700 mb-6">
        Add New Property
      </h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="propHeader bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Location</h2>
          <label className="block">
            <span className="text-gray-700">Property Name:</span>
            <input
              type="text"
              name="propertyName"
              value={property.propertyName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Address:</span>
            <input
              type="text"
              name="address"
              value={property.address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">City:</span>
            <input
              type="text"
              name="city"
              value={property.city}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">State:</span>
            <input
              type="text"
              name="state"
              value={property.state}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Zip Code:</span>
            <input
              type="text"
              name="zipCode"
              value={property.zipCode}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">County:</span>
            <input
              type="text"
              name="county"
              value={property.county}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
        </div>

        <div className="propDepartments bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Departments:
          </h2>
          <label className="block">
            <span className="text-gray-700">Municipal Building Address:</span>
            <input
              type="text"
              name="municipalBuildingAddress"
              value={property.municipalBuildingAddress}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Building Dept:</span>
            <input
              type="text"
              name="buildingDepartmentContact"
              value={property.buildingDepartmentContact}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Electric Dept:</span>
            <input
              type="text"
              name="electricDepartmentContact"
              value={property.electricDepartmentContact}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Plumbing Dept:</span>
            <input
              type="text"
              name="plumbingDepartmentContact"
              value={property.plumbingDepartmentContact}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Fire Dept:</span>
            <input
              type="text"
              name="fireDepartmentContact"
              value={property.fireDepartmentContact}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Environmental Dept:</span>
            <input
              type="text"
              name="environmentalDepartmentContact"
              value={property.environmentalDepartmentContact}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
        </div>

        <div className="totalOutlayToDate bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Total Outlay To Date:
          </h2>
          <label className="block">
            <span className="text-gray-700">Purchase Cost:</span>
            <input
              type="number"
              name="purchaseCost"
              value={property.purchaseCost}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Refinance Costs:</span>
            <input
              type="number"
              name="refinanceCosts"
              value={property.refinanceCosts}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Total Rehab Cost:</span>
            <input
              type="number"
              name="totalRehabCost"
              value={property.totalRehabCost}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Kick Start Funds:</span>
            <input
              type="number"
              name="kickStartFunds"
              value={property.kickStartFunds}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">
              Lender Construction Draws Received:
            </span>
            <input
              type="number"
              name="lenderConstructionDrawsReceived"
              value={property.lenderConstructionDrawsReceived}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Utilities Cost:</span>
            <input
              type="number"
              name="utilitiesCost"
              value={property.utilitiesCost}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Yearly Property Taxes:</span>
            <input
              type="number"
              name="yearlyPropertyTaxes"
              value={property.yearlyPropertyTaxes}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Mortgage Paid:</span>
            <input
              type="number"
              name="mortgagePaid"
              value={property.mortgagePaid}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Homeowners Insurance:</span>
            <input
              type="number"
              name="homeownersInsurance"
              value={property.homeownersInsurance}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Expected Yearly Rent:</span>
            <input
              type="number"
              name="expectedYearlyRent"
              value={property.expectedYearlyRent}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Rental Income Received:</span>
            <input
              type="number"
              name="rentalIncomeReceived"
              value={property.rentalIncomeReceived}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Vacancy Loss:</span>
            <input
              type="number"
              name="vacancyLoss"
              value={property.vacancyLoss}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Management Fees:</span>
            <input
              type="number"
              name="managementFees"
              value={property.managementFees}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Maintenance Costs:</span>
            <input
              type="number"
              name="maintenanceCosts"
              value={property.maintenanceCosts}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Total Equity:</span>
            <input
              type="number"
              name="totalEquity"
              value={property.totalEquity}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
        </div>

        <div className="saleProjection bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Sale Projection
          </h2>
          <label className="block">
            <span className="text-gray-700">ARV Sale Price:</span>
            <input
              type="number"
              name="arvSalePrice"
              value={property.arvSalePrice}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Realtor Fees:</span>
            <input
              type="number"
              name="realtorFees"
              value={property.realtorFees}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Prop Tax till End of Year:</span>
            <input
              type="number"
              name="propTaxtillEndOfYear"
              value={property.propTaxtillEndOfYear}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Lender Loan Balance:</span>
            <input
              type="number"
              name="lenderLoanBalance"
              value={property.lenderLoanBalance}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Pay Off Statement:</span>
            <input
              type="number"
              name="payOffStatement"
              value={property.payOffStatement}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Attorney Fees:</span>
            <input
              type="number"
              name="attorneyFees"
              value={property.attorneyFees}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Misc Fees:</span>
            <input
              type="number"
              name="miscFees"
              value={property.miscFees}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Utilities:</span>
            <input
              type="number"
              name="utilities"
              value={property.utilities}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Cash 2 Close from Purchase:</span>
            <input
              type="number"
              name="cash2closeFromPurchase"
              value={property.cash2closeFromPurchase}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Cash 2 Close from Refinance:</span>
            <input
              type="number"
              name="cash2closeFromRefinance"
              value={property.cash2closeFromRefinance}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          {/* Add Kick Start Field Here */}
          <label className="block">
            <span className="text-gray-700">Total Rehab Costs:</span>
            <input
              type="number"
              name="totalRehabCosts"
              value={property.totalRehabCosts}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          {/* Add HomeOwners Insurance, Rental Income Paid Field Here */}
          <label className="block">
            <span className="text-gray-700">
              Expected Remaining Rent End To Year:
            </span>
            <input
              type="number"
              name="expectedRemainingRentEndToYear"
              value={property.expectedRemainingRentEndToYear}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          {/* Add Mortgage Paid Field Here */}
          {/* Separation Line Here */}
          <label className="block">
            <span className="text-gray-700">Total Expenses:</span>
            <input
              type="number"
              name="totalExpenses"
              value={property.totalExpenses}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Total Construction Draws In:</span>
            <input
              type="number"
              name="totalConstructionDrawsReceived"
              value={property.totalConstructionDrawsReceived}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Project Net Profit If Sold:</span>
            <input
              type="number"
              name="projectNetProfitIfSold"
              value={property.projectNetProfitIfSold}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
        </div>

        {/* Submit button for adding new property */}
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

export default SingleProperty;
