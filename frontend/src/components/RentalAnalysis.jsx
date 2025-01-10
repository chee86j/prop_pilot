/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { ChevronsUp, ChevronsDown } from "lucide-react";
import { formatFullCurrency } from "../utils/formatting";

const RentalAnalysis = ({ property }) => {
  const printableRef = useRef(null);

  // State to manage expanded sections
  const [expandedSections, setExpandedSections] = useState({
    financialDetails: false,
    rentalDetails: false,
    otherDetails: false,
    summary: false,
  });

  const handlePrint = () => {
    if (printableRef.current) {
      window.print();
    }
  };

  if (!property) {
    return <div>Loading...</div>;
  }

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleAllSections = () => {
    const allExpanded = Object.values(expandedSections).every((val) => val);
    setExpandedSections((prevSections) => {
      const newSections = {};
      for (const section in prevSections) {
        newSections[section] = !allExpanded;
      }
      return newSections;
    });
  };

  const renderDetails = (details, sectionTitle, sectionName) => (
    <div
      className="bg-gray-50 p-4 shadow-sm rounded-md my-2 cursor-pointer group"
      onClick={() => toggleSection(sectionName)}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-blue-700">{sectionTitle}</h3>
        <button className="focus:outline-none transition-transform duration-200 transform group-hover:scale-110">
          {expandedSections[sectionName] ? (
            <ChevronsUp size={20} className="text-blue-600" />
          ) : (
            <ChevronsDown size={20} className="text-blue-600" />
          )}
        </button>
      </div>
      {expandedSections[sectionName] && (
        <ul className="list-disc pl-5">
          {Object.entries(details).map(([key, value]) => (
            <li key={key} className="flex justify-between">
              <span>
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                :
              </span>
              <span>{formatFullCurrency(value)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const financialDetails = {
    "Purchase Price": property.purchaseCost,
    "ARV (After Repair Value)": property.arvSalePrice,
    "Repair Costs": property.largeRepairsCost,
    "Down Payment Percentage": `${property.downPaymentPercentage}%`,
    "Loan Interest Rate": `${property.loanInterestRate}%`,
    "PMI Percentage": `${property.pmiPercentage}%`,
    "Mortgage Term": `${property.mortgageYears} years`,
    "Lender Points": property.lenderPointsAmount,
    "Other Fees": property.otherFees,
  };

  const rentalDetails = {
    "Rent per Unit": property.rentAmount,
    "Number of Units": property.numUnits,
    "Vacancy Rate": `${property.vacancyRate}%`,
    "Average Tenant Stay": `${property.avgTenantStay} years`,
    "Other Monthly Income": property.otherMonthlyIncome,
  };

  const otherDetails = {
    "Utilities Cost": property.utilitiesCost,
    "Homeowners Insurance": property.homeownersInsurance,
    "Yearly Property Taxes": property.yearlyPropertyTaxes,
    "Mortgage Paid": property.mortgagePaid,
    "Management Fees": property.managementFees,
    "Maintenance Costs": property.maintenanceCosts,
    "Miscellaneous Fees": property.miscFees,
  };

  const summaryDetails = {
    "Cash Flow": property.cashFlow,
    "Cash ROI": `${property.cashRoi}%`,
    "Down Payment Outlay": property.downPaymentCashOutlay,
    "Net Operating Income": property.netOperatingIncome,
    "Rule of 2%": property.rule2Percent ? "Yes" : "No",
    "Rule of 50%": property.rule50Percent ? "Yes" : "No",
    "Finance Amount": property.financeAmount,
    "Cap Rate": `${property.purchaseCapRate}%`,
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-200 
          bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
          rounded-lg shadow hover:shadow-lg transform hover:scale-105 active:scale-95 no-print"
        >
          Print to PDF
        </button>
        <button
          onClick={toggleAllSections}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-200 
          bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
          rounded-lg shadow hover:shadow-lg transform hover:scale-105 active:scale-95"
        >
          {Object.values(expandedSections).every((val) => val) ? (
            <>
              <ChevronsUp size={18} className="transition-transform duration-200" />
              <span>Collapse All</span>
            </>
          ) : (
            <>
              <ChevronsDown size={18} className="transition-transform duration-200" />
              <span>Expand All</span>
            </>
          )}
        </button>
      </div>

      <div className="print-content" ref={printableRef}>
        {renderDetails(
          financialDetails,
          "Financial Details",
          "financialDetails"
        )}
        {renderDetails(rentalDetails, "Rental Details", "rentalDetails")}
        {renderDetails(otherDetails, "Operational Expenses", "otherDetails")}
        {renderDetails(summaryDetails, "Summary", "summary")}
      </div>
    </div>
  );
};

export default RentalAnalysis;
