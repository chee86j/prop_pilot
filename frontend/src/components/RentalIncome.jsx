/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { ChevronsUp, ChevronsDown } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { formatFullCurrency } from "../utils/formatting";

const RentalIncome = ({ property }) => {
  // Reference for printing
  const printRef = useRef(null);

  // State to manage expanded sections
  const [expandedSections, setExpandedSections] = useState({
    rentalIncome: false,
  });

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Rental Income Report",
  });

  // Toggle function for expanding/collapsing sections
  const toggleSection = () => {
    setExpandedSections((prevState) => ({
      rentalIncome: !prevState.rentalIncome,
    }));
  };

  if (!property) {
    return <div>Loading...</div>;
  }

  // Create rental income details from the property data
  const rentalIncomeDetails = {
    expectedYearlyRent: property.expectedYearlyRent,
    rentalIncomeReceived: property.rentalIncomeReceived,
    vacancyLoss: property.vacancyLoss,
  };

  // Calculate total rental income
  const totalRentalIncome = Object.values(rentalIncomeDetails).reduce(
    (sum, value) => sum + (value || 0),
    0
  );

  const renderDetails = () => (
    <div
      className="bg-gray-50 p-4 shadow-sm rounded-md my-2 cursor-pointer"
      onClick={toggleSection}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-blue-700">
          Rental Income Details
        </h3>
        {expandedSections.rentalIncome ? (
          <ChevronsUp size={24} className="text-gray-700" />
        ) : (
          <ChevronsDown size={24} className="text-gray-700" />
        )}
      </div>
      {expandedSections.rentalIncome && (
        <ul className="list-disc pl-5">
          {Object.entries(rentalIncomeDetails).map(([key, value]) => (
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
    <div className="bg-white shadow-md rounded-lg p-4 max-w-4xl mx-auto">
      <button
        onClick={handlePrint}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Print to PDF
      </button>

      <div ref={printRef}>
        {renderDetails()}
        <div className="text-right text-green-600">
          Total Rental Income: {formatFullCurrency(totalRentalIncome)}
        </div>
      </div>
    </div>
  );
};

export default RentalIncome;
