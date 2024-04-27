/* eslint-disable react/prop-types */
import { useState } from "react";
import { ChevronsUp, ChevronsDown } from "lucide-react";

const RentalAnalysis = () => {
  const [expandedSections, setExpandedSections] = useState({
    costs: true,
    financing: true,
    revenueAssumptions: true,
    expensesPerMonth: true,
    computedValues: true,
    monthlyIncome: true,
    cashFlow: true,
    downPayment: true,
    rules: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderSectionTitle = (title, sectionName) => (
    <div
      className="flex justify-between items-center mb-2 cursor-pointer"
      onClick={() => toggleSection(sectionName)}
    >
      <h2 className="text-lg font-bold text-blue-700">{title}</h2>
      {expandedSections[sectionName] ? (
        <ChevronsUp size={24} className="text-gray-700" />
      ) : (
        <ChevronsDown size={24} className="text-gray-700" />
      )}
    </div>
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Rental Analysis
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="space-y-6">
          {/* COSTS */}
          <div className="border border-gray-300 rounded-lg p-4">
            {renderSectionTitle("COSTS", "costs")}
            {expandedSections.costs && (
              <>
                <div>
                  <strong>Purchase Price:</strong> $450,000
                </div>
                <div>
                  <strong>After repair value:</strong> $450,000
                </div>
                <div>
                  <strong>Purchase closing costs:</strong> $26,000
                </div>
                <div>
                  <strong>Repair cost:</strong> $0
                </div>
              </>
            )}
          </div>

          {/* FINANCING */}
          <div className="border border-gray-300 rounded-lg p-4">
            {renderSectionTitle("FINANCING", "financing")}
            {expandedSections.financing && (
              <>
                <div>
                  <strong>Down payment %:</strong> 15.00%
                </div>
                <div>
                  <strong>Loan interest rate %:</strong> 7.10%
                </div>
                <div>
                  <strong>PMI %:</strong> 0.00%
                </div>
                <div>
                  <strong>Mortgage (years):</strong> 30
                </div>
                <div>
                  <strong>Lender points amount:</strong> $0.00
                </div>
                <div>
                  <strong>Other fees:</strong> $0.00
                </div>
              </>
            )}
          </div>

          {/* REVENUE ASSUMPTIONS */}
          <div className="border border-gray-300 rounded-lg p-4">
            {renderSectionTitle("REVENUE ASSUMPTIONS", "revenueAssumptions")}
            {expandedSections.revenueAssumptions && (
              <>
                <div>
                  <strong>Rent per unit:</strong> $2,900
                </div>
                <div>
                  <strong>Num units:</strong> 1
                </div>
                <div>
                  <strong>Vacancy rate %:</strong> 10.00%
                </div>
                <div>
                  <strong>Avg Tenant stay (years):</strong> 2
                </div>
                <div>
                  <strong>Other monthly income:</strong> $0
                </div>
              </>
            )}
          </div>

          {/* EXPENSES PER MONTH */}
          <div className="border border-gray-300 rounded-lg p-4">
            {renderSectionTitle("EXPENSES PER MONTH", "expensesPerMonth")}
            {expandedSections.expensesPerMonth && (
              <>
                <div>
                  <strong>P&I (with PMI):</strong> $2,571
                </div>
                <div>
                  <strong>Property taxes:</strong> $308
                </div>
                <div>
                  <strong>Insurance:</strong> $95
                </div>
                <div>
                  <strong>Capital expenditure %:</strong> 0.00%
                </div>
                <div>
                  <strong>Property management %:</strong> 0%
                </div>
                <div>
                  <strong>Sewer:</strong> $20
                </div>
                <div>
                  <strong>Water:</strong> $20
                </div>
                <div>
                  <strong>Lawn:</strong> $0
                </div>
                <div>
                  <strong>Garbage:</strong> $80
                </div>
              </>
            )}
          </div>

          {/* COMPUTED VALUES */}
          <div className="border border-gray-300 rounded-lg p-4">
            {renderSectionTitle("COMPUTED VALUES", "computedValues")}
            {expandedSections.computedValues && (
              <>
                <div>
                  <strong>Land Value:</strong> $112,500
                </div>
                <div>
                  <strong>Building Value:</strong> $337,500
                </div>
              </>
            )}
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          {/* MONTHLY INCOME */}
          <div className="border border-gray-300 rounded-lg p-4">
            {renderSectionTitle("MONTHLY INCOME", "monthlyIncome")}
            {expandedSections.monthlyIncome && (
              <>
                <div>
                  <strong>MONTHLY INCOME:</strong> $2,900.00
                </div>
                <div>
                  <strong>MONTHLY EXPENSES:</strong> $3,504.36
                </div>
              </>
            )}
          </div>

          {/* CASH FLOW */}
          <div className="border border-gray-300 rounded-lg p-4">
            {renderSectionTitle("CASH FLOW", "cashFlow")}
            {expandedSections.cashFlow && (
              <>
                <div>
                  <strong>CASH FLOW:</strong>
                  <span className="text-red-500">-$604.36</span>
                </div>
                <div>
                  <strong>CASH ROI:</strong>
                  <span className="text-red-500">-7.76%</span>
                </div>
              </>
            )}
          </div>

          {/* DOWN PAYMENT CASH OUTLAY */}
          <div className="border border-gray-300 rounded-lg p-4">
            {renderSectionTitle("DOWN PAYMENT CASH OUTLAY", "downPayment")}
            {expandedSections.downPayment && (
              <>
                <div>
                  <strong>DOWN PAYMENT CASH OUTLAY:</strong> $93,500
                </div>
                <div>
                  <strong>NET OPERATING INCOME:</strong> $23,594
                </div>
              </>
            )}
          </div>

          {/* RULES */}
          <div className="border border-gray-300 rounded-lg p-4">
            {renderSectionTitle("RULES", "rules")}
            {expandedSections.rules && (
              <>
                <div>
                  <strong>The 2% Rule:</strong>
                  <span className="text-red-500">0.64%</span>
                </div>
                <div>
                  <strong>The 50% Rule:</strong>
                  <span className="text-green-500">0.00%</span>
                </div>
                <div>
                  <strong>Finance Amount:</strong> $382,500
                </div>
                <div>
                  <strong>Purchase CAP Rate:</strong> 7.73%
                </div>
              </>
            )}
          </div>

          {/* PRO FORMA CAP RATE */}
          <div className="border border-gray-300 rounded-lg p-4">
            {renderSectionTitle("PRO FORMA CAP RATE", "proFormaCapRate")}
            {expandedSections.proFormaCapRate && (
              <div>
                <strong>Pro Forma Cap Rate:</strong> 7.73%
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalAnalysis;
