import { useState, useEffect, useCallback } from "react";
import { X, Info, DollarSign, Home } from "lucide-react";
import PropTypes from "prop-types";

// Constants for rehab costs (average cost per square foot)
// Updated pricing based on Q1 2025 data from This Old House: https://www.thisoldhouse.com/home-finances/reviews/home-renovation-cost
// Additional sources: https://www.jchs.harvard.edu/press-releases/modest-gains-2025-outlook-home-remodeling
// https://www.jchs.harvard.edu/research-areas/remodeling/lira
// These represent mid-range (modest) quality finishes. Budget options may cost 20-30% less, while luxury finishes may cost 30-50% more.
const REHAB_COSTS = {
  roof: {
    contractor: 10.5,
    diy: 6.75,
    unit: "sq ft",
    name: "Roof Replacement",
  },
  plumbing: {
    contractor: 12.0,
    diy: 0,
    unit: "sq ft",
    name: "Plumbing System",
  },
  electrical: {
    contractor: 8.0,
    diy: 0,
    unit: "sq ft",
    name: "Electrical System",
  },
  hvac: { contractor: 15.0, diy: 0, unit: "sq ft", name: "HVAC System" },
  windows: { contractor: 75.0, diy: 40.0, unit: "per window", name: "Windows" },
  paint: { contractor: 4.75, diy: 2.0, unit: "sq ft", name: "Interior Paint" },
  flooring: { contractor: 12.0, diy: 5.5, unit: "sq ft", name: "Flooring" },
  kitchen: {
    contractor: 125.0,
    diy: 65.0,
    unit: "sq ft",
    name: "Kitchen Remodel",
  },
  bathroom: {
    contractor: 450.0,
    diy: 180.0,
    unit: "sq ft",
    name: "Bathroom Remodel",
  },
  siding: {
    contractor: 12.0,
    diy: 6.0,
    unit: "sq ft",
    name: "Exterior Siding",
  },
  foundation: {
    contractor: 18.0,
    diy: 0,
    unit: "sq ft",
    name: "Foundation Repair",
  },
  landscaping: {
    contractor: 8.0,
    diy: 3.0,
    unit: "sq ft",
    name: "Landscaping",
  },
};

// Input field component (reused from other calculator components)
const InputField = ({
  label,
  name,
  value,
  type = "number",
  icon = DollarSign,
  tooltip,
  onChange,
  onInfoClick,
  min,
  max,
  step,
  placeholder,
  disabled = false,
}) => {
  const Icon = icon;

  return (
    <div className="relative mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {tooltip && (
          <button
            onClick={() => onInfoClick(name)}
            className="ml-1 text-gray-400 hover:text-gray-600"
            aria-label={`More information about ${label}`}
          >
            <Info size={14} />
          </button>
        )}
      </label>
      <div className="relative">
        <Icon
          size={16}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          type={type}
          name={name}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
          disabled={disabled}
          className={`pl-8 pr-4 py-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg ${
            disabled ? "bg-gray-100" : ""
          }`}
          placeholder={placeholder || "0.00"}
        />
      </div>
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.string,
  icon: PropTypes.elementType,
  tooltip: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onInfoClick: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

// Toggle Switch component for DIY/Contractor selection
const ToggleSwitch = ({ isToggled, onToggle, label }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isToggled}
          onChange={onToggle}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        <span className="ml-3 text-sm font-medium text-gray-500">
          {isToggled ? "Contractor" : "DIY"}
        </span>
      </label>
    </div>
  );
};

