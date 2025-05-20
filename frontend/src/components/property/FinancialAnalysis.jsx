import { Download, Printer } from "lucide-react";
import { exportToCSV } from "../../utils/property";
import { buttonStyles } from "./UIComponents";

// Import memoized components
import ProfitAndLoss from "../ProfitAndLoss";
import OperatingExpense from "../OperatingExpense";
import RentalIncome from "../RentalIncome";
import CapitalExpenditure from "../CapitalExpenditure";
import RentalAnalysis from "../RentalAnalysis";
import { memo } from "react";

// Memoized Components
const MemoizedProfitAndLoss = memo(ProfitAndLoss);
const MemoizedOperatingExpense = memo(OperatingExpense);
const MemoizedRentalIncome = memo(RentalIncome);
const MemoizedCapitalExpenditure = memo(CapitalExpenditure);
const MemoizedRentalAnalysis = memo(RentalAnalysis);

const FinancialAnalysis = ({ propertyDetails, onPrint }) => {
  return (
    <div className="print-full-width">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Financial Analysis
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={onPrint}
            className={buttonStyles.primary}
            aria-label="Print financial analysis"
          >
            <Printer size={16} className="sm:mr-2" />
            <span className="hidden sm:inline">
              Print Financial Analysis
            </span>
            <span className="sm:hidden">Print</span>
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Profit & Loss Statement
            </h3>
            <button
              onClick={() =>
                exportToCSV(propertyDetails.profitLossData, "profit-loss")
              }
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
          <MemoizedProfitAndLoss property={propertyDetails} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Operating Expenses
            </h3>
            <button
              onClick={() =>
                exportToCSV(
                  propertyDetails.operatingExpenseData,
                  "operating-expenses"
                )
              }
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
          <MemoizedOperatingExpense property={propertyDetails} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Rental Income
            </h3>
            <button
              onClick={() =>
                exportToCSV(
                  propertyDetails.rentalIncomeData,
                  "rental-income"
                )
              }
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
          <MemoizedRentalIncome property={propertyDetails} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Capital Expenditure
            </h3>
            <button
              onClick={() =>
                exportToCSV(
                  propertyDetails.capExData,
                  "capital-expenditure"
                )
              }
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
          <MemoizedCapitalExpenditure property={propertyDetails} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Rental Analysis
            </h3>
            <button
              onClick={() =>
                exportToCSV(
                  propertyDetails.rentalAnalysisData,
                  "rental-analysis"
                )
              }
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
          <MemoizedRentalAnalysis property={propertyDetails} />
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalysis; 