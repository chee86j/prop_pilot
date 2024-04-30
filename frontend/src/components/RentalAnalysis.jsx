/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { ChevronsUp, ChevronsDown } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { formatFullCurrency } from "../../../util";

const RentalAnalysis = ({ property }) => {
  const printRef = useRef(null);

  // State to manage expanded sections
  const [expandedSections, setExpandedSections] = useState({
    financialDetails: false,
    rentalDetails: false,
    otherDetails: false,
  });

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Rental Analysis Report",
  });

  if (!property) {
    return <div>Loading...</div>;
  }

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderDetails = (details, sectionTitle, sectionName) => (
    <div
      className="bg-gray-50 p-4 shadow-sm rounded-md my-2 cursor-pointer"
      onClick={() => toggleSection(sectionName)}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-blue-700">{sectionTitle}</h3>
        {expandedSections[sectionName] ? (
          <ChevronsUp size={24} className="text-gray-700" />
        ) : (
          <ChevronsDown size={24} className="text-gray-700" />
        )}
      </div>
      {expandedSections[sectionName] && (
        <ul className="list-disc pl-5">
          {Object.entries(details).map(([key, value]) => (
            <li key={key} className="flex justify-between">
              <span>
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())
                  .replace("Pmi", "PMI")
                  .replace("Arv", "ARV")}
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
    purchasePrice: property.purchaseCost,
    afterRepairValue: property.arvSalePrice,
    repairCost: property.largeRepairsCost,
    downPaymentPercentage: property.downPaymentPercentage,
    loanInterestRate: property.loanInterestRate,
    pmiPercentage: property.pmiPercentage,
    mortgageYears: property.mortgageYears,
    lenderPointsAmount: property.lenderPointsAmount,
    otherFees: property.otherFees,
  };

  const rentalDetails = {
    rentPerUnit: property.rentAmount,
    numUnits: property.numUnits,
    vacancyRate: property.vacancyRate,
    avgTenantStay: property.avgTenantStay,
    otherMonthlyIncome: property.otherMonthlyIncome,
  };

  const otherDetails = {
    utilitiesCost: property.utilitiesCost,
    homeownersInsurance: property.homeownersInsurance,
    yearlyPropertyTaxes: property.yearlyPropertyTaxes,
    mortgagePaid: property.mortgagePaid,
    managementFees: property.managementFees,
    maintenanceCosts: property.maintenanceCosts,
    miscFees: property.miscFees,
    cashFlow: property.cashFlow,
    cashRoi: property.cashRoi,
    downPaymentCashOutlay: property.downPaymentCashOutlay,
    netOperatingIncome: property.netOperatingIncome,
    rule2Percent: property.rule2Percent,
    rule50Percent: property.rule50Percent,
    financeAmount: property.financeAmount,
    purchaseCapRate: property.purchaseCapRate,
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 max-w-4xl mx-auto">
      <button
        onClick={handlePrint}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Print Rental Analysis Report
      </button>

      <div ref={printRef}>
        {renderDetails(
          financialDetails,
          "Financial Details",
          "financialDetails"
        )}
        {renderDetails(rentalDetails, "Rental Details", "rentalDetails")}
        {renderDetails(otherDetails, "Other Details", "otherDetails")}
      </div>
    </div>
  );
};

export default RentalAnalysis;
