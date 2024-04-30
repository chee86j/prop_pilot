/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { ChevronsUp, ChevronsDown } from "lucide-react";
import { formatFullCurrency } from "../../../util";

const RentalAnalysis = ({ propertyId }) => {
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    costs: true,
    financing: true,
    revenue: true,
    expenses: true,
    cashFlow: true,
    downPayment: true,
    rules: true,
  });

  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Rental Analysis Report",
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
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };
    fetchPropertyDetails();
  }, [propertyId]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!propertyDetails) {
    return <div>Loading...</div>;
  }

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
                  .replace(/^./, (str) => str.toUpperCase())}
              </span>
              <span>{formatFullCurrency(value)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // Define the different sections
  const costsDetails = {
    purchasePrice: propertyDetails.purchaseCost,
    afterRepairValue: propertyDetails.arvSalePrice,
    // purchaseClosingCosts: propertyDetails.refinanceCosts,
    repairCost: propertyDetails.largeRepairsCost,
  };

  const financingDetails = {
    downPaymentPercentage: propertyDetails.downPaymentPercentage,
    loanInterestRate: propertyDetails.loanInterestRate,
    pmiPercentage: propertyDetails.pmiPercentage,
    mortgageYears: propertyDetails.mortgageYears,
    lenderPointsAmount: propertyDetails.lenderPointsAmount,
    otherFees: propertyDetails.otherFees,
  };

  const revenueAssumptionsDetails = {
    rentPerUnit: propertyDetails.rentAmount,
    numUnits: propertyDetails.numUnits,
    vacancyRate: propertyDetails.vacancyRate,
    avgTenantStay: propertyDetails.avgTenantStay,
    otherMonthlyIncome: propertyDetails.otherMonthlyIncome,
  };

  const expensesDetails = {
    utilitiesCost: propertyDetails.utilitiesCost,
    homeownersInsurance: propertyDetails.homeownersInsurance,
    yearlyPropertyTaxes: propertyDetails.yearlyPropertyTaxes,
    mortgagePaid: propertyDetails.mortgagePaid,
    managementFees: propertyDetails.managementFees,
    maintenanceCosts: propertyDetails.maintenanceCosts,
    miscFees: propertyDetails.miscFees,
  };

  const cashFlowDetails = {
    cashFlow: propertyDetails.cashFlow,
    cashRoi: propertyDetails.cashRoi,
  };

  const downPaymentDetails = {
    downPaymentCashOutlay: propertyDetails.downPaymentCashOutlay,
    netOperatingIncome: propertyDetails.netOperatingIncome,
  };

  const rulesDetails = {
    rule2Percent: propertyDetails.rule2Percent,
    rule50Percent: propertyDetails.rule50Percent,
    financeAmount: propertyDetails.financeAmount,
    purchaseCapRate: propertyDetails.purchaseCapRate,
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <button
        onClick={handlePrint}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Print Rental Analysis Report
      </button>

      <div ref={printRef}>
        {renderDetails(costsDetails, "Costs", "costs")}
        {renderDetails(financingDetails, "Financing", "financing")}
        {renderDetails(
          revenueAssumptionsDetails,
          "Revenue Assumptions",
          "revenue"
        )}
        {renderDetails(expensesDetails, "Expenses", "expenses")}
        {renderDetails(cashFlowDetails, "Cash Flow", "cashFlow")}
        {renderDetails(downPaymentDetails, "Down Payment", "downPayment")}
        {renderDetails(rulesDetails, "Rules", "rules")}
      </div>
    </div>
  );
};

export default RentalAnalysis;
