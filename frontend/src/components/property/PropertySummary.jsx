import { formatCurrency, formatPercent } from "../../utils/format";

const PropertySummary = ({ property }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4">
        <h2 className="text-white text-lg font-semibold">
          Property Summary Dashboard
        </h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Financial Metrics */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Purchase Price</p>
            <p className="text-xl font-bold">
              {formatCurrency(property.purchaseCost)}
            </p>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-600 font-medium">ARV</p>
            <p className="text-xl font-bold">
              {formatCurrency(property.arvSalePrice)}
            </p>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Rehab Cost</p>
            <p className="text-xl font-bold">
              {formatCurrency(property.totalRehabCost)}
            </p>
          </div>

          <div className="bg-amber-50 p-3 rounded-lg">
            <p className="text-sm text-amber-600 font-medium">Total Equity</p>
            <p className="text-xl font-bold">
              {formatCurrency(property.totalEquity)}
            </p>
          </div>

          {/* ROI Metrics */}
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Cash ROI</p>
            <p className="text-xl font-bold">
              {formatPercent(property.cashRoi)}
            </p>
          </div>

          <div className="bg-teal-50 p-3 rounded-lg">
            <p className="text-sm text-teal-600 font-medium">Cap Rate</p>
            <p className="text-xl font-bold">
              {formatPercent(property.purchaseCapRate)}
            </p>
          </div>

          <div className="bg-indigo-50 p-3 rounded-lg">
            <p className="text-sm text-indigo-600 font-medium">
              Monthly Cashflow
            </p>
            <p className="text-xl font-bold">
              {formatCurrency(property.cashFlow)}
            </p>
          </div>

          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-sm text-orange-600 font-medium">
              Projected Profit
            </p>
            <p className="text-xl font-bold">
              {formatCurrency(property.projectNetProfitIfSold)}
            </p>
          </div>
        </div>

        {/* Property Status */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {property.numUnits > 1 ? `${property.numUnits} Units` : "1 Unit"}
          </span>
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {property.bedroomsDescription || "N/A"} Bed
          </span>
          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {property.bathroomsDescription || "N/A"} Bath
          </span>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {property.county || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertySummary; 