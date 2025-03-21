/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import ConstructionDraw from "./ConstructionDraw";
import PhaseTimeline from "./PhaseTimeline";
import PhaseForm from "./PhaseForm";
import ProfitAndLoss from "./ProfitAndLoss";
import OperatingExpense from "./OperatingExpense";
import RentalIncome from "./RentalIncome";
import CapitalExpenditure from "./CapitalExpenditure";
import RentalAnalysis from "./RentalAnalysis";
// import CsvDisplay from "./CsvDisplay";
// import CsvReader from "./CsvReader";
import { formatFullCurrency } from "../utils/formatting";
import { ChevronsUp, ChevronsDown, Download, Printer, Edit2, Save, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResearchDropdown from "./ResearchDropdown";

const PropertyDetails = ({ propertyId }) => {
  const detailsPrintRef = useRef(null);
  const financialsPrintRef = useRef(null);
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [phases, setPhases] = useState([]);
  const [isEditingPhase, setIsEditingPhase] = useState(false);
  const [currentPhase, setCurrentPhase] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    foreclosureInfo: false,
    location: false,
    departments: false,
    outlayToDate: true,
    saleProjection: true,
    utilityInformation: false,
    keyPlayers: false,
    lender: false,
    salesAndMarketing: false,
  });
  const [isAddingPhase, setIsAddingPhase] = useState(false);
  // const [csvData, setCsvData] = useState(null);
  // const handleFileUpload = (data) => {
  //   setCsvData(data); // Store the parsed CSV data
  // };

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/properties/${propertyId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching property details");
        }

        const data = await response.json();
        setPropertyDetails(data);
        setEditedDetails(data);
      } catch (error) {
        console.error("Error fetching property details:", error);
        toast.error("Failed to load property details");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPhases = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/phases/${propertyId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching phases");
        }

        const data = await response.json();
        setPhases(data);
      } catch (error) {
        console.error("Error fetching phases:", error);
      }
    };

    fetchPropertyDetails();
    fetchPhases();
  }, [propertyId]);

  const handleEditChange = (e) => {
    setEditedDetails({ ...editedDetails, [e.target.name]: e.target.value });
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const saveChanges = async () => {
    // Clear any previous error messages
    setErrorMessage("");

    // Validate required fields
    const requiredFields = ["propertyName", "address"]; // Add any other required fields
    const missingFields = requiredFields.filter(field => !editedDetails[field]);

    if (missingFields.length > 0) {
      setErrorMessage(`Please fill in all required fields: ${missingFields.join(", ")}`);
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/properties/${propertyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(editedDetails),
        }
      );

      if (!response.ok) {
        throw new Error("Error saving property details");
      }

      const data = await response.json();
      setPropertyDetails(data);
      toggleEditMode();
      toast.success("Property details saved successfully!");
    } catch (error) {
      console.error("Error saving property details:", error);
      setErrorMessage("Failed to save property details.");
      toast.error("Failed to save property details.");
    }
  };

  const cancelChanges = () => {
    setEditedDetails(propertyDetails);
    setErrorMessage("");
    toggleEditMode();
  };

  const renderInputField = (label, name, type = "text", isNumber = false) => {
    const value = editMode ? editedDetails[name] : propertyDetails[name];
    const hasError = errorMessage && !value && type !== "number";

    return (
      <div className="form-group mb-4">
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor={name}
        >
          {label}
        </label>
          <input
          id={name}
            type={type}
            name={name}
          value={value || ""}
            onChange={handleEditChange}
          className={`
            w-full px-3 py-2 rounded-lg border
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition duration-150 ease-in-out
            ${isNumber ? "text-right" : ""}
            ${hasError ? "border-red-500" : "border-gray-300"}
          `}
        />
        {hasError && (
          <p className="mt-1 text-sm text-red-500">
            {`${label} is required`}
          </p>
        )}
      </div>
    );
  };

  const handlePrintDetails = () => {
    if (detailsPrintRef.current) {
      window.print();
    }
  };

  const handlePrintFinancials = () => {
    if (financialsPrintRef.current) {
      window.print();
    }
  };

  const exportToCSV = (data, filename) => {
    const csvContent = "data:text/csv;charset=utf-8," + data;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const toggleAllSections = () => {
    const allExpanded = Object.values(expandedSections).every((val) => val);
    setExpandedSections((prevSections) => {
      const newSections = {};
      for (const section in prevSections) {
        newSections[section] = !allExpanded;
      }
      return newSections;
    });
  };

  const renderSectionTitle = (title, sectionName) => (
    <div
      className="flex justify-between items-center mb-2 cursor-pointer group"
      onClick={() => toggleSection(sectionName)}
    >
      <h2 className="text-lg font-bold text-blue-700 cursor-pointer">
        {title}
      </h2>
      <button className="focus:outline-none transition-transform duration-200 transform group-hover:scale-110">
        {expandedSections[sectionName] ? (
          <ChevronsUp size={20} className="text-blue-600" />
        ) : (
          <ChevronsDown size={20} className="text-blue-600" />
        )}
      </button>
    </div>
  );

  const handleEditPhase = (phase) => {
    setCurrentPhase(phase);
    setIsEditingPhase(true);
    setIsAddingPhase(false); // Make sure we're not in adding mode
  };

  const handleDeletePhase = async (phaseId) => {
    if (window.confirm("Are you sure you want to delete this phase?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/phases/${phaseId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error deleting phase");
        }

        setPhases(phases.filter((phase) => phase.id !== phaseId));
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleSavePhase = async (formData) => {
    const phaseData = {
      ...formData,
      property_id: propertyId,
    };

    try {
      const response = await fetch(
        phaseData.id
          ? `http://localhost:5000/api/phases/${phaseData.id}`
          : "http://localhost:5000/api/phases",
        {
          method: phaseData.id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(phaseData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error saving phase");
      }

      // Get the updated phase data from the response
      const savedPhase = await response.json();

      // Update the phases state immediately
      setPhases((currentPhases) =>
        phaseData.id
          ? currentPhases.map((phase) =>
              phase.id === phaseData.id ? savedPhase : phase
            )
          : [...currentPhases, savedPhase]
      );

      // Reset form state
      setIsEditingPhase(false);
      setIsAddingPhase(false);
      setCurrentPhase({});
      toast.success("Phase saved successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to save phase.");
    }
  };

  const handleAddPhase = () => {
    setCurrentPhase({}); // Reset current phase to empty
    setIsAddingPhase(true);
    setIsEditingPhase(false);
  };

  const handleCancelPhase = () => {
    setCurrentPhase({});
    setIsAddingPhase(false);
    setIsEditingPhase(false);
  };

  const renderExpandAllButton = () => (
    <button
      onClick={toggleAllSections}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-200 
      bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
      rounded-lg shadow hover:shadow-lg transform hover:scale-105 active:scale-95"
    >
      {Object.values(expandedSections).every((val) => val) ? (
        <>
          <ChevronsUp size={18} className="transition-transform duration-200" />
          <span>Collapse All</span>
        </>
      ) : (
        <>
          <ChevronsDown
            size={18}
            className="transition-transform duration-200"
          />
          <span>Expand All</span>
        </>
      )}
    </button>
  );

  // Loading state UI with better mobile handling
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-pulse space-y-4 w-full max-w-lg">
          <div className="h-8 sm:h-12 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-2/3 mx-auto"></div>
          <div className="grid gap-4 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 sm:h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!propertyDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-600">
          <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
          <p>The requested property details could not be loaded.</p>
        </div>
      </div>
    );
  }

  // Enhanced button styles
  const buttonStyles = {
    primary: `
      inline-flex items-center gap-1 sm:gap-2 
      px-3 py-1.5 sm:px-4 sm:py-2
      text-sm sm:text-base
      bg-gradient-to-r from-blue-500 to-blue-600 
      hover:from-blue-600 hover:to-blue-700 
      text-white font-medium rounded-lg shadow-sm 
      hover:shadow-md transition-all duration-200 
      transform hover:scale-105 active:scale-95
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      w-full sm:w-auto justify-center sm:justify-start
    `,
    secondary: `
      inline-flex items-center gap-1 sm:gap-2
      px-3 py-1.5 sm:px-4 sm:py-2
      text-sm sm:text-base
      bg-gray-100 hover:bg-gray-200 
      text-gray-700 font-medium rounded-lg shadow-sm 
      hover:shadow-md transition-all duration-200 
      transform hover:scale-105 active:scale-95
      focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
      w-full sm:w-auto justify-center sm:justify-start
    `,
  };

  // Enhanced card styles
  const cardStyles = `
    bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden
    transition-all duration-300 ease-in-out
    hover:shadow-xl transform hover:-translate-y-1
    focus-within:ring-2 focus-within:ring-blue-500
    p-4 sm:p-6 lg:p-8
    mx-4 sm:mx-0
  `;

  const progress = 75; // Replace with actual progress calculation

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        className="sm:top-4 top-2 sm:right-4 right-2"
        toastClassName="sm:min-w-[300px] min-w-[250px]"
      />
      
      {/* Header Section */}
      <header className="max-w-7xl mx-auto mb-4 sm:mb-6 lg:mb-8 px-4 sm:px-6 lg:px-8" role="banner">
        <div className="text-center sm:text-left">
          <h1 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 
                       break-words leading-tight"
            aria-label={`Property Details for ${propertyDetails.propertyName}`}
          >
            {propertyDetails.propertyName}
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 break-words">
            {propertyDetails.address}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Construction Progress Card */}
        <section className={`${cardStyles} p-6`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span role="img" aria-label="Construction">🏗️</span>
            Construction Progress
          </h2>
          <ConstructionDraw propertyId={propertyId} />
        </section>

        {/* Project Timeline Card */}
        <section className={`${cardStyles} p-6`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span role="img" aria-label="Timeline">📅</span>
              Project Timeline
            </h2>
            <button
              onClick={handleAddPhase}
              className={buttonStyles.primary}
              aria-label="Add new phase"
            >
              Add Phase
            </button>
          </div>
          <PhaseTimeline
            phases={phases}
            onEdit={handleEditPhase}
            onDelete={handleDeletePhase}
          />
          {(isEditingPhase || isAddingPhase) && (
            <div className="mt-6">
              <PhaseForm
                initialData={currentPhase}
                onSave={handleSavePhase}
                onCancel={handleCancelPhase}
              />
            </div>
          )}
        </section>

        {/* Property Information Card */}
        <section className={`${cardStyles} p-6`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span role="img" aria-label="Details">📋</span>
              Property Information
            </h2>
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <button
                    onClick={saveChanges}
                    className={buttonStyles.primary}
                    aria-label="Save changes"
                  >
                    <Save size={18} />
                    <span className="sr-only sm:not-sr-only">Save</span>
                  </button>
                  <button
                    onClick={cancelChanges}
                    className={buttonStyles.secondary}
                    aria-label="Cancel editing"
                  >
                    <X size={18} />
                    <span className="sr-only sm:not-sr-only">Cancel</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={toggleEditMode}
                    className={buttonStyles.primary}
                    aria-label="Edit property details"
                  >
                    <Edit2 size={18} />
                    <span className="sr-only sm:not-sr-only">Edit</span>
                  </button>
                  {renderExpandAllButton()}
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Foreclosure Information Section */}
            <div className="foreclosureInfo hover:bg-gray-200 hover:scale-[1.02] bg-gray-50 p-4 shadow-sm rounded-md">
              {renderSectionTitle("Foreclosure Information", "foreclosureInfo")}
              {expandedSections.foreclosureInfo && (
                <>
                  {renderInputField("Detail Link", "detail_link")}
                  {renderInputField("Property ID", "property_id")}
                  {renderInputField("Sheriff Number", "sheriff_number")}
                  {renderInputField("Status Date", "status_date", "date")}
                  {renderInputField("Plaintiff", "plaintiff")}
                  {renderInputField("Defendant", "defendant")}
                  {renderInputField("Zillow URL", "zillow_url")}
                </>
              )}
            </div>

            {/* Location Section */}
            <div className="propLocation hover:bg-gray-200 hover:scale-[1.02] bg-gray-50 p-4 shadow-sm rounded-md">
              {renderSectionTitle("Location", "location")}
              {expandedSections.location && (
                <>
                  {renderInputField("Property Name", "propertyName")}
                  {renderInputField("Address", "address")}
                  {renderInputField("City", "city")}
                  {renderInputField("State", "state")}
                  {renderInputField("Zip Code", "zipCode", "number")}
                  {renderInputField("County", "county")}
                  {renderInputField("Bedrooms", "bedroomsDescription")}
                  {renderInputField("Bathrooms", "bathroomsDescription")}
                  {renderInputField("Kitchen", "kitchenDescription")}
                  {renderInputField("Amenities", "amenitiesDescription")}
                </>
              )}
            </div>

            {/* Departments Section */}
            <div className="propDepartments hover:bg-gray-200 hover:scale-[1.02] bg-gray-50 p-4 shadow-sm rounded-md">
              {renderSectionTitle("Departments", "departments")}
              {expandedSections.departments && (
                <>
                  {renderInputField("Municipal Building Address", "municipalBuildingAddress")}
                  {renderInputField("Building Dept", "buildingDepartmentContact")}
                  {renderInputField("Electric Dept", "electricDepartmentContact")}
                  {renderInputField("Plumbing Dept", "plumbingDepartmentContact")}
                  {renderInputField("Fire Dept", "fireDepartmentContact")}
                  {renderInputField("Homeowners Association", "homeownersAssociationContact")}
                  {renderInputField("Environmental Dept", "environmentalDepartmentContact")}
                </>
              )}
            </div>

            {/* Total Outlay To Date Section */}
            <div className="propTotalOutlayToDate hover:bg-gray-200 hover:scale-[1.02] bg-gray-50 p-4 shadow-sm rounded-md">
              {renderSectionTitle("Total Outlay To Date", "outlayToDate")}
              {expandedSections.outlayToDate && (
                <>
                  {renderInputField("Purchase Cost", "purchaseCost", "number", true)}
                  {renderInputField("Refinance Cost", "refinanceCost", "number", true)}
                  {renderInputField("Equipment Cost", "equipmentCost", "number", true)}
                  {renderInputField("Construction Cost", "constructionCost", "number", true)}
                  {renderInputField("Large Repair Cost", "largeRepairCost", "number", true)}
                  {renderInputField("Renovation Cost", "renovationCost", "number", true)}
                  {renderInputField("Total Rehab Cost", "totalRehabCost", "number", true)}
                  {renderInputField("Kick Start Funds", "kickStartFunds", "number", true)}
                  {renderInputField("Lender Construction Draws Received", "lenderConstructionDrawsReceived", "number", true)}
                  <div className="border-t-2 border-black border-solid my-4"></div>
                  {renderInputField("Utilities Cost", "utilitiesCost", "number", true)}
                  {renderInputField("Sewer Yearly Cost", "sewer", "number", true)}
                  {renderInputField("Water Yearly Cost", "water", "number", true)}
                  {renderInputField("Lawn Yearly Cost", "lawn", "number", true)}
                  {renderInputField("Garbage Yearly Cost", "garbage", "number", true)}
                  {renderInputField("Yearly Property Taxes", "yearlyPropertyTaxes", "number", true)}
                  {renderInputField("Mortgage Paid", "mortgagePaid", "number", true)}
                  {renderInputField("Homeowners Insurance", "homeownersInsurance", "number", true)}
                  {renderInputField("Expected Yearly Rent", "expectedYearlyRent", "number", true)}
                  {renderInputField("Rental Income Received", "rentalIncomeReceived", "number", true)}
                  {renderInputField("Number of Units", "numUnits", "number", true)}
                  {renderInputField("Vacancy Rate", "vacancyRate", "number", true)}
                  {renderInputField("Average Tenant Stay", "avgTenantStay", "number", true)}
                  {renderInputField("Other Monthly Income", "otherMonthlyIncome", "number", true)}
                  {renderInputField("Vacancy Loss", "vacancyLoss", "number", true)}
                  {renderInputField("Management Fees", "managementFees", "number", true)}
                  {renderInputField("Maintenance Costs", "maintenanceCosts", "number", true)}
                  <div className="border-t-2 border-black border-solid my-4"></div>
                  {renderInputField("Total Equity", "totalEquity", "number", true)}
                </>
              )}
            </div>

            {/* Sale Projection Section */}
            <div className="propSaleProjection hover:bg-gray-200 hover:scale-[1.02] bg-gray-50 p-4 shadow-sm rounded-md">
              {renderSectionTitle("Sale Projection", "saleProjection")}
              {expandedSections.saleProjection && (
                <>
                  {renderInputField("ARV Sale Price", "arvSalePrice", "number", true)}
                  <div className="border-t-2 border-black border-solid my-4"></div>
                  {renderInputField("Realtor Fees", "realtorFees", "number", true)}
                  {renderInputField("Remaining Property Tax", "propTaxTillEndOfYear", "number", true)}
                  {renderInputField("Lender Loan Balance", "lenderLoanBalance", "number", true)}
                  {renderInputField("Pay Off Statement", "payOffStatement", "number", true)}
                  {renderInputField("Attorney Fees", "attorneyFees", "number", true)}
                  {renderInputField("Misc Fees", "miscFees", "number", true)}
                  {renderInputField("Utilities", "utilities", "number", true)}
                  {renderInputField("Cash to Close from Purchase", "cash2closeFromPurchase", "number", true)}
                  {renderInputField("Cash to Close from Refinance", "cash2closeFromRefinance", "number", true)}
                  {renderInputField("Total Rehab Costs", "totalRehabCosts", "number", true)}
                  {renderInputField("Expected Remaining Rent End To Year", "expectedRemainingRentEndToYear", "number", true)}
                  {renderInputField("Mortgage Paid", "mortgagePaid", "number", true)}
                  <div className="border-t-2 border-black border-solid my-4"></div>
                  {renderInputField("Total Expenses", "totalExpenses", "number", true)}
                  {renderInputField("Total Expected Draws In", "totalConstructionDrawsReceived", "number", true)}
                  <div className="border-t-2 border-black border-solid my-4"></div>
                  {renderInputField("Project Net Profit If Sold", "projectNetProfitIfSold", "number", true)}
                  {renderInputField("Cash Flow", "cashFlow", "number", true)}
                  {renderInputField("Cash ROI", "cashRoi", "number", true)}
                  {renderInputField("Rule 2 Percent", "rule2Percent", "number", true)}
                  {renderInputField("Rule 50 Percent", "rule50Percent", "number", true)}
                  {renderInputField("Finance Amount", "financeAmount", "number", true)}
                  {renderInputField("Purchase Cap Rate", "purchaseCapRate", "number", true)}
                </>
              )}
            </div>

            {/* Utility Information Section */}
            <div className="propUtilityInformation hover:bg-gray-200 hover:scale-[1.02] bg-gray-50 p-4 shadow-sm rounded-md">
              {renderSectionTitle("Utility Information", "utilityInformation")}
              {expandedSections.utilityInformation && (
                <>
                  {renderInputField("Type of Heating & Cooling", "typeOfHeatingAndCooling")}
                  <div className="border-t-2 border-transparent my-2"></div>
                  {renderInputField("Water Company", "waterCompany")}
                  {renderInputField("Water Account Number", "waterAccountNumber")}
                  <div className="border-t-2 border-transparent my-2"></div>
                  {renderInputField("Electric Company", "electricCompany")}
                  {renderInputField("Electric Account Number", "electricAccountNumber")}
                  <div className="border-t-2 border-transparent my-2"></div>
                  {renderInputField("Gas or Oil Company", "gasOrOilCompany")}
                  {renderInputField("Gas or Oil Account Number", "gasOrOilAccountNumber")}
                  <div className="border-t-2 border-transparent my-2"></div>
                  {renderInputField("Sewer Company", "sewerCompany")}
                  {renderInputField("Sewer Account Number", "sewerAccountNumber")}
                </>
              )}
            </div>

            {/* Lender Information Section */}
            <div className="propLenderInformation hover:bg-gray-200 hover:scale-[1.02] bg-gray-50 p-4 shadow-sm rounded-md">
              {renderSectionTitle("Lender", "lender")}
              {expandedSections.lender && (
                <>
                  {renderInputField("Lender", "lender")}
                  {renderInputField("Lender Phone", "lenderPhone")}
                  <div className="border-t-2 border-transparent my-2"></div>
                  {renderInputField("Refinance Lender", "refinanceLender")}
                  {renderInputField("Refinance Lender Phone", "refinanceLenderPhone")}
                  <div className="border-t-2 border-transparent my-2"></div>
                  {renderInputField("Loan Officer", "loanOfficer")}
                  {renderInputField("Loan Officer Phone", "loanOfficerPhone")}
                  {renderInputField("Loan Number", "loanNumber")}
                  {renderInputField("Down Payment Percentage", "downPaymentPercentage", "number")}
                  {renderInputField("Loan Interest Rate", "loanInterestRate", "number")}
                  {renderInputField("PMI Percentage", "pmiPercentage", "number")}
                  {renderInputField("Mortgage Years", "mortgageYears", "number")}
                  {renderInputField("Lender Points Amount", "lenderPointsAmount", "number")}
                  {renderInputField("Other Fees", "otherFees", "number")}
                </>
              )}
            </div>

            {/* Key Players Section */}
            <div className="propKeyPlayers hover:bg-gray-200 hover:scale-[1.02] bg-gray-50 p-4 shadow-sm rounded-md">
              {renderSectionTitle("Key Players", "keyPlayers")}
              {expandedSections.keyPlayers && (
                <>
                  {renderInputField("Seller's Agent", "sellersAgent")}
                  {renderInputField("Seller's Broker", "sellersBroker")}
                  {renderInputField("Seller's Agent Phone", "sellersAgentPhone")}
                  {renderInputField("Seller's Attorney", "sellersAttorney")}
                  {renderInputField("Seller's Attorney Phone", "sellersAttorneyPhone")}
                  <div className="border-t-2 border-black border-solid my-4"></div>
                  {renderInputField("Escrow Company", "escrowCompany")}
                  {renderInputField("Escrow Agent", "escrowAgent")}
                  {renderInputField("Escrow Agent Phone", "escrowAgentPhone")}
                  <div className="border-t-2 border-black border-solid my-4"></div>
                  {renderInputField("Buyer's Agent", "buyersAgent")}
                  {renderInputField("Buyer's Broker", "buyersBroker")}
                  {renderInputField("Buyer's Agent Phone", "buyersAgentPhone")}
                  {renderInputField("Buyer's Attorney", "buyersAttorney")}
                  {renderInputField("Buyer's Attorney Phone", "buyersAttorneyPhone")}
                  <div className="border-t-2 border-black border-solid my-4"></div>
                  {renderInputField("Title Insurance Company", "titleInsuranceCompany")}
                  {renderInputField("Title Agent", "titleAgent")}
                  {renderInputField("Title Agent Phone", "titleAgentPhone")}
                  {renderInputField("Title Company Phone", "titlePhone")}
                </>
              )}
            </div>

            {/* Sales & Marketing Section */}
            <div className="propSalesAndMarketing hover:bg-gray-200 hover:scale-[1.02] bg-gray-50 p-4 shadow-sm rounded-md">
              {renderSectionTitle("Sales & Marketing", "salesAndMarketing")}
              {expandedSections.salesAndMarketing && (
                <>
                  {renderInputField("Property Manager", "propertyManager")}
                  {renderInputField("Property Manager Phone", "propertyManagerPhone")}
                  {renderInputField("Property Management Company", "propertyManagementCompany")}
                  {renderInputField("Property Management Phone", "propertyManagementPhone")}
                  <div className="border-t-2 border-black border-solid my-4"></div>
                  {renderInputField("Photographer", "photographer")}
                  {renderInputField("Photographer Phone", "photographerPhone")}
                  {renderInputField("Videographer", "videographer")}
                  {renderInputField("Videographer Phone", "videographerPhone")}
                  <div className="border-t-2 border-black border-solid my-4"></div>
                  {renderInputField("Appraisal Company", "appraisalCompany")}
                  {renderInputField("Appraiser", "appraiser")}
                  {renderInputField("Appraiser Phone", "appraiserPhone")}
                  {renderInputField("Surveyor", "surveyor")}
                  {renderInputField("Surveyor Phone", "surveyorPhone")}
                  {renderInputField("Home Inspector", "homeInspector")}
                  {renderInputField("Home Inspector Phone", "homeInspectorPhone")}
                  <div className="border-t-2 border-black border-solid my-4"></div>
                  {renderInputField("Architect", "architect")}
                  {renderInputField("Architect Phone", "architectPhone")}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Financial Analysis Section */}
        <section className={`${cardStyles}`} ref={financialsPrintRef}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Financial Analysis
            </h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={handlePrintFinancials}
                className={buttonStyles.primary}
                aria-label="Print financial analysis"
              >
                <Printer size={16} className="sm:mr-2" />
                <span className="hidden sm:inline">Print Financial Analysis</span>
                <span className="sm:hidden">Print</span>
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:gap-8">
            {/* Financial Components with improved mobile layout */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
                  Profit & Loss Statement
                </h3>
                <button
                  onClick={() => exportToCSV(propertyDetails.profitLossData, "profit-loss")}
                  className="w-full sm:w-auto whitespace-nowrap"
                >
                  <Download size={16} className="sm:mr-2" />
                  <span className="hidden sm:inline">Export CSV</span>
                  <span className="sm:hidden">Export</span>
                </button>
              </div>
              <ProfitAndLoss property={propertyDetails} />
            </div>
            {/* Repeat similar pattern for other financial components */}
          </div>
        </section>

        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2 text-right">
            {progress}% Complete
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
