/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { formatFullCurrency } from "../../../util";
import { ChevronsUp, ChevronsDown } from "lucide-react";
import { useReactToPrint } from "react-to-print";

const keyDisplayMapping = {
  arvSalePrice: "ARV Sale Price",
};

const ProfitAndLoss = ({ property }) => {
  // Reference for printing
  const printRef = useRef(null);

  // State to manage expanded sections
  const [expandedSections, setExpandedSections] = useState({
    rentalStrategy: false,
    saleStrategy: false,
    combinedStrategy: false,
  });

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Profit and Loss Statement",
    onAfterPrint: () => console.log("Printed successfully!"),
  });

  if (!property) {
    return <div>Error: Property data not found</div>;
  }

  // Toggle function for expanding/collapsing sections
  const toggleSection = (section) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const formatKey = (key) =>
    keyDisplayMapping[key] ||
    key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  const calculateDetails = () => {
    // Detailed expense calculations
    const expensesDetails = {
      purchaseCost: property.purchaseCost,
      refinanceCosts: property.refinanceCosts,
      totalRenovationCosts: property.totalRehabCosts,
      monthlyUtilitiesCost: property.utilitiesCost,
      yearlyPropertyTaxes: property.yearlyPropertyTaxes,
      mortgagePaid: property.mortgagePaid,
      homeownersInsurance: property.homeownersInsurance,
      yearlyManagementFees: property.managementFees,
      monthlyMaintenanceCosts: property.maintenanceCosts,
      miscFees: property.miscFees,
    };

    // Detailed income calculations
    const rentalIncomeDetails = {
      expectedYearlyRent: property.expectedYearlyRent,
      rentalIncomeReceived: property.rentalIncomeReceived,
    };

    // Detailed sale income calculations
    const saleIncomeDetails = {
      arvSalePrice: property.arvSalePrice,
    };

    // Detailed Combined Income Calculations
    const combinedIncomeDetails = {
      ...rentalIncomeDetails,
      ...saleIncomeDetails,
    };

    const totalExpenses = Object.values(expensesDetails).reduce(
      (sum, value) => sum + (value || 0),
      0
    );

    const totalRentalIncome = Object.values(rentalIncomeDetails).reduce(
      (sum, value) => sum + (value || 0),
      0
    );

    const totalSaleIncome = Object.values(saleIncomeDetails).reduce(
      (sum, value) => sum + (value || 0),
      0
    );

    const totalIncome = totalRentalIncome + totalSaleIncome;

    const netProfitFromRentals = totalRentalIncome - totalExpenses;
    const netProfitFromSale = totalSaleIncome - totalExpenses;
    const combinedNetProfit = totalIncome - totalExpenses;

    return {
      totalExpenses,
      totalRentalIncome,
      totalSaleIncome,
      totalIncome,
      netProfitFromRentals,
      netProfitFromSale,
      combinedNetProfit,
      expensesDetails,
      rentalIncomeDetails,
      saleIncomeDetails,
      combinedIncomeDetails,
    };
  };

  const {
    totalExpenses,
    totalIncome,
    totalRentalIncome,
    totalSaleIncome,
    netProfitFromRentals,
    netProfitFromSale,
    combinedNetProfit,
    expensesDetails,
    rentalIncomeDetails,
    saleIncomeDetails,
    combinedIncomeDetails,
  } = calculateDetails();

  const renderDetails = (details, title, sectionKey) => (
    <div
      className="bg-gray-50 p-4 shadow-sm rounded-md my-2 cursor-pointer"
      onClick={() => toggleSection(sectionKey)}
      aria-expanded={expandedSections[sectionKey]}
    >
      {/* Aria Expanded is to help screen readers understand if the section is expanded or collapsed */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-blue-700">{title}</h3>
        {expandedSections[sectionKey] ? (
          <ChevronsUp
            size={24}
            className="text-gray-700"
            aria-label="Collapse section"
          />
        ) : (
          <ChevronsDown
            size={24}
            className="text-gray-700"
            aria-label="Expand section"
          />
        )}
      </div>
      {expandedSections[sectionKey] && (
        <ul className="list-disc pl-5">
          {Object.entries(details).map(([key, value]) => (
            <li key={key} className="flex justify-between">
              <span>{formatKey(key)}:</span>
              <span>{formatFullCurrency(value)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-4 max-w-4xl mx-auto">
      <button
        onClick={handlePrint}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Print to PDF
      </button>

      <div
        ref={printRef}
        className="flex flex-col md:flex-row justify-between space-y-4 md:space-x-4 md:space-y-0"
      >
        {/* Rental Strategy */}
        <div className="flex-1">
          {renderDetails(expensesDetails, "Rental Strategy", "rentalStrategy")}
          {renderDetails(
            rentalIncomeDetails,
            "Rental Income Details",
            "rentalStrategy"
          )}
          {expandedSections.rentalStrategy && (
            <div className="text-right text-green-600">
              Total Expenses: {formatFullCurrency(totalExpenses)}
              <br />
              Total Rental Income: {formatFullCurrency(totalRentalIncome)}
              <br />
              Net Profit from Rentals:{" "}
              {formatFullCurrency(netProfitFromRentals)}
            </div>
          )}
        </div>
        {/* Sale Strategy */}
        <div className="flex-1">
          {renderDetails(expensesDetails, "Sale Strategy", "saleStrategy")}
          {renderDetails(
            saleIncomeDetails,
            "Sale Income Details",
            "saleStrategy"
          )}
          {expandedSections.saleStrategy && (
            <div className="text-right text-green-600">
              Total Sale Income: {formatFullCurrency(totalSaleIncome)}
              <br />
              Net Profit from Sale: {formatFullCurrency(netProfitFromSale)}
            </div>
          )}
        </div>
        {/* Combined Strategy */}
        <div className="flex-1">
          {renderDetails(
            expensesDetails,
            "Combined Strategy",
            "combinedStrategy"
          )}
          {renderDetails(
            combinedIncomeDetails,
            "Combined Income Details",
            "combinedStrategy"
          )}
          {expandedSections.combinedStrategy && (
            <div className="text-right text-green-600">
              Total Combined Income: {formatFullCurrency(totalIncome)}
              <br />
              Net Profit Combined: {formatFullCurrency(combinedNetProfit)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfitAndLoss;
