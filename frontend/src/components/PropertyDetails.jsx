/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const PropertyDetails = ({ propertyId }) => {
  const [propertyDetails, setPropertyDetails] = useState(null);

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
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  if (!propertyDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
      <h1 className="text-xl md:text-2xl font-bold text-gray-700 mb-6">
        Property Details
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="propHeader bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Location</h2>
          <div>
            <strong>Property Name:</strong>
            <p>{propertyDetails.propertyName}</p>
          </div>
          <div>
            <strong>Address:</strong>
            <p>{propertyDetails.address}</p>
          </div>
          <div>
            <strong>City:</strong>
            <p>{propertyDetails.city}</p>
          </div>
          <div>
            <strong>State:</strong>
            <p>{propertyDetails.state}</p>
          </div>
          <div>
            <strong>Zip:</strong>
            <p>{propertyDetails.zip}</p>
          </div>
          <div>
            <strong>County:</strong>
            <p>{propertyDetails.county}</p>
          </div>
        </div>

        <div className="propDepartments bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Departments
          </h2>
          <div>
            <strong>Municipal Building Address:</strong>
            <p>{propertyDetails.municipalBuildingAddress}</p>
          </div>
          <div>
            <strong>Building Dept:</strong>
            <p>{propertyDetails.buildingDepartmentContact}</p>
          </div>
          <div>
            <strong>Electric Dept:</strong>
            <p>{propertyDetails.electricDepartmentContact}</p>
          </div>
          <div>
            <strong>Plumbing Dept:</strong>
            <p>{propertyDetails.plumbingDepartmentContact}</p>
          </div>
          <div>
            <strong>Fire Dept:</strong>
            <p>{propertyDetails.fireDepartmentContact}</p>
          </div>
          <div>
            <strong>Environmental Dept:</strong>
            <p>{propertyDetails.environmentalDepartmentContact}</p>
          </div>
        </div>

        <div className="totalOutlayToDate bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Total Outlay To Date
          </h2>
          <div>
            <strong>Purchase Cost:</strong>
            <p>${propertyDetails.purchaseCost}</p>
          </div>
          <div>
            <strong>Refinance Cost:</strong>
            <p>${propertyDetails.refinanceCost}</p>
          </div>
          <div>
            <strong>Total Rehab Cost:</strong>
            <p>${propertyDetails.totalRehabCost}</p>
          </div>
          <div>
            <strong>Kick Start Funds:</strong>
            <p>${propertyDetails.kickStartFunds}</p>
          </div>
          <div>
            <strong>Lender Construction Draws Received:</strong>
            <p>${propertyDetails.lenderConstructionDrawsReceived}</p>
          </div>
          <div>
            <strong>Utilities Cost:</strong>
            <p>${propertyDetails.utilitiesCost}</p>
          </div>
          <div>
            <strong>Yearly Property Taxes:</strong>
            <p>${propertyDetails.yearlyPropertyTaxes}</p>
          </div>
          <div>
            <strong>Mortgage Paid:</strong>
            <p>${propertyDetails.mortgagePaid}</p>
          </div>
          <div>
            <strong>Homeowners Insurance:</strong>
            <p>${propertyDetails.homeownersInsurance}</p>
          </div>
          <div>
            <strong>Expected Yearly Rent:</strong>
            <p>${propertyDetails.expectedYearlyRent}</p>
          </div>
          <div>
            <strong>Rental Income Received:</strong>
            <p>${propertyDetails.rentalIncomeReceived}</p>
          </div>
          <div>
            <strong>Vacancy Loss:</strong>
            <p>${propertyDetails.vacancyLoss}</p>
          </div>
          <div>
            <strong>Management Fees:</strong>
            <p>${propertyDetails.managementFees}</p>
          </div>
          <div>
            <strong>Maintenance Costs:</strong>
            <p>${propertyDetails.maintenanceCosts}</p>
          </div>
          <div>
            <strong>Total Equity:</strong>
            <p>${propertyDetails.totalEquity}</p>
          </div>
        </div>

        <div className="saleProjection bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Sale Projection
          </h2>
          <div>
            <strong>ARV Sale Price:</strong>
            <p>${propertyDetails.arvSalePrice}</p>
          </div>
          <div>
            <strong>Realtor Fees:</strong>
            <p>${propertyDetails.realtorFees}</p>
          </div>
          <div>
            <strong>Prop Tax till End of Year:</strong>
            <p>${propertyDetails.propTaxTillEndOfYear}</p>
          </div>
          <div>
            <strong>Lender Loan Balance:</strong>
            <p>${propertyDetails.lenderLoanBalance}</p>
          </div>
          <div>
            <strong>Pay Off Statement:</strong>
            <p>${propertyDetails.payOffStatement}</p>
          </div>
          <div>
            <strong>Attorney Fees:</strong>
            <p>${propertyDetails.attorneyFees}</p>
          </div>
          <div>
            <strong>Misc Fees:</strong>
            <p>${propertyDetails.miscFees}</p>
          </div>
          <div>
            <strong>Utilities:</strong>
            <p>${propertyDetails.utilities}</p>
          </div>
          <div>
            <strong>Cash 2 Close from Purchase:</strong>
            <p>${propertyDetails.cash2closeFromPurchase}</p>
          </div>
          <div>
            <strong>Cash 2 Close from Refinance:</strong>
            <p>${propertyDetails.cash2closeFromRefinance}</p>
          </div>
          <div>
            <strong>Total Rehab Costs:</strong>
            <p>${propertyDetails.totalRehabCost}</p>
          </div>
          <div>
            <strong>Expected Remaining Rent End To Year:</strong>
            <p>${propertyDetails.expectedRemainingRentEndToYear}</p>
          </div>
          <div>
            <strong>Mortgage Paid:</strong>
            <p>${propertyDetails.mortgagePaid}</p>
          </div>
          <div>
            <strong>Total Expenses:</strong>
            <p>${propertyDetails.totalExpenses}</p>
          </div>
          <div>
            <strong>Total Construction Draws In:</strong>
            <p>${propertyDetails.totalConstructionDrawsReceived}</p>
          </div>
          <div>
            <strong>Project Net Profit If Sold:</strong>
            <p>${propertyDetails.projectNetProfitIfSold}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