ToggleSwitch.propTypes = {
  isToggled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

// Component selection checkbox
const ComponentCheckbox = ({ id, name, checked, onChange }) => {
  return (
    <div className="mb-3">
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          id={id}
          className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          checked={checked}
          onChange={onChange}
        />
        <span className="ml-2 text-gray-700">{name}</span>
      </label>
    </div>
  );
};

ComponentCheckbox.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

const RehabEstimator = ({ isOpen, onClose, isExternalWindow = false }) => {
  // State for property details
  const [propertySize, setPropertySize] = useState(1500);
  const [windowCount, setWindowCount] = useState(10);
  const [kitchenSize, setKitchenSize] = useState(150);
  const [bathroomCount, setBathroomCount] = useState(2);
  const [bathroomSize, setBathroomSize] = useState(50);

  // State for component selection
  const [selectedComponents, setSelectedComponents] = useState({
    roof: false,
    plumbing: false,
    electrical: false,
    hvac: false,
    windows: false,
    paint: false,
    flooring: false,
    kitchen: false,
    bathroom: false,
    siding: false,
    foundation: false,
    landscaping: false,
  });

  // State for DIY vs Contractor
  const [isContractor, setIsContractor] = useState(true);

  // State for active tab
  const [activeTab, setActiveTab] = useState("components"); // 'components', 'summary'

  // State for info tooltips
  const [showInfo, setShowInfo] = useState(null);

  // State for rehab results
  const [rehabResults, setRehabResults] = useState({
    totalCost: 0,
    breakdown: [],
  });

  // Calculate total rehab costs
  const calculateRehabCosts = useCallback(() => {
    let totalCost = 0;
    let breakdown = [];

    // Calculate costs for each selected component
    Object.keys(selectedComponents).forEach((component) => {
      if (!selectedComponents[component]) return;

      const costType = isContractor ? "contractor" : "diy";
      let cost = 0;
      let quantity = 0;

      switch (component) {
        case "windows":
          quantity = windowCount;
          cost = REHAB_COSTS[component][costType] * quantity;
          break;
        case "kitchen":
          quantity = kitchenSize;
          cost = REHAB_COSTS[component][costType] * quantity;
          break;
        case "bathroom":
          quantity = bathroomSize * bathroomCount;
          cost = REHAB_COSTS[component][costType] * quantity;
          break;
        default:
          quantity = propertySize;
          cost = REHAB_COSTS[component][costType] * quantity;
      }

      if (cost > 0) {
        totalCost += cost;
        breakdown.push({
          component,
          name: REHAB_COSTS[component].name,
          quantity,
          unit: REHAB_COSTS[component].unit,
          rate: REHAB_COSTS[component][costType],
          cost,
        });
      }
    });

    setRehabResults({ totalCost, breakdown });
  }, [
    selectedComponents,
    isContractor,
    propertySize,
    windowCount,
    kitchenSize,
    bathroomCount,
    bathroomSize,
  ]);

  // Update calculations when inputs change
  useEffect(() => {
    calculateRehabCosts();
  }, [calculateRehabCosts]);

  // Handle component selection
  const handleComponentSelect = (e) => {
    const { id, checked } = e.target;
    setSelectedComponents({
      ...selectedComponents,
      [id]: checked,
    });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === "" ? "" : parseFloat(value);

    switch (name) {
      case "propertySize":
        setPropertySize(numValue);
        break;
      case "windowCount":
        setWindowCount(numValue);
        break;
      case "kitchenSize":
        setKitchenSize(numValue);
        break;
      case "bathroomCount":
        setBathroomCount(numValue);
        break;
      case "bathroomSize":
        setBathroomSize(numValue);
        break;
      default:
        break;
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Render the property details inputs
  const renderPropertyDetails = () => {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Property Details
        </h3>

        <InputField
          label="Property Size (sq ft)"
          name="propertySize"
          value={propertySize}
          tooltip="The total square footage of the property"
          onChange={handleInputChange}
          onInfoClick={setShowInfo}
          min={100}
          step={50}
          placeholder="1500"
          icon={Home}
        />
        {showInfo === "propertySize" && (
          <div className="mt-1 p-2 bg-gray-800 text-white text-sm rounded-md">
            The total square footage of the property. Used for calculating costs
            for most components.
            <button
              onClick={() => setShowInfo(null)}
              className="absolute top-1 right-1 text-white"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <InputField
          label="Window Count"
          name="windowCount"
          value={windowCount}
          tooltip="Number of windows to replace"
          onChange={handleInputChange}
          onInfoClick={setShowInfo}
          min={0}
          step={1}
          placeholder="10"
          disabled={!selectedComponents.windows}
        />
        {showInfo === "windowCount" && (
          <div className="mt-1 p-2 bg-gray-800 text-white text-sm rounded-md">
            The total number of windows that need replacement
            <button
              onClick={() => setShowInfo(null)}
              className="absolute top-1 right-1 text-white"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <InputField
          label="Kitchen Size (sq ft)"
          name="kitchenSize"
          value={kitchenSize}
          tooltip="Square footage of the kitchen"
          onChange={handleInputChange}
          onInfoClick={setShowInfo}
          min={0}
          step={10}
          placeholder="150"
          disabled={!selectedComponents.kitchen}
        />
        {showInfo === "kitchenSize" && (
          <div className="mt-1 p-2 bg-gray-800 text-white text-sm rounded-md">
            The square footage of the kitchen area for remodel calculations
            <button
              onClick={() => setShowInfo(null)}
              className="absolute top-1 right-1 text-white"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Bathroom Count"
            name="bathroomCount"
            value={bathroomCount}
            tooltip="Number of bathrooms"
            onChange={handleInputChange}
            onInfoClick={setShowInfo}
            min={0}
            step={1}
            placeholder="2"
            disabled={!selectedComponents.bathroom}
          />

          <InputField
            label="Bathroom Size (sq ft each)"
            name="bathroomSize"
            value={bathroomSize}
            tooltip="Average square footage per bathroom"
            onChange={handleInputChange}
            onInfoClick={setShowInfo}
            min={0}
            step={5}
            placeholder="50"
            disabled={!selectedComponents.bathroom}
          />
        </div>
        {showInfo === "bathroomCount" && (
          <div className="mt-1 p-2 bg-gray-800 text-white text-sm rounded-md">
            The number of bathrooms to remodel
            <button
              onClick={() => setShowInfo(null)}
              className="absolute top-1 right-1 text-white"
            >
              <X size={12} />
            </button>
          </div>
        )}
        {showInfo === "bathroomSize" && (
          <div className="mt-1 p-2 bg-gray-800 text-white text-sm rounded-md">
            The average square footage per bathroom
            <button
              onClick={() => setShowInfo(null)}
              className="absolute top-1 right-1 text-white"
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render the component selection
  const renderComponentSelection = () => {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Select Components to Rehab
        </h3>

        <ToggleSwitch
          isToggled={isContractor}
          onToggle={() => setIsContractor(!isContractor)}
          label="Labor Type"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          {Object.keys(REHAB_COSTS).map((component) => (
            <ComponentCheckbox
              key={component}
              id={component}
              name={REHAB_COSTS[component].name}
              checked={selectedComponents[component]}
              onChange={handleComponentSelect}
            />
          ))}
        </div>
      </div>
    );
  };

  // Render the cost summary
  const renderCostSummary = () => {
    // Calculate budget and luxury ranges
    const budgetCost = Math.round(rehabResults.totalCost * 0.75); // 25% less for budget
    const luxuryCost = Math.round(rehabResults.totalCost * 1.4); // 40% more for luxury

    return (
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Rehab Cost Summary
        </h3>

        <div className="bg-blue-50 rounded-lg p-5 mb-6 border border-blue-100">
          <div className="text-center">
            <div className="text-sm text-blue-600 mb-1">
              Estimated Total Cost (Modest Quality)
            </div>
            <div className="text-4xl font-bold text-blue-800">
              {formatCurrency(rehabResults.totalCost)}
            </div>
            <div className="text-xs text-blue-600 mt-2">
              Based on {isContractor ? "Contractor" : "DIY"} pricing
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div className="bg-blue-100 p-2 rounded">
                <div className="text-blue-700">Budget Quality</div>
                <div className="font-semibold">
                  {formatCurrency(budgetCost)}
                </div>
              </div>
              <div className="bg-blue-100 p-2 rounded">
                <div className="text-blue-700">Luxury Quality</div>
                <div className="font-semibold">
                  {formatCurrency(luxuryCost)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {rehabResults.breakdown.length > 0 ? (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Component
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Rate
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cost Range
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rehabResults.breakdown.map((item, index) => {
                  const budgetItemCost = Math.round(item.cost * 0.75);
                  const luxuryItemCost = Math.round(item.cost * 1.4);

                  return (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                        ${item.rate}/{item.unit}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(budgetItemCost)} -{" "}
                        {formatCurrency(luxuryItemCost)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td
                    colSpan="3"
                    className="px-4 py-3 text-sm font-medium text-gray-700 text-right"
                  >
                    Total Range:
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-blue-800 text-right">
                    {formatCurrency(budgetCost)} - {formatCurrency(luxuryCost)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="text-center p-6 border border-gray-200 rounded-lg bg-gray-50">
            <p className="text-gray-500">
              Select at least one component to see the cost breakdown.
            </p>
          </div>
        )}

        {/* Educational Note */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h4 className="font-medium text-blue-800 mb-2">
            Understanding Rehab Costs
          </h4>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>• Contractor costs include labor, materials, and overhead</li>
            <li>• DIY costs include only materials (when available)</li>
            <li>
              • Some specialized work (plumbing, electrical, HVAC) may require
              licensed professionals
            </li>
            <li>
              • All estimates are based on Q1 2025 national average data from
              This Old House
            </li>
            <li>
              • Budget quality uses basic materials and finishes (20-30% less
              than modest)
            </li>
            <li>
              • Modest quality (shown as main estimate) uses mid-grade materials
            </li>
            <li>
              • Luxury quality uses premium materials and finishes (30-50% more
              than modest)
            </li>
            <li>
              • Costs can vary significantly by location, material quality, and
              specific project requirements
            </li>
            <li>
              • It&apos;s recommended to get multiple quotes from contractors
              for accurate pricing
            </li>
          </ul>
        </div>
      </div>
    );
  };

  // Helper function to render calculator content
  const renderCalculatorContent = () => {
    return (
      <>
        {activeTab === "components" ? (
          <>
            {renderComponentSelection()}
            {renderPropertyDetails()}
          </>
        ) : (
          renderCostSummary()
        )}
      </>
    );
  };

  // Conditional rendering based on window type
  if (!isOpen) return null;

  // If rendered in an external window, don't use modal overlay
  if (isExternalWindow) {
    return (
      <div className="bg-white rounded-xl w-full max-w-md mx-auto shadow-md">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              Rehab Cost Estimator
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Estimate renovation costs with preloaded average prices for common
            repairs
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "components"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("components")}
            aria-label="Components tab"
          >
            Components
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "summary"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("summary")}
            aria-label="Cost Summary tab"
          >
            Cost Summary
          </button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {renderCalculatorContent()}
        </div>
      </div>
    );
  }

  // Modal overlay for in-app display
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-md relative shadow-xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              Rehab Cost Estimator
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Estimate renovation costs with preloaded average prices for common
            repairs
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "components"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("components")}
            aria-label="Components tab"
          >
            Components
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "summary"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("summary")}
            aria-label="Cost Summary tab"
          >
            Cost Summary
          </button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {renderCalculatorContent()}
        </div>
      </div>
    </div>
  );
};

RehabEstimator.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isExternalWindow: PropTypes.bool,
};

export default RehabEstimator;
