import { useState } from "react";
import { X, Info, DollarSign } from "lucide-react";
import PropTypes from "prop-types";

const InputField = ({ label, name, value, tooltip, onChange, onInfoClick }) => (
  <div className="relative mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {tooltip && (
        <button
          onClick={() => onInfoClick(name)}
          className="ml-1 text-gray-400 hover:text-gray-600"
        >
          <Info size={14} />
        </button>
      )}
    </label>
    <div className="relative">
      <DollarSign
        size={16}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      />
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className="pl-8 pr-4 py-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
        placeholder="0.00"
      />
    </div>
  </div>
);

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  tooltip: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onInfoClick: PropTypes.func.isRequired,
};

const DSCRCalculator = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    monthlyRent: "",
    propertyTaxes: "",
    insurance: "",
    maintenance: "",
    utilities: "",
    managementFees: "",
    monthlyMortgage: "",
    otherDebt: "",
  });

  const [activeSection, setActiveSection] = useState("income");
  const [dscrResult, setDscrResult] = useState(null);
  const [showInfo, setShowInfo] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value ? parseFloat(value) : "",
    }));
  };

  const calculateDSCR = () => {
    // Calculate Net Operating Income (NOI)
    const monthlyIncome = parseFloat(formData.monthlyRent) || 0;
    const annualIncome = monthlyIncome * 12;

    // Calculate Total Operating Expenses
    const annualExpenses =
      ((parseFloat(formData.propertyTaxes) || 0) +
        (parseFloat(formData.insurance) || 0) +
        (parseFloat(formData.maintenance) || 0) +
        (parseFloat(formData.utilities) || 0) +
        (parseFloat(formData.managementFees) || 0)) *
      12;

    const NOI = annualIncome - annualExpenses;

    // Calculate Total Debt Service
    const annualDebtService =
      ((parseFloat(formData.monthlyMortgage) || 0) +
        (parseFloat(formData.otherDebt) || 0)) *
      12;

    // Calculate DSCR
    const dscr = annualDebtService > 0 ? NOI / annualDebtService : 0;

    setDscrResult({
      dscr: dscr.toFixed(2),
      noi: NOI.toFixed(2),
      annualDebtService: annualDebtService.toFixed(2),
      monthlyNOI: (NOI / 12).toFixed(2),
      monthlyDebtService: (annualDebtService / 12).toFixed(2),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-md relative">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">DSCR Calculator</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Calculate your Debt Service Coverage Ratio to evaluate investment
            property potential
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 text-sm font-medium ${
              activeSection === "income"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveSection("income")}
          >
            Income
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium ${
              activeSection === "expenses"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveSection("expenses")}
          >
            Expenses & Debt
          </button>
        </div>

        <div className="p-4">
          {activeSection === "income" ? (
            <div>
              <InputField
                label="Monthly Rental Income"
                name="monthlyRent"
                value={formData.monthlyRent}
                tooltip="Total monthly rental income from all units in the property"
                onChange={handleInputChange}
                onInfoClick={setShowInfo}
              />
              {showInfo === "monthlyRent" && (
                <div className="mt-1 p-2 bg-gray-800 text-white text-sm rounded-md">
                  Total monthly rental income from all units in the property
                  <button
                    onClick={() => setShowInfo(null)}
                    className="absolute top-1 right-1 text-white"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <InputField
                label="Monthly Property Taxes"
                name="propertyTaxes"
                value={formData.propertyTaxes}
                tooltip="Monthly property tax payment"
                onChange={handleInputChange}
                onInfoClick={setShowInfo}
              />
              <InputField
                label="Monthly Insurance"
                name="insurance"
                value={formData.insurance}
                tooltip="Property insurance premium divided by 12"
                onChange={handleInputChange}
                onInfoClick={setShowInfo}
              />
              <InputField
                label="Monthly Maintenance"
                name="maintenance"
                value={formData.maintenance}
                tooltip="Average monthly maintenance costs (1% of property value / 12 is a common estimate)"
                onChange={handleInputChange}
                onInfoClick={setShowInfo}
              />
              <InputField
                label="Monthly Utilities"
                name="utilities"
                value={formData.utilities}
                tooltip="Monthly utilities if paid by owner"
                onChange={handleInputChange}
                onInfoClick={setShowInfo}
              />
              <InputField
                label="Monthly Management Fees"
                name="managementFees"
                value={formData.managementFees}
                tooltip="Property management fees (typically 8-12% of monthly rent)"
                onChange={handleInputChange}
                onInfoClick={setShowInfo}
              />
              <InputField
                label="Monthly Mortgage Payment"
                name="monthlyMortgage"
                value={formData.monthlyMortgage}
                tooltip="Principal and interest payment"
                onChange={handleInputChange}
                onInfoClick={setShowInfo}
              />
              <InputField
                label="Other Monthly Debt"
                name="otherDebt"
                value={formData.otherDebt}
                tooltip="Any other debt payments associated with the property"
                onChange={handleInputChange}
                onInfoClick={setShowInfo}
              />
            </div>
          )}

          <button
            onClick={calculateDSCR}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-4 font-medium"
          >
            Calculate DSCR
          </button>

          {dscrResult && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-3">Results</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">DSCR:</span>
                  <span
                    className={`font-bold text-lg ${
                      parseFloat(dscrResult.dscr) >= 1.25
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {dscrResult.dscr}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monthly NOI:</span>
                  <span className="font-medium">${dscrResult.monthlyNOI}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monthly Debt Service:</span>
                  <span className="font-medium">
                    ${dscrResult.monthlyDebtService}
                  </span>
                </div>
                {parseFloat(dscrResult.dscr) < 1.25 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-700">
                      Warning: DSCR is below 1.25. Most lenders require a
                      minimum DSCR of 1.25 for investment properties.
                    </p>
                  </div>
                )}
                {parseFloat(dscrResult.dscr) >= 1.25 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700">
                      Great! Your DSCR is above 1.25, which meets most lenders'
                      requirements.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Educational Note */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-800 mb-2">
              Understanding DSCR
            </h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• DSCR = Net Operating Income / Debt Service</li>
              <li>
                • Higher DSCR indicates better ability to cover debt payments
              </li>
              <li>• Most lenders require minimum 1.25 DSCR</li>
              <li>• A 1.5 DSCR or higher is considered very strong</li>
              <li>• Monthly calculations are annualized for the ratio</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

DSCRCalculator.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DSCRCalculator;
