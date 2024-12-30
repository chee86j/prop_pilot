/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { ChevronsUp, ChevronsDown } from "lucide-react";
import { formatFullCurrency } from "../utils/formatting";

const CapitalExpenditure = ({ property }) => {
  // Reference for printing
  const printRef = useRef(null);

  // State to manage expanded sections
  const [expandedSections, setExpandedSections] = useState({
    capitalExpenditure: false,
  });

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Capital Expenditure Report",
  });

  // Toggle function for expanding/collapsing sections
  const toggleSection = () => {
    setExpandedSections((prev) => ({
      capitalExpenditure: !prev.capitalExpenditure,
    }));
  };

  if (!property) {
    return <div>Loading...</div>;
  }

  // Create capital expenditure details from the property data
  const capexDetails = {
    totalRehabCost: property.totalRehabCost,
    equipmentCost: property.equipmentCost,
    constructionCost: property.constructionCost,
    largeRepairCost: property.largeRepairCost,
    renovationCost: property.renovationCost,
  };

  // Calculate total capital expenditure
  const totalCapex = Object.values(capexDetails).reduce(
    (sum, value) => sum + (value || 0),
    0
  );

  const renderDetails = (details, sectionTitle) => (
    <div
      className="bg-gray-50 p-4 shadow-sm rounded-md my-2 cursor-pointer"
      onClick={toggleSection}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-blue-700">{sectionTitle}</h3>
        {expandedSections.capitalExpenditure ? (
          <ChevronsUp size={24} className="text-gray-700" />
        ) : (
          <ChevronsDown size={24} className="text-gray-700" />
        )}
      </div>
      {expandedSections.capitalExpenditure && (
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
    <div className="bg-white shadow-md rounded-lg p-4 max-w-4xl mx-auto">
      <button
        onClick={handlePrint}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Print to PDF
      </button>

      <div ref={printRef}>
        {renderDetails(capexDetails, "Capital Expenditure Details")}
        <div className="text-right text-green-600">
          Total Capital Expenditure: {formatFullCurrency(totalCapex)}
        </div>
      </div>
    </div>
  );
};

export default CapitalExpenditure;
