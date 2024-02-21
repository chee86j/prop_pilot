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
          method: "PUT", // Assuming the API uses PUT for updates
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
          {/* Property Name */}
          <div>
            <strong>Property Name:</strong>
            {editMode ? (
              <input
                type="text"
                name="propertyName"
                value={editedDetails.propertyName}
                onChange={handleEditChange}
              />
            ) : (
              <p>{propertyDetails.propertyName}</p>
            )}
          </div>
          {/* Address */}
          <div>
            <strong>Address:</strong>
            {editMode ? (
              <input
                type="text"
                name="address"
                value={editedDetails.address}
                onChange={handleEditChange}
              />
            ) : (
              <p>{propertyDetails.address}</p>
            )}
          </div>
          {/* City */}
          <div>
            <strong>City:</strong>
            {editMode ? (
              <input
                type="text"
                name="city"
                value={editedDetails.city}
                onChange={handleEditChange}
              />
            ) : (
              <p>{propertyDetails.city}</p>
            )}
          </div>
          {/* State */}
          <div>
            <strong>State:</strong>
            {editMode ? (
              <input
                type="text"
                name="state"
                value={editedDetails.state}
                onChange={handleEditChange}
              />
            ) : (
              <p>{propertyDetails.state}</p>
            )}
          </div>
          {/* Zip */}
          <div>
            <strong>Zip:</strong>
            {editMode ? (
              <input
                type="text"
                name="zip"
                value={editedDetails.zip}
                onChange={handleEditChange}
              />
            ) : (
              <p>{propertyDetails.zip}</p>
            )}
          </div>
          {/* County */}
          <div>
            <strong>County:</strong>
            {editMode ? (
              <input
                type="text"
                name="county"
                value={editedDetails.county}
                onChange={handleEditChange}
              />
            ) : (
              <p>{propertyDetails.county}</p>
            )}
          </div>
        </div>

        {/* Departments Section */}
        <div className="propDepartments bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Departments
          </h2>
          {/* Municipal Building Address */}
          <div>
            <strong>Municipal Building Address:</strong>
            {editMode ? (
              <input
                type="text"
                name="municipalBuildingAddress"
                value={editedDetails.municipalBuildingAddress}
                onChange={handleEditChange}
              />
            ) : (
              <p>{propertyDetails.municipalBuildingAddress}</p>
            )}
          </div>
          {/* Building Dept */}
          <div>
            <strong>Building Dept:</strong>
            {editMode ? (
              <input
                type="text"
                name="buildingDepartmentContact"
                value={editedDetails.buildingDepartmentContact}
                onChange={handleEditChange}
              />
            ) : (
              <p>{propertyDetails.buildingDepartmentContact}</p>
            )}
          </div>
          {/* Electric Dept */}
          <div>
            <strong>Electric Dept:</strong>
            {editMode ? (
              <input
                type="text"
                name="electricDepartmentContact"
                value={editedDetails.electricDepartmentContact}
                onChange={handleEditChange}
              />
            ) : (
              <p>{propertyDetails.electricDepartmentContact}</p>
            )}
          </div>
          {/* Plumbing Dept */}
          <div>
            <strong>Plumbing Dept:</strong>
            {editMode ? (
              <input
                type="text"
                name="plumbingDepartmentContact"
                value={editedDetails.plumbingDepartmentContact}
                onChange={handleEditChange}
              />
            ) : (
              <p>{propertyDetails.plumbingDepartmentContact}</p>
            )}
          </div>
          {/* Fire Dept */}
          <div>
            <strong>Fire Dept:</strong>
            {editMode ? (
              <input
                type="text"
                name="fireDepartmentContact"
                value={editedDetails.fireDepartmentContact}
                onChange={handleEditChange}
              />
            ) : (
              <p>{propertyDetails.fireDepartmentContact}</p>
            )}
          </div>
          {/* Environmental Dept */}
          <div>
            <strong>Environmental Dept:</strong>
            {editMode ? (
              <input
                type="text"
                name="environmentalDepartmentContact"
                value={editedDetails.environmentalDepartmentContact}
                onChange={handleEditChange}
              />
            ) : (
              <p>{propertyDetails.environmentalDepartmentContact}</p>
            )}
          </div>
        </div>

        {/* Total Outlay To Date Section */}
        <div className="totalOutlayToDate bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Total Outlay To Date
          </h2>
          {/* Purchase Cost */}
          <div>
            <strong>Purchase Cost:</strong>
            {editMode ? (
              <input
                type="number"
                name="purchaseCost"
                value={editedDetails.purchaseCost}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.purchaseCost}</p>
            )}
          </div>
          {/* Refinance Cost */}
          <div>
            <strong>Refinance Cost:</strong>
            {editMode ? (
              <input
                type="number"
                name="refinanceCost"
                value={editedDetails.refinanceCost}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.refinanceCost}</p>
            )}
          </div>
          {/* Total Rehab Cost */}
          <div>
            <strong>Total Rehab Cost:</strong>
            {editMode ? (
              <input
                type="number"
                name="totalRehabCost"
                value={editedDetails.totalRehabCost}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.totalRehabCost}</p>
            )}
          </div>
          {/* Kick Start Funds */}
          <div>
            <strong>Kick Start Funds:</strong>
            {editMode ? (
              <input
                type="number"
                name="kickStartFunds"
                value={editedDetails.kickStartFunds}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.kickStartFunds}</p>
            )}
          </div>
          {/* Lender Construction Draws Received */}
          <div>
            <strong>Lender Construction Draws Received:</strong>
            {editMode ? (
              <input
                type="number"
                name="lenderConstructionDrawsReceived"
                value={editedDetails.lenderConstructionDrawsReceived}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.lenderConstructionDrawsReceived}</p>
            )}
          </div>
          {/* Utilities Cost */}
          <div>
            <strong>Utilities Cost:</strong>
            {editMode ? (
              <input
                type="number"
                name="utilitiesCost"
                value={editedDetails.utilitiesCost}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.utilitiesCost}</p>
            )}
          </div>
          {/* Yearly Property Taxes */}
          <div>
            <strong>Yearly Property Taxes:</strong>
            {editMode ? (
              <input
                type="number"
                name="yearlyPropertyTaxes"
                value={editedDetails.yearlyPropertyTaxes}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.yearlyPropertyTaxes}</p>
            )}
          </div>
          {/* Mortgage Paid */}
          <div>
            <strong>Mortgage Paid:</strong>
            {editMode ? (
              <input
                type="number"
                name="mortgagePaid"
                value={editedDetails.mortgagePaid}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.mortgagePaid}</p>
            )}
          </div>
          {/* Homeowners Insurance */}
          <div>
            <strong>Homeowners Insurance:</strong>
            {editMode ? (
              <input
                type="number"
                name="homeownersInsurance"
                value={editedDetails.homeownersInsurance}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.homeownersInsurance}</p>
            )}
          </div>
          {/* Expected Yearly Rent */}
          <div>
            <strong>Expected Yearly Rent:</strong>
            {editMode ? (
              <input
                type="number"
                name="expectedYearlyRent"
                value={editedDetails.expectedYearlyRent}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.expectedYearlyRent}</p>
            )}
          </div>
          {/* Rental Income Received */}
          <div>
            <strong>Rental Income Received:</strong>
            {editMode ? (
              <input
                type="number"
                name="rentalIncomeReceived"
                value={editedDetails.rentalIncomeReceived}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.rentalIncomeReceived}</p>
            )}
          </div>
          {/* Vacancy Loss */}
          <div>
            <strong>Vacancy Loss:</strong>
            {editMode ? (
              <input
                type="number"
                name="vacancyLoss"
                value={editedDetails.vacancyLoss}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.vacancyLoss}</p>
            )}
          </div>
          {/* Management Fees */}
          <div>
            <strong>Management Fees:</strong>
            {editMode ? (
              <input
                type="number"
                name="managementFees"
                value={editedDetails.managementFees}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.managementFees}</p>
            )}
          </div>
          {/* Maintenance Costs */}
          <div>
            <strong>Maintenance Costs:</strong>
            {editMode ? (
              <input
                type="number"
                name="maintenanceCosts"
                value={editedDetails.maintenanceCosts}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.maintenanceCosts}</p>
            )}
          </div>
          {/* Total Equity */}
          <div>
            <strong>Total Equity:</strong>
            {editMode ? (
              <input
                type="number"
                name="totalEquity"
                value={editedDetails.totalEquity}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.totalEquity}</p>
            )}
          </div>
        </div>

        {/* Sale Projection Section */}
        <div className="saleProjection bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Sale Projection
          </h2>
          {/* ARV Sale Price */}
          <div>
            <strong>ARV Sale Price:</strong>
            {editMode ? (
              <input
                type="number"
                name="arvSalePrice"
                value={editedDetails.arvSalePrice}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.arvSalePrice}</p>
            )}
          </div>
          {/* Realtor Fees */}
          <div>
            <strong>Realtor Fees:</strong>
            {editMode ? (
              <input
                type="number"
                name="realtorFees"
                value={editedDetails.realtorFees}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.realtorFees}</p>
            )}
          </div>
          {/* Prop Tax till End of Year */}
          <div>
            <strong>Prop Tax till End of Year:</strong>
            {editMode ? (
              <input
                type="number"
                name="propTaxTillEndOfYear"
                value={editedDetails.propTaxTillEndOfYear}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.propTaxTillEndOfYear}</p>
            )}
          </div>
          {/* Lender Loan Balance */}
          <div>
            <strong>Lender Loan Balance:</strong>
            {editMode ? (
              <input
                type="number"
                name="lenderLoanBalance"
                value={editedDetails.lenderLoanBalance}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.lenderLoanBalance}</p>
            )}
          </div>
          {/* Pay Off Statement */}
          <div>
            <strong>Pay Off Statement:</strong>
            {editMode ? (
              <input
                type="number"
                name="payOffStatement"
                value={editedDetails.payOffStatement}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.payOffStatement}</p>
            )}
          </div>
          {/* Attorney Fees */}
          <div>
            <strong>Attorney Fees:</strong>
            {editMode ? (
              <input
                type="number"
                name="attorneyFees"
                value={editedDetails.attorneyFees}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.attorneyFees}</p>
            )}
          </div>
          {/* Misc Fees */}
          <div>
            <strong>Misc Fees:</strong>
            {editMode ? (
              <input
                type="number"
                name="miscFees"
                value={editedDetails.miscFees}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.miscFees}</p>
            )}
          </div>
          {/* Utilities */}
          <div>
            <strong>Utilities:</strong>
            {editMode ? (
              <input
                type="number"
                name="utilities"
                value={editedDetails.utilities}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.utilities}</p>
            )}
          </div>
          {/* Cash 2 Close from Purchase */}
          <div>
            <strong>Cash 2 Close from Purchase:</strong>
            {editMode ? (
              <input
                type="number"
                name="cash2closeFromPurchase"
                value={editedDetails.cash2closeFromPurchase}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.cash2closeFromPurchase}</p>
            )}
          </div>
          {/* Cash 2 Close from Refinance */}
          <div>
            <strong>Cash 2 Close from Refinance:</strong>
            {editMode ? (
              <input
                type="number"
                name="cash2closeFromRefinance"
                value={editedDetails.cash2closeFromRefinance}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.cash2closeFromRefinance}</p>
            )}
          </div>
          {/* Total Rehab Costs */}
          <div>
            <strong>Total Rehab Costs:</strong>
            {editMode ? (
              <input
                type="number"
                name="totalRehabCosts"
                value={editedDetails.totalRehabCosts}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.totalRehabCosts}</p>
            )}
          </div>
          {/* Expected Remaining Rent End To Year */}
          <div>
            <strong>Expected Remaining Rent End To Year:</strong>
            {editMode ? (
              <input
                type="number"
                name="expectedRemainingRentEndToYear"
                value={editedDetails.expectedRemainingRentEndToYear}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.expectedRemainingRentEndToYear}</p>
            )}
          </div>
          {/* Mortgage Paid */}
          <div>
            <strong>Mortgage Paid:</strong>
            {editMode ? (
              <input
                type="number"
                name="mortgagePaid"
                value={editedDetails.mortgagePaid}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.mortgagePaid}</p>
            )}
          </div>
          {/* Total Expenses */}
          <div>
            <strong>Total Expenses:</strong>
            {editMode ? (
              <input
                type="number"
                name="totalExpenses"
                value={editedDetails.totalExpenses}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.totalExpenses}</p>
            )}
          </div>
          {/* Total Construction Draws In */}
          <div>
            <strong>Total Construction Draws In:</strong>
            {editMode ? (
              <input
                type="number"
                name="totalConstructionDrawsReceived"
                value={editedDetails.totalConstructionDrawsReceived}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.totalConstructionDrawsReceived}</p>
            )}
          </div>
          {/* Project Net Profit If Sold */}
          <div>
            <strong>Project Net Profit If Sold:</strong>
            {editMode ? (
              <input
                type="number"
                name="projectNetProfitIfSold"
                value={editedDetails.projectNetProfitIfSold}
                onChange={handleEditChange}
              />
            ) : (
              <p>${propertyDetails.projectNetProfitIfSold}</p>
            )}
          </div>
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
