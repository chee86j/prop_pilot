import { useState, useEffect, useCallback } from "react";
import { X, Info, DollarSign, Calendar, Percent, Download } from "lucide-react";
import PropTypes from "prop-types";

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
          className="pl-8 pr-4 py-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
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
};

const AmortizationCalculator = ({
  isOpen,
  onClose,
  isExternalWindow = false,
}) => {
  const [formData, setFormData] = useState({
    loanAmount: 300000,
    interestRate: 6.5,
    loanTerm: 30,
    extraPayment: 0,
    startDate: new Date().toISOString().split("T")[0],
  });

  const [schedule, setSchedule] = useState([]);
  const [summary, setSummary] = useState({
    totalPayments: 0,
    totalInterest: 0,
    payoffDate: "",
    timeShaved: 0,
    interestSaved: 0,
  });

  const [showInfo, setShowInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("inputs"); // 'inputs', 'schedule'

  const calculateAmortization = useCallback(() => {
    // Extract values from form data
    const principal = parseFloat(formData.loanAmount) || 0;
    const annualRate = parseFloat(formData.interestRate) || 0;
    const years = parseInt(formData.loanTerm, 10) || 0;
    const extraPayment = parseFloat(formData.extraPayment) || 0;
    const startDate = new Date(formData.startDate);

    // If any required value is missing, return
    if (principal <= 0 || annualRate <= 0 || years <= 0) {
      setSchedule([]);
      setSummary({
        totalPayments: 0,
        totalInterest: 0,
        payoffDate: "",
        timeShaved: 0,
        interestSaved: 0,
      });
      return;
    }

    // Calculate monthly rate and number of payments
    const monthlyRate = annualRate / 100 / 12;
    const totalPayments = years * 12;

    // Calculate monthly payment using amortization formula
    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);

    // Calculate regular schedule for comparison
    const regularSchedule = calculateRegularSchedule(
      principal,
      monthlyRate,
      totalPayments,
      startDate
    );

    // Calculate schedule with extra payments
    const extendedSchedule = calculateWithExtraPayments(
      principal,
      monthlyRate,
      monthlyPayment,
      extraPayment,
      startDate
    );

    // Calculate summary statistics
    const regularTotalInterest = regularSchedule.reduce(
      (sum, payment) => sum + payment.interestPayment,
      0
    );
    const extendedTotalInterest = extendedSchedule.reduce(
      (sum, payment) => sum + payment.interestPayment,
      0
    );
    const interestSaved = regularTotalInterest - extendedTotalInterest;
    const timeShaved = regularSchedule.length - extendedSchedule.length;

    // Set the active schedule based on whether extra payments are being made
    const activeSchedule =
      extraPayment > 0 ? extendedSchedule : regularSchedule;

    // Get payoff date from the last payment
    const payoffDate =
      activeSchedule.length > 0
        ? activeSchedule[activeSchedule.length - 1].date
        : "";

    setSchedule(activeSchedule);
    setSummary({
      totalPayments: monthlyPayment + extraPayment,
      totalInterest: extendedTotalInterest,
      payoffDate: payoffDate,
      timeShaved: timeShaved,
      interestSaved: interestSaved,
      monthlyPayment: monthlyPayment,
    });
  }, [formData]);

  // Calculate amortization schedule whenever form data changes
  useEffect(() => {
    calculateAmortization();
  }, [calculateAmortization]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Convert to appropriate type
    let processedValue = value;
    if (name === "loanAmount" || name === "extraPayment") {
      processedValue = value === "" ? "" : parseFloat(value);
    } else if (name === "interestRate") {
      processedValue = value === "" ? "" : parseFloat(value);
    } else if (name === "loanTerm") {
      processedValue = value === "" ? "" : parseInt(value, 10);
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: processedValue,
    }));
  };

  const calculateRegularSchedule = (
    principal,
    monthlyRate,
    totalPayments,
    startDate
  ) => {
    const schedule = [];
    let balance = principal;
    let paymentDate = new Date(startDate);

    for (
      let paymentNumber = 1;
      paymentNumber <= totalPayments;
      paymentNumber++
    ) {
      // Calculate interest and principal for this payment
      const interestPayment = balance * monthlyRate;
      const monthlyPayment =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);
      const principalPayment = monthlyPayment - interestPayment;

      // Update balance
      balance -= principalPayment;
      if (balance < 0.01) balance = 0; // Handle floating point precision issues

      // Format date
      const formattedDate = paymentDate.toISOString().split("T")[0];

      // Add payment to schedule
      schedule.push({
        paymentNumber,
        date: formattedDate,
        payment: monthlyPayment,
        principalPayment,
        interestPayment,
        balance,
        extraPayment: 0,
      });

      // Move to next month
      paymentDate = new Date(paymentDate);
      paymentDate.setMonth(paymentDate.getMonth() + 1);
    }

    return schedule;
  };

  const calculateWithExtraPayments = (
    principal,
    monthlyRate,
    monthlyPayment,
    extraPayment,
    startDate
  ) => {
    const schedule = [];
    let balance = principal;
    let paymentDate = new Date(startDate);
    let paymentNumber = 1;

    while (balance > 0) {
      // Calculate interest and principal for this payment
      const interestPayment = balance * monthlyRate;
      let principalPayment = monthlyPayment - interestPayment;

      // Add extra payment if balance is sufficient
      let actualExtraPayment = 0;
      if (extraPayment > 0 && balance > principalPayment) {
        actualExtraPayment = Math.min(extraPayment, balance - principalPayment);
      }

      // Update balance
      balance -= principalPayment + actualExtraPayment;
      if (balance < 0.01) balance = 0; // Handle floating point precision issues

      // Format date
      const formattedDate = paymentDate.toISOString().split("T")[0];

      // Add payment to schedule
      schedule.push({
        paymentNumber,
        date: formattedDate,
        payment: monthlyPayment + actualExtraPayment,
        principalPayment,
        interestPayment,
        balance,
        extraPayment: actualExtraPayment,
      });

      // Move to next month
      paymentDate = new Date(paymentDate);
      paymentDate.setMonth(paymentDate.getMonth() + 1);
      paymentNumber++;

      // Break if balance is paid off
      if (balance === 0) break;
    }

    return schedule;
  };

  const downloadAmortizationSchedule = () => {
    // Create CSV content
    let csvContent =
      "Payment Number,Date,Payment Amount,Principal,Interest,Extra Payment,Balance\n";

    schedule.forEach((payment) => {
      csvContent += `${payment.paymentNumber},${
        payment.date
      },${payment.payment.toFixed(2)},${payment.principalPayment.toFixed(
        2
      )},${payment.interestPayment.toFixed(2)},${payment.extraPayment.toFixed(
        2
      )},${payment.balance.toFixed(2)}\n`;
    });

    // Create download link
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "amortization_schedule.csv");
    document.body.appendChild(link);

    // Trigger download
    link.click();

    // Clean up
    document.body.removeChild(link);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Helper function to render calculator inputs
  const renderInputs = () => {
    return (
      <div>
        <InputField
          label="Loan Amount"
          name="loanAmount"
          value={formData.loanAmount}
          tooltip="The total amount borrowed for your mortgage"
          onChange={handleInputChange}
          onInfoClick={setShowInfo}
          min={1000}
          step={1000}
          placeholder="300000"
          icon={DollarSign}
        />
        {showInfo === "loanAmount" && (
          <div className="mt-1 p-2 bg-gray-800 text-white text-sm rounded-md">
            The total principal amount of the loan
            <button
              onClick={() => setShowInfo(null)}
              className="absolute top-1 right-1 text-white"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <InputField
          label="Annual Interest Rate (%)"
          name="interestRate"
          value={formData.interestRate}
          tooltip="The annual interest rate as a percentage"
          onChange={handleInputChange}
          onInfoClick={setShowInfo}
          min={0.1}
          max={25}
          step={0.125}
          placeholder="6.5"
          icon={Percent}
        />
        {showInfo === "interestRate" && (
          <div className="mt-1 p-2 bg-gray-800 text-white text-sm rounded-md">
            The annual interest rate expressed as a percentage (e.g., 6.5 for
            6.5%)
            <button
              onClick={() => setShowInfo(null)}
              className="absolute top-1 right-1 text-white"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <InputField
          label="Loan Term (Years)"
          name="loanTerm"
          value={formData.loanTerm}
          tooltip="The length of the loan in years"
          onChange={handleInputChange}
          onInfoClick={setShowInfo}
          min={1}
          max={50}
          step={1}
          placeholder="30"
          icon={Calendar}
        />
        {showInfo === "loanTerm" && (
          <div className="mt-1 p-2 bg-gray-800 text-white text-sm rounded-md">
            The total duration of the loan in years (typically 15 or 30 years)
            <button
              onClick={() => setShowInfo(null)}
              className="absolute top-1 right-1 text-white"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <InputField
          label="Extra Monthly Payment"
          name="extraPayment"
          value={formData.extraPayment}
          tooltip="Additional payment toward principal each month"
          onChange={handleInputChange}
          onInfoClick={setShowInfo}
          min={0}
          step={50}
          placeholder="0"
          icon={DollarSign}
        />
        {showInfo === "extraPayment" && (
          <div className="mt-1 p-2 bg-gray-800 text-white text-sm rounded-md">
            Additional monthly payment that goes directly toward reducing the
            principal
            <button
              onClick={() => setShowInfo(null)}
              className="absolute top-1 right-1 text-white"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <InputField
          label="Start Date"
          name="startDate"
          value={formData.startDate}
          type="date"
          tooltip="The date of the first payment"
          onChange={handleInputChange}
          onInfoClick={setShowInfo}
          icon={Calendar}
        />
        {showInfo === "startDate" && (
          <div className="mt-1 p-2 bg-gray-800 text-white text-sm rounded-md">
            The date when the first payment will be made
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

  // Helper function to render the calculator content
  const renderCalculatorContent = () => {
    return (
      <>
        {activeTab === "inputs" ? (
          renderInputs()
        ) : (
          <div className="overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Amortization Schedule</h3>
              <button
                onClick={downloadAmortizationSchedule}
                className="flex items-center text-blue-600 text-sm font-medium"
                aria-label="Download amortization schedule as CSV"
              >
                <Download size={16} className="mr-1" /> Download CSV
              </button>
            </div>

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Principal
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest
                  </th>
                  {formData.extraPayment > 0 && (
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Extra
                    </th>
                  )}
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schedule.slice(0, 15).map((payment) => (
                  <tr key={payment.paymentNumber}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {payment.paymentNumber}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(payment.payment)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(payment.principalPayment)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(payment.interestPayment)}
                    </td>
                    {formData.extraPayment > 0 && (
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(payment.extraPayment)}
                      </td>
                    )}
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(payment.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {schedule.length > 15 && (
              <div className="text-center mt-3 text-sm text-gray-500">
                Showing first 15 of {schedule.length} payments
              </div>
            )}
          </div>
        )}

        {/* Summary Section - Always show this */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-3">Loan Summary</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly Payment:</span>
              <span className="font-bold">
                {formatCurrency(summary.monthlyPayment || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Payments:</span>
              <span className="font-medium">
                {formatCurrency(summary.monthlyPayment * schedule.length || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Interest:</span>
              <span className="font-medium">
                {formatCurrency(summary.totalInterest || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payoff Date:</span>
              <span className="font-medium">
                {formatDate(summary.payoffDate)}
              </span>
            </div>
          </div>

          {formData.extraPayment > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700 font-medium">
                Making an extra monthly payment of{" "}
                {formatCurrency(formData.extraPayment)} will:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-green-700">
                <li>
                  • Save you {formatCurrency(summary.interestSaved)} in interest
                  payments
                </li>
                <li>
                  • Shorten your loan by {summary.timeShaved}{" "}
                  {summary.timeShaved === 1 ? "payment" : "payments"} (
                  {Math.floor(summary.timeShaved / 12)} years,{" "}
                  {summary.timeShaved % 12} months)
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Educational Note */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h4 className="font-medium text-blue-800 mb-2">
            Understanding Amortization
          </h4>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>• Each payment contains both principal and interest</li>
            <li>• Early in the loan, most payment goes toward interest</li>
            <li>• Later payments have more principal and less interest</li>
            <li>• Extra payments reduce principal and total interest paid</li>
            <li>
              • The faster you pay down principal, the less interest you pay
            </li>
          </ul>
        </div>
      </>
    );
  };

  // Conditional rendering based on window type
  if (!isOpen) return null;

  // If rendered in an external window, don't use modal overlay
  if (isExternalWindow) {
    return (
      <div className="bg-white rounded-xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              Amortization Calculator
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Calculate your mortgage payments and see the impact of extra
            principal payments
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "inputs"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("inputs")}
          >
            Loan Details
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "schedule"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("schedule")}
          >
            Payment Schedule
          </button>
        </div>

        <div className="p-4">{renderCalculatorContent()}</div>
      </div>
    );
  }

  // Modal overlay for in-app display
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-md relative">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              Amortization Calculator
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Calculate your mortgage payments and see the impact of extra
            principal payments
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "inputs"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("inputs")}
          >
            Loan Details
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "schedule"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("schedule")}
          >
            Payment Schedule
          </button>
        </div>

        <div className="p-4">{renderCalculatorContent()}</div>
      </div>
    </div>
  );
};

AmortizationCalculator.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isExternalWindow: PropTypes.bool,
};

export default AmortizationCalculator;
