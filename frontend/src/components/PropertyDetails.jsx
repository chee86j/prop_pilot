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
      } catch (err) {
        console.error("Error fetching property details:", err);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  if (!propertyDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Property Details</h2>
      <p>Property Name: {propertyDetails.propertyName}</p>
      <p>Address: {propertyDetails.address}</p>
      <p>City: {propertyDetails.city}</p>
      <p>State: {propertyDetails.state}</p>
      <p>Zip Code: {propertyDetails.zipCode}</p>
      <p>County: {propertyDetails.county}</p>
      <p>
        Municipal Building Address: {propertyDetails.municipalBuildingAddress}
      </p>
      <p>
        Building Department Contact: {propertyDetails.buildingDepartmentContact}
      </p>
      <p>
        Electric Department Contact: {propertyDetails.electricDepartmentContact}
      </p>
      <p>
        Plumbing Department Contact: {propertyDetails.plumbingDepartmentContact}
      </p>
      <p>Fire Department Contact: {propertyDetails.fireDepartmentContact}</p>
      <p>
        Environmental Department Contact:{" "}
        {propertyDetails.environmentalDepartmentContact}
      </p>
      <p>Purchase Cost: {propertyDetails.purchaseCost}</p>
      <p>Refinance Costs: {propertyDetails.refinanceCosts}</p>
      <p>Total Rehab Cost: {propertyDetails.totalRehabCost}</p>
      <p>Kick Start Funds: {propertyDetails.kickStartFunds}</p>
      <p>
        Lender Construction Draws Received:{" "}
        {propertyDetails.lenderConstructionDrawsReceived}
      </p>
      <p>Utilities Cost: {propertyDetails.utilitiesCost}</p>
      <p>Yearly Property Taxes: {propertyDetails.yearlyPropertyTaxes}</p>
      <p>Mortgage Paid: {propertyDetails.mortgagePaid}</p>
      <p>Homeowners Insurance: {propertyDetails.homeownersInsurance}</p>
      <p>Expected Yearly Rent: {propertyDetails.expectedYearlyRent}</p>
      <p>Rental Income Received: {propertyDetails.rentalIncomeReceived}</p>
      <p>Vacancy Loss: {propertyDetails.vacancyLoss}</p>
      <p>Management Fees: {propertyDetails.managementFees}</p>
      <p>Maintenance Costs: {propertyDetails.maintenanceCosts}</p>
      <p>Total Equity: {propertyDetails.totalEquity}</p>
      <p>ARV Sale Price: {propertyDetails.arvSalePrice}</p>
      <p>Realtor Fees: {propertyDetails.realtorFees}</p>
      <p>Prop Tax till End of Year: {propertyDetails.propTaxtillEndOfYear}</p>
      <p>Lender Loan Balance: {propertyDetails.lenderLoanBalance}</p>
      <p>Pay Off Statement: {propertyDetails.payOffStatement}</p>
      <p>Attorney Fees: {propertyDetails.attorneyFees}</p>
      <p>Misc Fees: {propertyDetails.miscFees}</p>
      <p>Utilities: {propertyDetails.utilities}</p>
      <p>
        Cash to Close From Purchase: {propertyDetails.cash2closeFromPurchase}
      </p>
      <p>
        Cash to Close From Refinance: {propertyDetails.cash2closeFromRefinance}
      </p>
      <p>Total Rehab Costs: {propertyDetails.totalRehabCosts}</p>
      <p>
        Expected Remaining Rent End to Year:{" "}
        {propertyDetails.expectedRemainingRentEndToYear}
      </p>
      <p>Total Expenses: {propertyDetails.totalExpenses}</p>
      <p>
        Total Construction Draws Received:{" "}
        {propertyDetails.totalConstructionDrawsReceived}
      </p>
      <p>
        Project Net Profit If Sold: {propertyDetails.projectNetProfitIfSold}
      </p>
    </div>
  );
};

export default PropertyDetails;
