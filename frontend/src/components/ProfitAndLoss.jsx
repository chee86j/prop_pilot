/* eslint-disable react/prop-types */
import { useState } from "react";
import { formatFullCurrency } from "../../../util";
import { ChevronsUp, ChevronsDown } from "lucide-react";

const ProfitAndLoss = ({ property }) => {
  // State to manage expanded sections
  const [expandedSections, setExpandedSections] = useState({
    rentalStrategy: false,
    saleStrategy: false,
    combinedStrategy: false,
  });

  if (!property) {
    return <div>Loading...</div>;
  }

  // Toggle function for expanding/collapsing sections
  const toggleSection = (section) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

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

    // Detailed rental income calculations
    const rentalIncomeDetails = {
      expectedYearlyRent: property.expectedYearlyRent,
      rentalIncomeReceived: property.rentalIncomeReceived,
    };

    // Detailed sale income calculations
    const saleIncomeDetails = {
      arvSalePrice: property.arvSalePrice,
    };

    // Detailed Combined income calculations
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
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-blue-700">{title}</h3>
        {expandedSections[sectionKey] ? (
          <ChevronsUp size={24} className="text-gray-700" />
        ) : (
          <ChevronsDown size={24} className="text-gray-700" />
        )}
      </div>
      {expandedSections[sectionKey] && (
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

  return (
    <div className="bg-white shadow-md rounded-lg p-4 max-w-4xl mx-auto flex flex-col md:flex-row justify-between space-y-4 md:space-x-4 md:space-y-0">
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
            Net Profit from Rentals: {formatFullCurrency(netProfitFromRentals)}
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
  );
};

export default ProfitAndLoss;
